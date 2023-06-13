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
import EditUser from './EditUser';
import DiplomaChatJoin from './DiplomaChatJoin';

const { REACT_APP_BASE_BACKEND_URL } = process.env;

const LeftBar = () => {
    const [chats, setChats] = useState([])
    const [speedDialOpen, setSpeedDialOpen] = useState(false)
    const [selectMenuOpen, setSelectMenuOpen] = useState(false)
    const [drawerOpen, setDrawerOpen] = useState(true)
    const [searchMenuOpen, setSearchMenuOpen] = useState(false)
    const [profileEditOpen, setProfileEditOpen] = useState(false)
    const [diplomaChatMenuOpen, setDiplomaChatMenuOpen] = useState(false)
    const [dataChanged, setDataChanged] = useState(false)
    const { user } = useContext(UserContext)

    const handleSpeedDialState = () => speedDialOpen ? setSpeedDialOpen(false) : setSpeedDialOpen(true);
    const handleSpeedDialClose = () => setSpeedDialOpen(false);

    const handleDrawerState = () => drawerOpen ? setDrawerOpen(false) : setDrawerOpen(true);

    console.log(UserContext)

    const drawerWidth = "20%"

    useEffect(() => {
        const interval = setInterval(() => {
            loadChats()
        }, 5000);
        return () => clearInterval(interval);

    }, [getCookie("user_id")])

    useEffect(() => {
        loadChats()
        // loadUser()
        setDataChanged(false)
    }, [dataChanged])

    function loadChats() {
        fetch('http://localhost:8000/api/chats', {
            credentials: 'include'
        }).then(res => {
            return res.json()
        }).then(data => {
            setChats(data.results.sort(function (a, b) {
                if (a.last_message === b.last_message) {
                    return 0;
                }
            
                if (a.last_message === null) {
                    return 1;
                }
                if (b.last_message === null) {
                    return -1;
                }
            
                return a.last_message.timestamp < b.last_message.timestamp ? 1 : -1;
            }))
        })
    }

    // function loadUser() {
    //     fetch('http://localhost:8000/api/users/' + user.id, {
    //         credentials: 'include'
    //     }).then(res => {
    //         return res.json()
    //     }).then(data => {
    //     })
    // }

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
        { icon: <SchoolIcon />, name: 'Дипломний чат', action: handleDiplomaChatMenuOpen }
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

    const handleProfileEditOpen = () => {
        setProfileEditOpen(true)
    }
    const handleProfileEditClose = () => {
        setProfileEditOpen(false)
    }

    function handleDiplomaChatMenuOpen() {
        user.profile?.diploma && setDiplomaChatMenuOpen(true)
    }

    const handleDiplomaChatMenuClose = () => {
        setDiplomaChatMenuOpen(false)
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
            <div className="topBar" onClick={(handleProfileEditOpen)}>
                <h3 style={{ overflowWrap: "break-word", maxWidth: "50%" }}>{user?.first_name} {user?.last_name}</h3>
                <Avatar sx={{ width: 56, height: 56 }} src={typeof user.profile.photo !== 'string' ? URL.createObjectURL(user.profile.photo) : REACT_APP_BASE_BACKEND_URL + user.profile.photo} />
            </div>
            {searchMenuOpen && <UserSearch handleSpeedDialCancleAction={handleSpeedDialCancleAction} user={user} setDataChanged={setDataChanged}/>}
            {selectMenuOpen && <CheckBoxList handleCloseAction={handleSpeedDialCancleAction} setDataChanged={setDataChanged} />}
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
            <EditUser open={profileEditOpen} handleClose={handleProfileEditClose} user={user} />
            <DiplomaChatJoin open={diplomaChatMenuOpen} handleClose={handleDiplomaChatMenuClose} setDataChanged={setDataChanged} />
        </Drawer>
    );
}

export default LeftBar;