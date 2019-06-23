import React, { useState, useEffect } from 'react';
import api from "api.js";
import { Redirect } from 'react-router-dom'
import { Item, Header, Container, Divider, Form, Grid, Placeholder, Message, Button, Image, TextArea } from 'semantic-ui-react';
import CreateGroupForm from 'routes/CreateGroupForm/CreateGroupForm.jsx';
import EditGroupSidebar from 'components/side-bar/EditGroupSidebar.jsx';

import './EditGroup.scss'
function EditGroup({ match }) {
    const group_id = match.params.id;
    const [groupData, setGroupData] = useState();
    const [activeEvents, setActiveEvents] = useState();
    const [pendingRequests, setPendingRequests] = useState();
    const [selectedMenuItem, setSelectedMenuItem] = useState('edit_group_info');
    const [groupMessage, setGroupMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [infoText, setInfoText] = useState('')

    useEffect(() => {
        fetchGroupData();
        getAllEventsOfGroup();
    }, [])

    async function fetchGroupData() {
        const memberStatus = await api.getMemberStatus(match.params.id);
        if (memberStatus.data.status !== 3) {
            return <Redirect to={{
                pathname: "/profile",
            }}></Redirect>
        }
        const { data } = await api.getGroupDetails(group_id);
        const members = await api.getAllGroupMembers(group_id);
        setGroupData({ ...data, members: members.data });
        const requests = await api.getPendingRequests(group_id);
        setPendingRequests(requests.data);
    }

    const displayMembers = () => {
        if (groupData.members.length === 0) {
            return <Header as="h2">There are no members</Header>
        }

        const removeMember = async (group_id, member_id) => {
            const { data } = await api.removeMember(group_id, member_id);
            const members = await api.getAllGroupMembers(group_id);
            setGroupData({ ...groupData, members: members.data });
        }

        const setAsAdmin = async (group_id, admin_id, status, title) => {
            const { data } = await api.setAsAdmin(group_id, admin_id, status, title);
        }

        return groupData.members.map((member, index) => {
            return (
                <Item key={index} >
                    <Item.Image size='tiny' circular src={api.getImage(member.member_image)} />
                    <Item.Content verticalAlign='middle'>
                        <Item.Header as='a' href={"/profile/" + member.member_id}>{member.member_name}</Item.Header>
                        <Button color='red' floated='right' onClick={() => removeMember(group_id, member.member_id)}>Remove</Button>
                        {member.status !== 3 && <Button color='yellow' floated='right' onClick={() => setAsAdmin(group_id, member.member_id, 3, 'title')}>Make admin</Button>}
                    </Item.Content>
                </Item>
            );
        });
    }

    const displayPendingRequests = () => {
        if (!pendingRequests) {
            return <Header as="h2">There are no pending requests</Header>
        }
        return pendingRequests.map((member, index) => {
            return (
                <Item key={index}>
                    <Item.Image size='tiny' circular src={api.getImage(member.image_path)} />
                    <Item.Content verticalAlign='middle'>
                        <Item.Header as='a' href={"/profile/" + member.account_id}>{member.name}</Item.Header>
                        <Button color='red' floated='right' onClick={() => handleRequest(member.account_id, -1)}>
                            Reject
                        </Button>
                        <Button color='green' floated='right' onClick={() => handleRequest(member.account_id, 2)}>
                            Accept
                        </Button>
                    </Item.Content>
                </Item>
            );
        });
    }

    const handleRequest = async (member_id, status) => {
        const { data } = await api.selectGroupRequest({ group_id, member_id, status });
        const requests = await api.getPendingRequests(group_id);
        setPendingRequests(requests.data);
    }

    async function getAllEventsOfGroup(){
        const {data} = await api.getAllEventsOfGroup();
        setActiveEvents(data)
    }

    if (!groupData) {
        return (
            <Container className="group-edit-container">
                <Placeholder>
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder>;
            </Container>
        )
    }

    const handleSendMessage = async () => {
        setIsLoading(true);
        setInfoText('');
        try {
            const { data } = await api.sendGroupMessage(group_id, groupMessage);
            setGroupMessage('');
            setInfoText('Message sent!');
        } catch (error) {
            setInfoText('Error');
        } finally {
            setIsLoading(false)
        }
    }

    switch (selectedMenuItem) {
        case 'edit_group_info':
            return (
                <Grid>
                    <Grid.Column stretched width='3'>
                        <EditGroupSidebar selectedMenuItem={selectedMenuItem} setSelectedMenuItem={setSelectedMenuItem} />
                    </Grid.Column>
                    <Grid.Column stretched width='13'>
                        <CreateGroupForm groupData={groupData}></CreateGroupForm>
                    </Grid.Column>
                </Grid>
            );
        case 'manage_members':
            return (
                <Grid>
                    <Grid.Column stretched width='3'>
                        <EditGroupSidebar selectedMenuItem={selectedMenuItem} setSelectedMenuItem={setSelectedMenuItem} />
                    </Grid.Column>
                    <Grid.Column stretched width='13'>
                        <Container className="edit-profile-container">
                            <Item.Group className="items">
                                <Header as="h3">Members of {groupData.group_name}</Header>
                                {displayMembers()}
                            </Item.Group>
                        </Container>
                    </Grid.Column>
                </Grid>
            );
        case 'pending_requests':
            return (
                <Grid>
                    <Grid.Column stretched width='3'>
                        <EditGroupSidebar selectedMenuItem={selectedMenuItem} setSelectedMenuItem={setSelectedMenuItem} />
                    </Grid.Column>
                    <Grid.Column stretched width='13'>
                        <Container className="edit-profile-container">
                            <Item.Group className="items">
                                <Header as="h3">Pending requests of {groupData.group_name}</Header>
                                {displayPendingRequests()}
                            </Item.Group>
                        </Container>
                    </Grid.Column>
                </Grid>
            );
        case 'send_group_message':
            return (
                <Grid>
                    <Grid.Column stretched width='3'>
                        <EditGroupSidebar selectedMenuItem={selectedMenuItem} setSelectedMenuItem={setSelectedMenuItem} />
                    </Grid.Column>
                    <Grid.Column stretched width='13'>
                        <Container className="edit-profile-container">
                            <Item.Group className="items">
                                <Header as="h3">Send a message to {groupData.group_name}</Header>
                                <Form>
                                    <TextArea value={groupMessage} onChange={(e, { value }) => setGroupMessage(value)} placeholder='Type a message' />
                                </Form>
                                <Divider />
                                {infoText && <Message positive><Message.Header>{infoText}</Message.Header></Message>}
                                <Button color="green" loading={isLoading} disabled={isLoading} onClick={handleSendMessage}>Send message</Button>
                            </Item.Group>
                        </Container>
                    </Grid.Column>
                </Grid>
            );

        default:
            break;
    }

}

export default EditGroup;