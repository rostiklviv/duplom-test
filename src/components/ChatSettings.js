import { useState } from "react";
import { Drawer, List, IconButton, Divider, Button, Avatar } from "@mui/material";
import UserItem from "./UserItem";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LinkedItem from './LinkedItem';
import DeleteIcon from '@mui/icons-material/Delete';
import { getCookie } from "../utils";
import { useEffect } from "react";
import EditChat from "./EditChat";

const ChatSettings = ({ handleDrawerClose, open, chat, chatId, linkedListItems }) => {

    const [isLinkedList, setIsLinkedList] = useState(false)
    const [page, setPage] = useState(1)
    const [editBarActive, setEditBarActive] = useState(false);

    const isOwner = (getCookie("user_id") == chat?.creator?.id)

    const drawerWidth = "20%"

    function leaveChat() {
        fetch(`http://localhost:8000/api/chats/${chatId}/leave_chat`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
    }

    console.log(linkedListItems)

    function deleteChat() {

        var csrftoken = getCookie('csrftoken');

        fetch(`http://localhost:8000/api/chats/${chatId}`, {
            credentials: 'include',
            method: 'DELETE',
            headers: {
                'X-CSRFToken': csrftoken
            },
            
        })
    }

    const openLinkedList = () => {
        setIsLinkedList(true)
    }

    const openUsersList = () => {
        setIsLinkedList(false)
    }

    const changeEditState = () => {
        !editBarActive ? setEditBarActive(true) : setEditBarActive(false)
    }

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                },
            }}
            variant="persistent"
            anchor="right"
            open={open}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", maxHeight: "10%", height: "100%" }}>
                <IconButton onClick={handleDrawerClose}>
                    <CloseIcon />
                </IconButton>
                <IconButton disabled={!isOwner} onClick={changeEditState}>
                    <EditIcon />
                </IconButton>
            </div>
            <Divider />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "25px", maxHeight: '90%', paddingBottom: 10 }}>
                {!editBarActive ?
                    <>
                        <div>
                            <h1 style={{ textAlign: "center", overflowWrap: "break-word" }}>{chat?.name}</h1>
                        </div>
                        <div>
                            <Avatar src={chat?.photo} sx={{ width: "200px", height: "200px" }} />
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <Button variant='contained' onClick={openUsersList}>Користувачі</Button>
                            <Button variant='contained' onClick={openLinkedList}>Закріплені файли</Button>
                        </div>
                        <List sx={{ overflowY: "auto", flex: 1 }}>
                            {!isLinkedList ?
                                chat?.users?.map(user => (
                                    <UserItem user={user} isOwner={isOwner} currentUserId={getCookie("user_id")} />
                                )) :
                                linkedListItems.map(linkedItem => (
                                    <LinkedItem file={linkedItem.file} isOwner={isOwner} />
                                ))}
                        </List>
                        <div style={{ display: "flex", flexDirection: 'column', gap: 10 }}>
                            <Button endIcon={<OpenInNewIcon />} variant='contained'>Дипломна методичка</Button>
                            <Button startIcon={<LogoutIcon />} color='error' onClick={leaveChat}>Вийти з чату</Button>
                            {isOwner && <Button startIcon={<DeleteIcon />} color='error' onClick={deleteChat} >Видалити чат</Button>}
                        </div>
                    </> : <EditChat chatId={chatId} chat={chat}/>}

            </div>
        </Drawer>
    );
}

export default ChatSettings;