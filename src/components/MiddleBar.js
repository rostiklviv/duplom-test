import React, { useState, useEffect } from 'react';
import './MiddleBar.css'
import { IconButton, InputBase, Paper } from '@mui/material';
import Messages from './Messages';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import { useParams } from 'react-router-dom'
import { getCookie } from '../utils'
import ChatSettings from './ChatSettings';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';

let lastDate = ""

const MiddleBar = () => {
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [chat, setChat] = useState();
    const [newMessage, setNewMessage] = useState('')

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const [messages, setMessages] = useState([])

    const WS_URL = 'ws://localhost:8000/chat/' + id + '/';

    useWebSocket(WS_URL, {
        onOpen: () => {
          console.log('WebSocket connection established.');
        }
      });

    function loadChatMessages(id, isLoadingMore) {
        setIsLoading(true)
        fetch('http://localhost:8000/api/messages?chat_id=' + id + '&page=' + page, {
            credentials: 'include'
        }).then(res => {
            return res.json()
        }).then((data) => {
            setMessages(prev => {

                if (isLoadingMore) {
                    prev = { ...prev, results: [...(prev.results || []), ...(data.results || [])] }
                } else {
                    prev = data
                }
                return prev
            })
        }).catch(() => {
            setMessages(prev => {
                prev = { ...prev, next: null }
            })
        })
            .finally(() => setIsLoading(false))
    }

    function loadChatInfo(id) {
        fetch('http://localhost:8000/api/chats/' + id, {
            credentials: 'include'
        }).then(res => {
            return res.json()
        }).then((data) => {
            setChat(data)
        })
    }

    function setNextPage() {
        const nextPage = page + 1
        console.log(nextPage)
        setPage(page)
        loadChatMessages(id, true)
    }

    function sendMessage() {

        const chatNewMessage = { text: {newMessage} }

        fetch('http://localhost:8000/api/messages', {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(chatNewMessage),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })

        console.log(newMessage)
    }



    useEffect(() => {
        loadChatInfo(id)
        loadChatMessages(id)
    }, [id])

    const onChange = (event) => {
        setNewMessage(event.target.value)
    }


    if (getCookie("user_id") !== null) return (
        <div className="middleBar">
            <div className="topBar" onClick={handleDrawerOpen} style={{ cursor: 'pointer' }}>
                <h2>{chat?.name || "Undefined"}</h2>
                <div style={{ display: "flex" }}><PersonIcon /> {chat?.users.length || "0"} </div>
                {isLoading && 'loading'}
            </div>
            <div className="chat">
                <div className="messages">
                    <Messages messages={messages} isLoading={isLoading} setNextPage={setNextPage} />
                </div>
                <Paper
                    className="sendForm"
                    component="form"
                    sx={{ display: 'flex', alignItems: 'center', width: "100%", height: "8%" }}
                >
                    <InputBase
                        sx={{ ml: 2, flex: 1 }}
                        placeholder="Type something..."
                        onChange={onChange}
                    />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={sendMessage}>
                        <SendIcon />
                    </IconButton>
                </Paper>
            </div>
            <ChatSettings handleDrawerClose={handleDrawerClose} open={open} chat={chat}/>
        </div>
    );
}

export default MiddleBar;