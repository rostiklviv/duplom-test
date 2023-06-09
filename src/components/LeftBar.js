import React, { useState, useEffect, useContext } from 'react';
import { Avatar, List, Box, SpeedDial, SpeedDialIcon, SpeedDialAction, Drawer, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import './LeftBar.css'
import ChatItem from './ChatItem';
import CheckBoxList from './CheckBoxList';
import { getCookie } from '../utils'
import { UserContext } from './UserContext'
import UserSearch from './UserSearch';

const LeftBar = () => {
    const [chats, setChats] = useState([])
    const [speedDialOpen, setSpeedDialOpen] = useState(false)
    const [selectMenuOpen, setSelectMenuOpen] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(true)
    const [searchMenuOpen, setSearchMenuOpen] = useState(false)
    const { user } = useContext(UserContext)

    const handleSpeedDialState = () => speedDialOpen ? setSpeedDialOpen(false) : setSpeedDialOpen(true);
    const handleSpeedDialClose = () => setSpeedDialOpen(false);

    const handleDrawerState = () => drawerOpen ? setDrawerOpen(false) : setDrawerOpen(true);

    const drawerWidth = "20%"

    useEffect(() => {
        loadChats()
    }, [getCookie("user_id")])

    function loadChats() {
        fetch('http://localhost:8000/api/chats', {
            credentials: 'include'
        }).then(res => {
            return res.json()
        }).then(data => {
            data.results.sort((a, b) => a?.last_message?.timestamp - b?.last_message?.timestamp)
            setChats(data.results)
        })
    }

    const Chats = () => (
        <>
            {chats.map(chat => (
                <ChatItem key={chat.id} chat={chat} />
            ))}
        </>
    );

    const selectCreate = [
        { icon: <PersonIcon />, name: 'Приватний чат', action: handleSpeedDialSelectPersonalChat },
        { icon: <GroupIcon />, name: 'Груповий чат', action: handleSpeedDialSelectGroupChat },
        { icon: <SchoolIcon />, name: 'Дипломний чат'}
    ];


    function handleSpeedDialSelectPersonalChat() {
        setSearchMenuOpen(true)
        handleSpeedDialClose()
    }
    function handleSpeedDialSelectGroupChat() {
        setSelectMenuOpen(true)
        handleSpeedDialClose()
    }

    function handleSpeedDialCancleAction() {
        setSelectMenuOpen(false)
        setSearchMenuOpen(false)
        handleSpeedDialClose()
    }

    if (user.id) return (
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
                <h3 style={{ overflowWrap: "break-word", maxWidth: "50%" }}>{user?.first_name} {user?.last_name}</h3>
                <Avatar sx={{ width: 56, height: 56 }} src={user?.profile?.photo} />
            </div>
            {searchMenuOpen && <UserSearch handleSpeedDialCancleAction={handleSpeedDialCancleAction} />}
            {selectMenuOpen && <CheckBoxList handleSpeedDialCancleAction={handleSpeedDialCancleAction} loadChats={loadChats}/>}
            {(!selectMenuOpen && !searchMenuOpen) &&
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