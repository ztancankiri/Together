import React, { useState, useEffect, useContext, useRef } from 'react'
import { AppContext } from 'context/Context'
import { Card, Icon, Image, Grid, Header, Divider, Label, Form, Placeholder } from 'semantic-ui-react'
import MessagesSidebar from "components/side-bar/messagesSidebar";
import useInterval from "hooks/useInterval";
import api from 'api.js';
import styled from 'styled-components'
import moment from 'moment';
import './Messages.scss';


const SpeechBubble = styled.div`
    max-width: 300px;
    padding: 1.2rem;
    position: relative;
    background: ${props => props.color};
    color: #fff;
    border-radius: .4em;
    text-align: start;
    overflow: auto;
    display: block;
`



const Messages = ({ location }) => {
    const { state } = useContext(AppContext);
    const [otherUserInfo, setOtherUserInfo] = useState({});
    const [otherGroupInfo, setOtherGroupInfo] = useState({});
    const [otherUserId, setOtherUserId] = useState();
    const [otherGroupId, setOtherGroupId] = useState();
    const [firstMessageId, setFirstMessageId] = useState(-1);
    const [messages, setMessages] = useState([]);
    const [groupMessages, setGroupMessages] = useState([]);
    const [messagesInitial, setMessagesInitial] = useState(false);
    const [typedMessage, setTypedMessage] = useState('');
    const [previews, setPreviews] = useState([]);
    const [groupPreviews, setGroupPreviews] = useState([]);
    const [isGroup, setIsGroup] = useState(false);

    const messagesEnd = useRef();
    const messagesWindow = useRef();

    useEffect(() => {
        getMessagePreviews();
        getGroupMessagePreviews();
    }, [])


    useEffect(() => {
        getOtherUserInfo(otherUserId);
        getMessages();
    }, [otherUserId])

    useEffect(() => {
        getGroupMessagePreviews();
        getOtherGroupInfo(otherUserId);
        getMessages();
    }, [otherGroupId])

    useEffect(() => {
        if (!messagesInitial)
            messagesEnd.current.scrollIntoView({ behavior: "smooth" });
        if (messages.length !== 0) {
            setMessagesInitial(true);
        }
    }, [messages])

    useInterval(() => {
        getMessages();
        getMessagePreviews();
        getGroupMessagePreviews();
    }, 3000);

    const getMessagePreviews = async () => {
        const { data } = await api.getMessagePreviews();        
        if (location.state) {
            setOtherUserId(location.state.send_message_id);
        }
        else if (!otherUserId) {
            setOtherUserId(data[0].account_id);
        }
        else if (data.length === 0) {
            setOtherUserId(null);
        }
        setPreviews([...data]);
    }

    const getGroupMessagePreviews = async () => {
        const { data } = await api.getGroupMessagePreviews();
        console.log(data)
        if (data.length !== 0 && !otherUserId) {
            setOtherGroupId(data[0].group_id);
        }
        else if (data.length === 0) {
            setOtherGroupId(null);
        }
        setGroupPreviews([...data]);
    }

    const getOtherUserInfo = async () => {
        try {
            if (otherUserId) {
                const { data } = await api.getProfileData(otherUserId);
                setOtherUserInfo(data);
            }
        } catch (error) {
        }
    }

    const getOtherGroupInfo = async () => {
        try {
            if (otherGroupId) {
                const { data } = await api.getGroupDetails(otherGroupId);
                setOtherGroupInfo(data);
            }
        } catch (error) {
        }
    }
    const getMessages = async () => {
        if (otherUserId) {
            try {
                const { data } = await api.getMessagesBetween(otherUserId);
                setMessages(data);
                const gm = await api.getGroupMessages(otherGroupId);
                setGroupMessages([...gm.data]);

                const firstID = data[0].message_id;
                setFirstMessageId(firstID);
            } catch (error) {
                console.error(error);
            }
        }
    }

    const sendMessage = async (message) => {
        if (message.trim().length === 0) {
            return;
        }
        try {
            if (isGroup) {
                const { data } = await api.sendGroupMessageFromUser(otherGroupId, message);
            } else {
                const { data } = await api.sendMessage({ message, receiver: otherUserId });
            }
            setTypedMessage('');
            await getMessages();
            await getMessagePreviews();
        } catch (error) {
            console.error(error);
        }
    }

    const displayMessages = () => {
        if (groupMessages.length !== 0 && isGroup) {
            return groupMessages.map((message, i) => {
                let is_self = state.userData.account_id === message.sender_id;
                return <SpeechBubbleArea key={i} incoming={!is_self} text={message.message_text} time={message.time} sender_name={message.sender_name}/>
            });
        }
        if (messages.length !== 0 && !isGroup) {
            return messages.map((message, i) => {
                let is_self = state.userData.account_id === message.sender_id;
                return <SpeechBubbleArea key={i} incoming={!is_self} text={message.message_text} time={message.time} />
            });
        }
        else{
            return (<Header as="h2">No messages</Header>)
        }
    }


    const SpeechBubbleArea = ({ incoming, text, time, sender_name }) => {
        return (
            <Grid>
                <Grid.Column floated={incoming ? 'left' : 'right'} width={5}>
                    <SpeechBubble color={incoming ? '#09c5d6' : 'orange'}>
                        {text}
                    </SpeechBubble>
                    <i>{moment(time).format('DD MMM HH:mm')}</i>
                    {isGroup && <p>{sender_name}</p>}
                </Grid.Column>
            </Grid>
        );
    }

    const handleKeyDown = () => {
        sendMessage(typedMessage);
    }

    return (
        <Grid>
            <Grid.Column stretched width='3'>
                <MessagesSidebar otherGroupId={otherGroupId} otherUserId={otherUserId} setOtherGroupId={setOtherGroupId} isGroup={isGroup} setIsGroup={setIsGroup} setOtherUserId={setOtherUserId} previews={previews} groupPreviews={groupPreviews} />
            </Grid.Column>
            <Grid.Column stretched width='13'>
                <Card className="profile-card messages-container">
                    {
                        <>
                            {isGroup ?
                                <Header as='h2'>
                                    {otherGroupInfo.image_path && <Image circular src={otherGroupInfo.image_path ? api.getImage(otherGroupInfo.image_path) : <Placeholder><Placeholder.Image /></Placeholder>} />}
                                    {otherGroupInfo.group_name}
                                </Header> :
                                <Header as='h2'>
                                    <Image circular src={otherUserInfo.image_path ? api.getImage(otherUserInfo.image_path) : <Placeholder><Placeholder.Image /></Placeholder>} />
                                    {otherUserInfo.first_name ? otherUserInfo.first_name + " " + otherUserInfo.last_name : <Placeholder><Placeholder.Line /></Placeholder>}
                                </Header>}
                            <div ref={messagesWindow} className="message-window">
                                {displayMessages()}
                                <div style={{ float: "left", clear: "both" }}
                                    ref={messagesEnd}>
                                </div>
                            </div>
                            <Form onSubmit={handleKeyDown}>
                                <Form.Input value={typedMessage} onChange={(e) => setTypedMessage(e.target.value)} size='large' icon={<Icon name='send' circular link />} className='send-message-input' placeholder='Type a message' />
                            </Form>
                        </>
                    }
                </Card>
            </Grid.Column>
        </Grid>
    );

}

export default Messages;