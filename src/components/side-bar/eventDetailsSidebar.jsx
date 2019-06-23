import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "context/Context.jsx";
import { Button, Menu, Icon, Grid, Image, Placeholder, Header } from 'semantic-ui-react';
import ListUsersModal from "components/list-users-modal/list-users-modal";
import GoogleMapReact from 'google-map-react';
import {
    Link
} from "react-router-dom";
import moment from 'moment';
import api from 'api.js';
import "./side-bar.scss";

function eventDetailsSidebar({ attendees, event_data }) {
    const { state } = useContext(AppContext)
    const [isLoading, setIsLoading] = useState(false);
    const [sentAttend, setSentAttend] = useState(false)
    const [addressText, setAddressText] = useState('');
    const [googleApi, setGoogleApi] = useState();


    useEffect(() => {
        if (googleApi && event_data.location_lat) {
            let lat = parseInt(event_data.location_lat * 10000) / 10000;
            let lng = parseInt(event_data.location_lng * 10000) / 10000
            const center = { lat: lat, lng: lng };
            googleApi.map.setCenter(center);
            console.log(center);

            googleApi.geocoder.geocode({ 'location': center }, function (results, status) {
                if (status === 'OK') {
                    if (results[0]) {
                        const marker = new googleApi.maps.Marker({
                            position: center,
                            map: googleApi.map
                        });
                        googleApi.map.setZoom(11);
                        setAddressText(results[0].formatted_address);
                    } else {
                        window.alert('No results found');
                    }
                } else {
                    window.alert('Geocoder failed due to: ' + status);
                }
            });
        }
    }, [googleApi, event_data])


    const attendEvent = async () => {
        setIsLoading(true);
        try {
            const { data } = await api.attendEvent(event_data.event_id);
            setSentAttend(true)
        } catch (error) {

        }
        finally {
            setIsLoading(false);
        }
    }

    function getOrganizer() {
        if (!event_data.organizers) {
            return (
                <Placeholder >
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder>
            );
        }
        return (
            event_data.organizers.map((organizer) => {
                const image_path = api.getImage(organizer.image_path);
                return (
                    <Link key={organizer.account_id} to={'/profile/' + organizer.account_id}>
                        <div>
                            <Image src={image_path} avatar spaced />
                            <span>{organizer.name}</span>
                        </div>
                    </Link>
                );
            })
        );
    }

    function getAttendees() {
        if (!event_data.attendees) {
            return (<div>Loading...</div>);
        }
        return (event_data.attendees.map((attendee, i) =>
            <Image key={i} src={api.getImage(attendee.image_path)} avatar size="mini" spaced />
        ));
    }

    const isAttending = () => {
        if (event_data.attendees) {
            for (let i = 0; i < event_data.attendees.length; i++) {
                if (event_data.attendees[i].account_id === state.userData.account_id) {
                    return true;
                }
            }
            return false;
        }
    }

    const handleApiLoaded = (map, maps) => {
        const geocoder = new maps.Geocoder();
        setGoogleApi({ map, maps, geocoder });
    }

    return (<Menu fluid vertical>
        <Menu.Item>
            {(isAttending() || sentAttend) ?
                <Header as="h3" color="green">You are going to this event</Header>
                :
                <div>
                    <h3>Are you going?</h3>
                    <Button loading={isLoading} color="green" onClick={attendEvent}>Attend</Button>
                </div>}
        </Menu.Item>
        <Menu.Item className="event-details">
            <Grid columns={2}>
                <Grid.Row>
                    <Grid.Column width={1}>
                        <Icon name="calendar"></Icon>
                    </Grid.Column>
                    <Grid.Column textAlign='left' width={12}>
                        {event_data.start_time ? moment(event_data.start_time).format('DD MMM YYYY') : ''}
                        - {event_data.end_time ? moment(event_data.end_time).format('DD MMM YYYY') : ''}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Grid columns={2}>
                <Grid.Row>
                    <Grid.Column width={1}>
                        <Icon name="user"></Icon>
                    </Grid.Column>
                    <Grid.Column textAlign='left' width={12}>
                        {event_data.attending || ''} attending
                            </Grid.Column>
                </Grid.Row>
            </Grid>
            <Grid columns={2}>
                <Grid.Row>
                    <Grid.Column width={1}>
                        <Icon name="point"></Icon>
                    </Grid.Column>
                    <Grid.Column textAlign='left' width={12}>
                        {event_data.city}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Menu.Item>
        <Menu.Item className="text-left">
            <Header as="h2"><Icon name="map pin"></Icon> Location </Header>
            <Header as="h4"> {addressText} </Header>
            <div className="google-maps">
                <GoogleMapReact className="google-maps"
                    bootstrapURLKeys={{ key: 'AIzaSyAEEYO5lpb9dQahzGZsg0Ye6oDLpKrh5-g' }}
                    defaultCenter={{ lat: 39.923, lng: 32.856 }}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
                    defaultZoom={13} >
                </GoogleMapReact>
            </div>
        </Menu.Item>
        <Menu.Item className="text-left">
            <h3>Organizer</h3>
            {getOrganizer()}
        </Menu.Item>
        <Menu.Item className="text-left">
            <h3>Attendees</h3>
            {getAttendees()}
            <div className="see-all-link">
                <ListUsersModal trigger="See all attendees" name={event_data.event_name} allMembers={attendees} />
            </div>
        </Menu.Item>
    </Menu>);
}

export default eventDetailsSidebar;