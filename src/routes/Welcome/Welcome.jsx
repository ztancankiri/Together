import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "context/Context.jsx";
import EventCard from "components/event-card/event-card";
import GroupCard from "components/group-card/group-card";
import { Container, Grid, Button, Dropdown, Header, Loader } from 'semantic-ui-react'
import debounce from 'lodash/debounce';
import moment from 'moment';
import "./Welcome.scss";
import api from "api.js";
import { Planet } from 'react-kawaii';

import DefaultSidebar from "components/side-bar/defaultSidebar";

function Welcome() {
    const { state } = useContext(AppContext);
    const [events, setEvents] = useState([]);
    const [groups, setGroups] = useState([]);
    const [showEvents, setShowEvents] = useState(true);
    const [searchText, setSearchText] = useState(state.userData.location);
    const [cities, setCities] = useState([]);
    const [filterDate, setFilterDate] = useState([new Date(), new Date()]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCities();
        getAllGroups();
    }, [])

    useEffect(() => {
        getAllEvents();
        getAllGroups();
    }, [searchText])

    useEffect(() => {
        getAllEvents();
    }, [filterDate])

    useEffect(() => {
        if (showEvents) {
            getAllEvents();
        } else {
            getAllGroups();
        }
    }, [showEvents])

    async function getAllEvents() {
        setIsLoading(true);
        try {
            const startTime = moment(filterDate[0]).format("YYYY-MM-DD");
            const endTime = moment(filterDate[1]).format("YYYY-MM-DD");
            const { data } = await api.getEvents(startTime, endTime, searchText);
            let eventList = data.map(function (eventItem, index) {
                return <EventCard key={index} event={eventItem} image_path={api.getImage(eventItem.image_path)} />;
            });
            setEvents(eventList);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    async function getAllGroups() {
        setIsLoading(true);
        try {
            const { data } = await api.getGroups(searchText);
            let groupList = data.map(function (groupItem, index) {
                return <GroupCard key={index} group={groupItem} image_path={api.getImage(groupItem.image_path)} />;
            });
            setGroups(groupList);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const displayEvents = () => {
        if (isLoading) {
            return <Loader active />;
        }
        else {
            if (events.length === 0) {
                return (
                    <div align="center">
                        <Planet size={220} mood="sad" color="#FCCB7E" />
                        <Header as="h2">There are no events on this date</Header>
                    </div>
                );
            }
            else {
                return events;
            }
        }
    }

    const displayGroups = () => {
        if (isLoading) {
            return <Loader active />;
        }
        else {
            if (groups.length === 0) {
                return (
                    <div align="center">
                        <Planet size={220} mood="sad" color="#FCCB7E" />
                        <Header as="h2">There are no groups</Header>
                    </div>
                );
            }
            else {
                return groups;
            }
        }
    }

    const getCities = debounce(async () => {
        try {
            const { data } = await api.getAllCities();
            setCities(data.map((item, index) => {
                const city = {};
                city.key = index;
                city.text = item.name;
                city.value = item.name;
                return city;
            }));
        } catch (error) {
            console.error(error)
        }
    }, 500);

    function handleChange(event, { value }) {
        setSearchText(value);
    }

    return (
        <div>
            <Grid>
                <Grid.Column stretched width='3'>
                    <DefaultSidebar value={filterDate} setFilterDate={setFilterDate} showEvents={showEvents} />
                </Grid.Column>
                <Grid.Column stretched width='13'>
                    <Grid>
                        <Grid.Column stretched width='13'>
                            <Container id="cards">
                                <div className="location-filter">
                                    {showEvents ? 'Events in' : 'Groups in'} <Dropdown
                                        placeholder='Search City'
                                        fluid
                                        search
                                        value={searchText}
                                        selection
                                        options={cities}
                                        onChange={handleChange}
                                    />
                                </div>
                                {showEvents ? displayEvents() : displayGroups()}
                            </Container>
                        </Grid.Column>
                        <Grid.Column width='3'>
                            <Button.Group>
                                <Button color="orange" onClick={() => setShowEvents(true)}>Event</Button>
                                <Button.Or />
                                <Button color="red" onClick={() => setShowEvents(false)}>Group</Button>
                            </Button.Group>
                        </Grid.Column>
                    </Grid>
                </Grid.Column>
            </Grid>
        </div>
    );

}

export default Welcome;