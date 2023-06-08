import React, { useState, useEffect } from 'react';
import { Avatar, List, Box, SpeedDial, SpeedDialIcon, SpeedDialAction, Drawer, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import './LeftBar.css'
import ChatItem from './ChatItem';
import CheckBoxList from './CheckBoxList';
import { getCookie } from '../utils'


const LeftBar = () => {
    const [chats, setChats] = useState([])
    const [currentUser, setCurrentUser] = useState([])
    const [speedDialOpen, setSpeedDialOpen] = useState(false)
    const [selectMenuOpen, setSelectMenuOpen] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(true)

    const handleSpeedDialState = () => speedDialOpen ? setSpeedDialOpen(false) : setSpeedDialOpen(true);
    const handleSpeedDialClose = () => setSpeedDialOpen(false);

    const handleDrawerState = () => drawerOpen ? setDrawerOpen(false) : setDrawerOpen(true);

    const drawerWidth = "20%"

    useEffect(() => {
        fetch('http://localhost:8000/api/chats', {
            credentials: 'include'
        }).then(res => {
            return res.json()
        }).then(data => {
            data.results.sort((a, b) => a?.last_message?.timestamp - b?.last_message?.timestamp)
            setChats(data.results)
        })

        fetch('http://localhost:8000/api/users/' + getCookie("user_id"), {
            credentials: 'include'
        }).then(res => {
            return res.json()
        }).then(data => {
            setCurrentUser(data)
        })
    }, [getCookie("user_id")])

    const Chats = () => (
        <>
            {chats.map(chat => (
                <ChatItem key={chat.id} chat={chat} />
            ))}
        </>
    );

    const selectCreate = [
        { icon: <PersonIcon />, name: 'Personal chat' },
        { icon: <GroupIcon />, name: 'Group chat', action: handleSpeedDialSelectAction },
    ];


    function handleSpeedDialSelectAction() {
        setSelectMenuOpen(true)
        handleSpeedDialClose()
    }

    function handleSpeedDialCancleAction() {
        setSelectMenuOpen(false)
        handleSpeedDialClose()
    }

    if (getCookie("user_id") !== null) return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={drawerOpen}
        >
            <div className="topBar">
                <h3 style={{ overflowWrap: "break-word", maxWidth: "50%" }}>{currentUser?.first_name} {currentUser?.last_name}</h3>
                <Avatar sx={{ width: 56, height: 56 }} />
            </div>
            {selectMenuOpen && getCookie("user_id") !== null ?
                <CheckBoxList handleSpeedDialCancleAction={handleSpeedDialCancleAction} />
                :
                <>
                    <List style={{ width: "100%", height: "88%", overflowY: "auto" }}>
                        <Chats />
                    </List>
                    <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
                        <SpeedDial
                            ariaLabel="Slect Action"
                            sx={{ position: 'absolute', bottom: 16, right: 16 }}
                            icon={<SpeedDialIcon />}
                            open={speedDialOpen}
                            onClose={handleSpeedDialClose}
                            onClick={handleSpeedDialState}
                        >
                            {selectCreate.map((speedDialAction) => (
                                <SpeedDialAction
                                    key={speedDialAction.name}
                                    icon={speedDialAction.icon}
                                    tooltipTitle={speedDialAction.name}
                                    tooltipOpen
                                    onClick={speedDialAction.action}
                                />
                            ))}
                        </SpeedDial>
                    </Box>
                </>}
        </Drawer>
    );
}

export default LeftBar;