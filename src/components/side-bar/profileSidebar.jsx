import React, { useState } from "react";
import { Button, Menu, Divider, Modal, Form } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import "./side-bar.scss";
function profileSidebar({ selectedMenuItem, setSelectedMenuItem }) {
    function handleItemClick(e, { name }) {
        setSelectedMenuItem(name);
    }
    function handleLogout() {
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('token');
    }

    // const AdminLoginPopup = () => {
    //     return (
    //         <Modal trigger={<Button color="yellow">Admin Login</Button>}>
    //             <Modal.Header>Admin Login</Modal.Header>
    //             <Modal.Content>
    //                 <Form>
    //                     <Form.Field>
    //                         <label>Admin Password</label>
    //                         <input placeholder='Password' />
    //                     </Form.Field>
    //                     <Button type='submit' onClick={handleAdminLogin}>Login</Button>
    //                 </Form>
    //             </Modal.Content>
    //         </Modal>
    //     );
    // }

    const handleAdminLogin = () => {

    }

    return (<Menu fluid pointing secondary vertical className="your-account">
        <Menu.Item><h3>Manage account</h3></Menu.Item>
        <Menu.Item>
            <Menu.Item icon='user' name='Profile' active={selectedMenuItem === 'Profile'} onClick={handleItemClick} />
            <Menu.Item icon='edit' name='Edit-Profile' active={selectedMenuItem === 'Edit-Profile'} onClick={handleItemClick} />
            <Menu.Item icon='users' name='Friends' active={selectedMenuItem === 'Friends'} onClick={handleItemClick} />
            <Menu.Item>
                <Button as={Link} to='/login' color="red" onClick={handleLogout}>Logout</Button>
            </Menu.Item>
            <Divider />

        </Menu.Item>
    </Menu>);



}

export default profileSidebar;