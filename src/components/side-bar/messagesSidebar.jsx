import React, { useState, useEffect } from "react";
import { Button, Menu, Header, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import api from 'api.js';

import "./side-bar.scss";
function MessagesSidebar({ setOtherUserId, previews, groupPreviews, isGroup, setIsGroup, setOtherGroupId, otherGroupId, otherUserId }) {


    function handleItemClick(id) {
        if (isGroup)
            setOtherGroupId(id);
        else
            setOtherUserId(id);
    }

    const displayPreviews = () => {
        if ((!otherGroupId && isGroup) || (!otherUserId && !isGroup)) {
            return (
                <Menu.Item>
                    <Header as='h4'>
                        You do not have any contacts
                    </Header>
                </Menu.Item>
            )
        }
        
        else if (groupPreviews.length !== 0 && isGroup) {
            return groupPreviews.map((preview, index) => {
                return <PreviewCard id={preview.group_id} key={index} image_path={preview.group_image} name={preview.group_name} />
            });
        }
        else if (previews.length !== 0) {
            return previews.map((preview, index) => {
                return <PreviewCard id={preview.account_id} key={index} image_path={preview.image_path} name={preview.name} />
            });
        }
    }

    const PreviewCard = ({ id, image_path, name, last_msg }) => {
        return (
            <Menu.Item onClick={() => handleItemClick(id)}>
                <Header as='h4'>
                    <Image avatar src={api.getImage(image_path)} />
                    <Header.Content>
                        {name}
                    </Header.Content>
                </Header>
            </Menu.Item>
        );
    }

    const handleSwitch = () => {
        setIsGroup(!isGroup)
    }

    return (<Menu fluid pointing secondary vertical className="your-account">
        <Menu.Item>{isGroup ? <h3>Group Messages</h3> : <h3>Contacts</h3>}</Menu.Item>
        {displayPreviews()}
        <Menu.Item><Button onClick={handleSwitch}>{!isGroup ? <h3>Group Messages</h3> : <h3>Contacts</h3>}</Button></Menu.Item>
    </Menu>);
}

export default MessagesSidebar;