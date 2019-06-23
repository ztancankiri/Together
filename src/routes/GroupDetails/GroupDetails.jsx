import React, { useState, useEffect } from 'react';
import { Container, Grid, Popup, Button, Divider, Comment, Form, Label, Header } from 'semantic-ui-react';
import GroupDetailsSidebar from 'components/side-bar/groupDetailsSidebar';

import Skeleton from 'react-loading-skeleton';
import api from 'api.js';

import './GroupDetails.scss';

function GroupDetails({ match }) {
    const [groupData, setGroupData] = useState();
    const [imageStyle, setImageStyle] = useState({});
    const [allMembers, setAllMembers] = useState([]);
    const [memberStatus, setMemberStatus] = useState(false);

    useEffect(() => {
        fetchGroupData();
    }, []);

    const fetchGroupData = async () => {
        const { data } = await api.getGroupDetails(match.params.id);
        setGroupData(data);
        const image_path = api.getImage(data.image_path);
        const style = {
            backgroundImage: `url(${image_path})`
        };
        setImageStyle(style);
        const members = await api.getAllGroupMembers(match.params.id);
        const memberStatus = await api.getMemberStatus(match.params.id);
        setAllMembers(members.data);
        setMemberStatus(memberStatus.data.status);
    };

    function displayAllCategories() {
        if (!groupData) {
            return <Skeleton width={500} />;
        }
        const colors = ['yellow', 'blue', 'pink', 'red', 'green'];
        return groupData.categories.map((category, index) => {
            return <Label color={colors[index]} content={category.name} key={index} />;
        });
    }

    if (!groupData) {
        return null;
    }

    return (
        <div>
            <Grid>
                <Grid.Column stretched width="3">
                    <GroupDetailsSidebar members={groupData.members} admins={groupData.admins} allMembers={allMembers} group_name={groupData.group_name} group_id={groupData.group_id} member_status={memberStatus} />
                </Grid.Column>
                <Grid.Column stretched width="13">
                    <Container>
                        <div className="group side-crop" style={imageStyle} />
                        <div className="group-info">
                            <div className="host-name info-block" />
                            <div className="event-name info-block">
                                <div>
                                    {groupData.group_name}
                                    <br />
                                </div>
                            </div>
                            <div className="categories">{displayAllCategories()}</div>
                            <div>
                                <Header as="h3">Description</Header>
                                <p>{groupData.description || <Skeleton count={2} width={300} />}</p>
                            </div>
                            <Divider />
                            <h2>Comments</h2>
                            <Comment.Group>
                                <Form reply>
                                    <Form.TextArea />
                                    <Button content="Add Comment" labelPosition="left" icon="edit" primary />
                                </Form>
                            </Comment.Group>
                        </div>
                    </Container>
                </Grid.Column>
            </Grid>
        </div>
    );
}

export default GroupDetails;
