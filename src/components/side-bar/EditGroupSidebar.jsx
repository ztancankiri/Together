import React, { useState } from "react";
import { Button, Menu, Divider, Modal } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import "./side-bar.scss";

function EditGroupSidebar({ selectedMenuItem, setSelectedMenuItem }) {

    function handleItemClick(e, { name }) {
        setSelectedMenuItem(name);
    }

    return (<Menu fluid pointing secondary vertical className="your-account">
        <Menu.Item><h3>Manage group</h3></Menu.Item>
        <Menu.Item>
            <Menu.Item icon='edit' name='edit_group_info' active={selectedMenuItem === 'edit_group_info'} onClick={handleItemClick} />
            <Menu.Item icon='user' name='manage_members' active={selectedMenuItem === 'manage_members'} onClick={handleItemClick} />
            <Menu.Item icon='clock' name='pending_requests' active={selectedMenuItem === 'pending_requests'} onClick={handleItemClick} />
            <Menu.Item icon='mail' name='send_group_message' active={selectedMenuItem === 'send_group_message'} onClick={handleItemClick} />
            <Divider />
        </Menu.Item>
    </Menu>);



}

export default EditGroupSidebar;