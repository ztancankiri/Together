import React, { useState, useEffect, useContext, useRef } from "react";
import { Card, Icon, Image, Grid, Placeholder, Divider, Header, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
import ProfileSidebar from "components/side-bar/profileSidebar";
import GroupCard from "components/group-card/group-card";
import EventCard from "components/event-card/event-card";
import { useImageCrop } from "hooks/useImageCrop";
import { AppContext } from "context/Context.jsx";
import EditProfile from "./EditProfile/EditProfile";
import OtherUserProfile from "./OtherUserProfile/OtherUserProfile";
import Friends from "./Friends/Friends";
import api from 'api.js';

import "./Profile.scss";


function Profile({ match }) {

    if (match.params.id) {
        return (
            <Grid>
                <Grid.Column stretched width='1'>

                </Grid.Column>
                <Grid.Column stretched width='14'>
                    <OtherUserProfile userId={match.params.id} />
                </Grid.Column>
                <Grid.Column stretched width='1'>

                </Grid.Column>
            </Grid>
        );
    }

    const { state, dispatch } = useContext(AppContext);
    const [groups, setGroups] = useState();
    const [userGroups, setUserGroups] = useState([]);
    const [events, setEvents] = useState();
    const [selectedMenuItem, setSelectedMenuItem] = useState('Profile');
    const [profilePicture, setProfilePicture] = useState();
    const [allFriends, setAllFriends] = useState([]);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetchFriends();
    }, [])

    let fileInput = useRef(null)

    const crop_data = {
        height: 300,
        width: 300
    };

    const onComplete = async (img) => {
        try {
            const { data } = await api.uploadImage(img);
            const res = await api.uploadProfilePicture(data.img);
            let profileData = await api.getProfileData();
            dispatch({ type: 'SET_USER_DATA', data: profileData.data });
        } catch (error) {
            console.error(error);
        }
    }

    const { cropModal, croppedImageUrl, setModalOpen, setUploadedImage } = useImageCrop(crop_data, onComplete);

    const getUserAdminGroups = async () => {
        try {
            const { data } = await api.getUserAdminGroups();
            let groupList = data.map(function (groupItem, index) {
                return (
                    <div className='group-card-area'>
                        <GroupCard key={index} group={groupItem} image_path={api.getImage(groupItem.image_path)} />
                        <Button as={Link} to={'/edit-group/' + groupItem.group_id} color="yellow">Manage</Button>
                    </div>
                );
            });
            setGroups(groupList);
        } catch (error) {
            console.error();
        }
    }

    const getUserEvents = async () => {
        try {
            const { data } = await api.getUserEvents();
            let eventList = data.map(function (eventItem, index) {
                return (
                    <div className='group-card-area'>
                        <EventCard key={index} event={eventItem} image_path={api.getImage(eventItem.image_path)} />
                    </div>
                );
            });
            setEvents(eventList);
        } catch (error) {
            console.error();
        }
    }

    const getUserGroups = async () => {
        try {
            const { data } = await api.getUserGroups();
            let eventList = data.map(function (groupItem, index) {
                return (
                    <div className='group-card-area'>
                        <GroupCard key={index} group={groupItem} image_path={api.getImage(groupItem.image_path)} />
                    </div>
                );
            });
            setUserGroups(eventList);
        } catch (error) {
            console.error();
        }
    }

    useEffect(() => {
        getUserAdminGroups();
        getUserEvents();
        getUserGroups();
        setProfilePicture(api.getImage(state.userData.image_path));
    }, [])

    const handleUploadClick = () => {
        fileInput.current.click();
    }

    const uploadImage = (event) => {
        setUploadedImage(URL.createObjectURL(fileInput.current.files[0]));
        setModalOpen(true);
    }

    const fetchFriends = async () => {
        try {
            const { data } = await api.getFriends();
            const requests = await api.getFriendRequests();
            setAllFriends(data);
            setRequests(requests.data);
        }
        catch (error) {
            console.error();
        }
    }

    const MyProfile = () => {
        return (
            <div>
                {cropModal()}
                <div>
                    <Card className="profile-card">
                        <div className="picture-area">
                            <div className="profile-picture" >
                                <Image src={croppedImageUrl || profilePicture} size='small' circular />
                                <Icon size="huge" onClick={handleUploadClick} color="yellow" name="upload"></Icon>
                                <input type="file" onChange={uploadImage} ref={fileInput} style={{ display: 'none' }}></input>
                            </div>
                            <div>
                                <div className="profile-name">{state.userData ? state.userData.first_name + " " + state.userData.last_name : <Placeholder><Placeholder.Line /><Placeholder.Line /></Placeholder>}</div>
                                <div><Icon name="point"></Icon>{state.userData.location}</div>
                            </div>
                        </div>
                        <h3>Bio</h3>
                        <div>
                            {state.userData.bio_text}
                        </div>
                        {groups.length === 0 ?
                            <div style={{ marginTop: '2rem' }} align='center'>
                                <Header as='h2' textAlign='center'>
                                    You are not organizing any group
                                </Header>
                                <Divider horizontal><Button as={Link} to='/create-group' color="green">Create a group</Button></Divider>
                            </div>
                            :
                            <div>
                                <h1>
                                    Organizator of {groups.length} group
                                </h1>
                                {groups}
                            </div>
                        }
                        <Divider />
                        {events.length === 0 ?
                            <div style={{ marginTop: '2rem' }} align='center'>
                                <Header as='h2' textAlign='center'>
                                    You are not attending to any event
                                </Header>
                            </div>
                            :
                            <div>
                                <h1>
                                    Attending {events.length} events
                                </h1>
                                {events}
                            </div>
                        }
                        <Divider />
                        {userGroups.length === 0 ?
                            <div style={{ marginTop: '2rem' }} align='center'>
                                <Header as='h2' textAlign='center'>
                                    You are not in any group
                                </Header>
                            </div>
                            :
                            <div>
                                <h1>
                                    Attending {userGroups.length} groups
                                </h1>
                                {userGroups}
                            </div>
                        }
                    </Card>
                </div>
            </div>
        );
    }

    const WithSidebar = ({ ProfileComp }) => {
        return (
            <Grid>
                <Grid.Column stretched width='3'>
                    <ProfileSidebar selectedMenuItem={selectedMenuItem} setSelectedMenuItem={setSelectedMenuItem} />
                </Grid.Column>
                <Grid.Column stretched width='13'>
                    <ProfileComp userData={state.userData} />
                </Grid.Column>
            </Grid>
        );
    }

    const renderFriends = () => {
        return (
            <Grid>
                <Grid.Column stretched width='3'>
                    <ProfileSidebar selectedMenuItem={selectedMenuItem} setSelectedMenuItem={setSelectedMenuItem} />
                </Grid.Column>
                <Grid.Column stretched width='13'>
                    <Friends friends={allFriends} requests={requests} fetchFriends={fetchFriends} />
                </Grid.Column>
            </Grid>
        );
    }

    if (!groups || !events) {
        return (
            <Grid>
                <Grid.Column stretched width='3'>
                    <ProfileSidebar selectedMenuItem={selectedMenuItem} setSelectedMenuItem={setSelectedMenuItem} />
                </Grid.Column>
                <Grid.Column stretched width='13'>
                    <Placeholder>
                        <Placeholder.Line></Placeholder.Line>
                        <Placeholder.Line></Placeholder.Line>
                        <Placeholder.Line></Placeholder.Line>
                        <Placeholder.Line></Placeholder.Line>
                    </Placeholder>
                </Grid.Column>
            </Grid>
        );

    }


    switch (selectedMenuItem) {
        case 'Profile':
            return <WithSidebar ProfileComp={MyProfile} />;
        case 'Edit-Profile':
            return <WithSidebar ProfileComp={EditProfile} />;
        case 'Friends':
            return renderFriends();
        default:
            break;
    }

}

export default Profile;