import React, { useEffect, useState } from 'react';
import Chatheader from "../SideBar/SideBarPreview";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import "./Chat.css";
import { useSelector, useDispatch } from "react-redux"
import { SendMessage, deleteMesssage, GetMessage } from "../../Store/AuthSlice"
import Message from "./Message"
import moment from 'moment';
import SendIcon from '@mui/icons-material/Send';
import uuid from 'react-uuid';
import EmojiPicker from 'emoji-picker-react';
import { io } from 'socket.io-client';
import image from "./emptyBg.webp"

const socket = io('http://localhost:5000');
socket.on('connect', () => {
    console.log(`You connected with id ${socket.id}`)
})

function Chat() {

    const authData = useSelector((state) => state.auth);
    let { userData: { username: name, tagLine, profileImage }, recieverId, isClicked, recieverProfile, userId, serverMessages, isDeleted } = authData;
    const [incomingMessage, setIncomingMessage] = useState({ message: "", timeStamp: "", status: "" });
    const dispatch = useDispatch();
    const [message, setMessage] = useState("");
    const [isEmojiPicker, setIsEmojiPicker] = useState(false);
    const [messages, setMessages] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const data = { userId, recieverId };


    isClicked && document.querySelector(".chat").classList.add('show');
    document.querySelector(".backButton")?.addEventListener('click', () => {
        document.querySelector(".chat").classList.remove('show');
        document.querySelector(".sideBar").classList.remove('hidePreview');
    })
    useEffect(() => {
        setMessages([])
        if (recieverId) {
            socket.emit('addUser', data);
            socket.on('getUsers', (users) => {
                setOnlineUsers(users)
            })
        }
        setMessages(serverMessages);
        console.log(serverMessages);

    }, [recieverId, isDeleted])

    useEffect(() => {
        socket.on("getMessage", (data) => {
            setIncomingMessage({ ...incomingMessage, message: data.message, timeStamp: moment().format('LTS'), state: "reciever", recieverId: data.recieverId, userId: data.userId })
        })
    }, [])

    useEffect(() => {
        if (recieverId === incomingMessage?.userId) {
            setMessages([...messages, incomingMessage]);
        }
    }, [incomingMessage]);


    function handleChange(e) {
        setMessage(e.target.value);
    }

    const dispatchMessage = (e) => {
        socket.emit('sendMessage', { userId, recieverId, message });
        setMessages([...messages, { message, timeStamp: moment().format('LTS'), state: "sender" }]);
        e.preventDefault()
        dispatch(SendMessage({ message: { message, timeStamp: moment().format('LTS'), time: moment().format('MMMM Do YYYY, h:mm:ss a') }, recieverId }))
        setMessage("")
    }

    const deleteMesssages = (recieverId) => {
        console.log("here")
        setMessages([]);
        dispatch(deleteMesssage(recieverId));
    }

    return (

        isClicked ?
            <div className="chat">
                <div className="chat_header">
                    <IconButton className="backButton">
                        <ArrowBackIcon />
                    </IconButton>
                    <Chatheader username={name} message={tagLine} letter={recieverProfile} profileImage={profileImage} children="Yes" />

                    <div className="icons">
                        <IconButton>
                            <AttachFileIcon />
                        </IconButton>
                        <button onClick={() => deleteMesssages(recieverId)} style={{ border: 'none' }}>
                            <IconButton>
                                <DeleteIcon />
                            </IconButton>
                        </button>
                    </div>
                </div>

                <div className="chat_textArea">
                    {messages?.map((obj) => <Message key={uuid()} state={obj.state} message={obj.message} timeStamp={obj.timeStamp} />)}
                </div>

                <div className="chat_composeMessage">
                    {!isEmojiPicker ? (
                        <IconButton>
                            <InsertEmoticonIcon onClick={() => setIsEmojiPicker((prev) => !prev)} />
                        </IconButton>
                    ) : (
                        <>
                            <IconButton>
                                <InsertEmoticonIcon
                                    onClick={() => setIsEmojiPicker((prev) => !prev)}
                                />
                            </IconButton>
                            <div style={{ position: "absolute", bottom: "2%", left: "33%" }} >
                                <EmojiPicker
                                    searchDisabled="true"
                                    previewConfig={{ showPreview: false }}
                                    emojiStyle="google"
                                    onEmojiClick={(e) => setMessage((message) => message + e.emoji)}
                                    height={400}
                                    width="100%"
                                />
                            </div>
                        </>
                    )}
                    {/* {isEmojiPicker && <EmojiPicker />} */}
                    <form action="" style={{ display: "flex", width: "100%" }} onSubmit={(e) => dispatchMessage(e)}>
                        <input type="text" placeholder='Enter your message' value={message} onChange={(e) => handleChange(e)} style={{ flexGrow: "6" }} />
                        <IconButton type='submit' >
                            <SendIcon />
                        </IconButton>
                    </form>

                    <IconButton>
                        <KeyboardVoiceIcon />
                        {/* {isVoice && <Dictaphone sendMessage={recieveMessage} />} */}
                    </IconButton>
                </div>
            </div >
            :
            <div className='chat'>
                <div className='mx-width'>
                    <img src={image} alt="" style={{ height: "auto", maxWidth: "100%" }} />
                </div>
            </div>
    )
}

export default Chat;