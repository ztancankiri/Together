import React, { useState } from "react";
import { Button, Menu, Image, Placeholder, Header } from 'semantic-ui-react';
import ListUsersModal from "components/list-users-modal/list-users-modal";
import { Link } from 'react-router-dom';
import api from 'api.js';
import "./side-bar.scss";
function groupDetailsSidebar({ members, admins, allMembers, group_name, member_status, group_id }) {
    const [sentRequest, setSentRequest] = useState(false);

    function getAdmins() {
        if (!admins) {
            return (
                <Placeholder >
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder>
            );
        }
        return (
            admins.map((organizer, index) => {
                const image_path = api.getImage(organizer.image_path);
                return (
                    <Link key={index} to={'/profile/' + organizer.account_id}>
                        <div key={organizer.account_id}>
                            <Image src={image_path} avatar spaced />
                            <span>{organizer.name}</span>
                        </div>
                    </Link>
                );
            })
        );
    }
    function getMembers() {
        if (!members) {
            return (
                <Placeholder >
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                </Placeholder>);
        }
        return members.map((member) => <Image key={member.account_id} src={api.getImage(member.image_path)} avatar size="mini" spaced />);
    }


    const renderActionButton = () => {
        if (sentRequest || member_status === 1) {
            return <Header color="yellow" as='h2'>Awaiting approval</Header>
        }
        else if (member_status === 2) {
            return <Header color="green" as='h2'>You are already a member</Header>
        }
        else if (member_status === 3) {
            return (
                <Button color="green" as={Link}
                    to={{
                        pathname: '/create-event',
                        state: {
                            group_id,
                            group_name
                        }
                    }}>Create Event</Button>
            );
        }
        else if (member_status === -1) {
            return <Button color="green" onClick={sendRequest}>Request to join</Button>
        }
    }

    const sendRequest = async () => {
        const { data } = await api.sendGroupRequest(group_id);
        setSentRequest(true);
    }

    return (
        <Menu fluid vertical>
            <Menu.Item>
                {renderActionButton()}
            </Menu.Item>
            <Menu.Item className="text-left">
                <h3>Group Admins</h3>
                {getAdmins()}
            </Menu.Item>
            <Menu.Item className="text-left">
                <h3>Attendees</h3>
                {getMembers()}
                <div className="see-all-link">
                    <ListUsersModal trigger="See all members" name={group_name} allMembers={allMembers} />
                </div>
            </Menu.Item>
        </Menu>
    );
}

export default groupDetailsSidebar;