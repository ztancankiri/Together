import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Container, Form, Popup, Button, Divider, Comment, Grid, Header, Placeholder } from 'semantic-ui-react';
import api from 'api.js';
import EventDetailsSidebar from 'components/side-bar/eventDetailsSidebar';
import moment from 'moment';
import './EventDetails.scss';

function EventDetails({ match }) {
    const [eventData, setEventData] = useState({});
    const [imageStyle, setImageStyle] = useState({});
    const [allMembers, setAllMembers] = useState([]);
    const [comment, setComment] = useState('');
    const [allComments, setAllComments] = useState([]);
    const [replies, setReplies] = useState();
    const [replied_toName, setReplied_toName] = useState();
    const [replied_toID, setReplied_toID] = useState();

    useEffect(() => {
        fetchEventData();
        //setEventData(newEventData);
    }, []);

    useEffect(() => {
        if (eventData.event_id) fetchComments();
        //setEventData(newEventData);
    }, [eventData]);

    const fetchEventData = async () => {
        const { data } = await api.getEventDetails(match.params.id);
        setEventData({ ...data });
        const image_path = api.getImage(data.image_path);
        const style = {
            backgroundImage: `url(${image_path})`
        };
        setImageStyle(style);
        const members = await api.getAllAttendees(match.params.id);
        setAllMembers(members.data);
    };

    async function fetchComments() {
        const { data } = await api.getComments(eventData.event_id);
        let replyHashMap = {};
        data.forEach(comment => {
            if (replyHashMap.hasOwnProperty(comment.replied_to)) {
                replyHashMap[comment.replied_to].push(comment);
            } else {
                replyHashMap[comment.replied_to] = [comment];
            }
        });
        setReplies(replyHashMap);
        setAllComments(data);
    }

    function handleReply(name, id) {
        setReplied_toName(name);
        setReplied_toID(id);
    }

    function displayComments() {
        console.log(allComments);

        if (allComments.length === 0) {
            return;
        }
        return allComments.map((comment, index) => {
            if (!comment.replied_to) {
                return (
                    <Comment key={index}>
                        <Comment.Avatar href={'/profile/' + comment.commented_by} src={api.getImage(comment.image_path)} />
                        <Comment.Content>
                            <Comment.Author as="a" href={'/profile/' + comment.commented_by}>
                                {comment.name}
                            </Comment.Author>
                            <Comment.Metadata>
                                <div>{moment(comment.time).format('MMM DD, HH:mm')}</div>
                            </Comment.Metadata>
                            <Comment.Text>{comment.message}</Comment.Text>
                            <Comment.Actions>
                                <Comment.Action onClick={() => handleReply(comment.name, comment.comment_id)}>Reply</Comment.Action>
                            </Comment.Actions>
                        </Comment.Content>
                        {replies[comment.comment_id] &&
                            replies[comment.comment_id].map(reply => {
                                return displayReply(reply);
                            })}
                    </Comment>
                );
            }
        });
    }

    function displayReply(reply) {
        return (
            <Comment.Group>
                <Comment>
                    <Comment.Avatar as="a" href={'/profile/' + reply.commented_by} src={api.getImage(reply.image_path)} />
                    <Comment.Content>
                        <Comment.Author as="a" href={'/profile/' + reply.commented_by}>
                            {' '}
                            {reply.name}
                        </Comment.Author>
                        <Comment.Metadata>
                            <span>Just now</span>
                        </Comment.Metadata>
                        <Comment.Text>{reply.message}</Comment.Text>
                        <Comment.Actions onClick={() => handleReply(reply.name, reply.comment_id)}>
                            <a>Reply</a>
                        </Comment.Actions>
                    </Comment.Content>
                    {replies[reply.comment_id] &&
                        replies[reply.comment_id].map(reply => {
                            return displayReply(reply);
                        })}
                </Comment>
            </Comment.Group>
        );
    }

    async function sendComment() {
        const commentData = {
            message: comment,
            replied_to: replied_toID || null,
            comment_at: eventData.event_id
        };
        setReplied_toID();
        setReplied_toName();
        setComment('');
        const { data } = await api.sendComment(commentData);
        await fetchComments();
    }

    return (
        <div>
            <Grid>
                <Grid.Column stretched width="3">
                    <EventDetailsSidebar attendees={allMembers} event_data={eventData} />
                </Grid.Column>
                <Grid.Column stretched width="13">
                    <Container>
                        {<div className="side-crop" style={imageStyle} />}
                        <div className="event-info">
                            <div className="host-name info-block">
                                Hosted by <a href={'/group-details/' + eventData.group_id}>{eventData.group_name}</a>
                            </div>
                            <div className="event-name info-block">
                                <div>{eventData.event_name}</div>
                            </div>
                            <div>
                                <h3>Description</h3>
                                <p>{eventData.description}</p>
                            </div>
                            <Divider />
                            <h2>Comments</h2>
                            <Comment.Group threaded>
                                {displayComments()}
                                {replied_toName && <Header as="h3">You are replying to {replied_toName}</Header>}
                                <Form reply>
                                    <Form.TextArea value={comment} onChange={(e, { value }) => setComment(value)} />
                                    <Button content="Add Comment" labelPosition="left" icon="edit" primary onClick={sendComment} />
                                </Form>
                            </Comment.Group>
                        </div>
                    </Container>
                </Grid.Column>
            </Grid>
        </div>
    );
}

export default withRouter(EventDetails);
