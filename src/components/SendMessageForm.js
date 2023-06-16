import React, { useState, useEffect } from 'react';
import { IconButton, InputBase, Paper } from '@mui/material';
import { getCookie } from '../utils'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';

function SendMessageForm({id}) {
    const [newMessage, setNewMessage] = useState('')

    function sendMessage(e) {
        e.preventDefault()
        const chatNewMessage = { chat_id: id, text: newMessage.trim() }

        var csrftoken = getCookie('csrftoken');

        fetch('http://localhost:8000/api/messages', {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(chatNewMessage),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
        }).finally(() => setNewMessage(''))
    }

     const onChange = (event) => {
        event.preventDefault();
        setNewMessage(event.target.value)
    }

    
    const handleFileUpload = (event) => {
        console.log(event.target.files[0].name);

        const formData = new FormData();
        formData.append('chat_id', id)
        formData.append('file', event.target.files[0]);

        var csrftoken = getCookie('csrftoken');

        fetch('http://localhost:8000/api/messages', {
            credentials: 'include',
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'X-CSRFToken': csrftoken
            },
        })

    };

    return (
        <Paper
            className="sendForm"
            component="form"
            onSubmit={sendMessage}
            sx={{ display: 'flex', alignItems: 'center', width: "95vw", maxWidth: '100%',  height: "8%", mx: 'auto' }}
        >
            <InputBase
                sx={{ ml: 2, flex: 1 }}
                placeholder="Type something..."
                value={newMessage}
                onChange={onChange}
            />
            <input id="icon-button-file"
                type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
            <label htmlFor='icon-button-file'>
                <IconButton type="button" sx={{ p: '10px' }} aria-label="file" component="span">
                    <AttachFileIcon />
                </IconButton>
            </label>
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={sendMessage}>
                <SendIcon />
            </IconButton>
        </Paper>
    )
}

export default SendMessageForm