import React, { useState, useEffect } from 'react';
import './MiddleBar.css'
import { IconButton, InputBase, Paper, Badge } from '@mui/material';
import Messages from './Messages';
import PersonIcon from '@mui/icons-material/Person';
import { useParams } from 'react-router-dom'
import { getCookie } from '../utils'
import ChatSettings from './ChatSettings';
import SendMessageForm from './SendMessageForm';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

const { REACT_APP_BASE_BACKEND_URL } = process.env;

let lastDate = ""

const MiddleBar = ({ setLeftBarOpen }) => {
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [chat, setChat] = useState();
    const [linkedListItems, setLinkedListItems] = useState([])
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.up('sm'));

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const [messages, setMessages] = useState([])

    const WS_URL = 'ws://' + REACT_APP_BASE_BACKEND_URL.substring(7) + '/chat/' + id + '/';

    useWebSocket(WS_URL, {
        onOpen: () => {
            console.log('WebSocket connection established.');
        },
        onMessage: (ev) => {
            setMessages(prev => {
                prev = { ...prev, results: [JSON.parse(ev.data).message, ...(prev.results || [])] }
                return prev
            })
        }
    });

    function loadChatMessages(id, isLoadingMore) {
        setIsLoading(true)
        fetch(REACT_APP_BASE_BACKEND_URL + '/api/messages?chat_id=' + id + '&page=' + page, {
            credentials: 'include'
        }).then(res => {
            return res.json()
        }).then((data) => {
            setMessages(prev => {

                if (isLoadingMore) {
                    prev = { ...prev, results: [...(prev.results || []), ...(data.results || [])], next: data.next }
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
        fetch(REACT_APP_BASE_BACKEND_URL + '/api/chats/' + id, {
            credentials: 'include'
        }).then(res => {
            return res.json()
        }).then((data) => {
            setChat(data)
        })
    }

    function getLinkedItems(id) {
        fetch(REACT_APP_BASE_BACKEND_URL + '/api/messages?chat_id=' + id + '&page=' + page + '&pinned=1', {
            credentials: 'include'
        }).then(res => {
            return res.json()
        }).then((data) => {
            setLinkedListItems(data.results)
        })
    }

    useEffect(() => {
        loadChatMessages(id, true)
    }, [page])

    function setNextPage() {
        setPage(prev => prev + 1)
    }

    useEffect(() => {
        loadChatInfo(id)
        loadChatMessages(id)
        getLinkedItems(id)
        setPage(1)
    }, [id])

    if (getCookie("user_id") !== null) return (
        <div className="middleBar" style={{  width: "100vw", maxWidth: '100%',transition: 'margin-right .2s', marginRight: open ? '400px': 0 }}>
            <div className="topBar"  >
                {!isTablet && <div>
                    <IconButton onClick={() => setLeftBarOpen(true)}>
                        <MenuIcon />
                    </IconButton>
                </div>
                }
                <div onClick={handleDrawerOpen} style={{ display: 'flex', flexDirection: 'row', flex: 1, m: 10, justifyContent: 'space-around', alignItems: 'center' }}>
                    <h4>{chat?.type !== "private" ? chat?.name : getCookie('user_id') == chat?.users[0].id ?
                        chat?.users[1].first_name + " " + chat?.users[1].last_name
                        : chat?.users[0].first_name + " " + chat?.users[0].last_name || "Undefined"}</h4>
                    <div style={{ display: "flex" }}>
                        <IconButton end>
                            <Badge badgeContent={chat?.users.length} color="primary">
                                <PersonIcon />
                            </Badge>
                        </IconButton>
                    </div>
                    {isLoading && 'loading'}
                </div>
            </div>
            <div className="chat" >
                <div className="messages">
                    <Messages messages={messages} isLoading={isLoading} setNextPage={setNextPage} />
                </div>
                <SendMessageForm id={id} />
            </div>
            <ChatSettings handleDrawerClose={handleDrawerClose} open={open} chat={chat} chatId={id} linkedListItems={linkedListItems} />
        </div>
    );
}

export default MiddleBar;