import React from "react";
import api from 'api.js'
import { Button, Modal, Image, Header, Item } from 'semantic-ui-react'


function ListUsersModal({ trigger, name, allMembers }) {
    function getUsers() {
        console.log(allMembers);

        return allMembers.map((member, key) => userItem(api.getImage(member.member_image), member.member_name, member.member_id));
    }

    return (
        <Modal trigger={<Button>{trigger}</Button>}>
            <Modal.Header>Attending to {name}</Modal.Header>
            <Modal.Content image>
                <Modal.Description>
                    <Item.Group>
                        {allMembers.length !== 0 ? getUsers() : <Header as="h2">There is no one attending to this event yet</Header>}
                    </Item.Group>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    );
}

function userItem(image_path, name, member_id) {
    return (
        <Item key={member_id}>
            <Item.Image size='tiny' circular src={image_path} />
            <Item.Content verticalAlign='middle'>
                <Item.Header as='a' href={'/profile/' + member_id}>{name}</Item.Header>
            </Item.Content>
        </Item>
    );
}

export default ListUsersModal;