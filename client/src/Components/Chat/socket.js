import EmojiPicker from 'emoji-picker-react';
import { useState } from 'react';
import { io } from 'socket.io-client';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import IconButton from '@mui/material/IconButton';

const socket = io('http://localhost:8800');
socket.on('connect', () => {
    console.log(`You connected with id ${socket.id}`)
})

const chat = () => {
    const [isEmojiPicker, setIsEmojiPicker] = useState(false);
    const [clientMessage, setClientMessage] = useState([]);

    return (
        !isEmojiPicker ? (
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
        )
    )
}


export default chat;