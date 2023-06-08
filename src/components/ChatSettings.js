import { Drawer, List, IconButton, Divider, Button, Avatar } from "@mui/material";
import UserItem from "./UserItem";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { getCookie } from "../utils";
import { useEffect } from "react";

const ChatSettings = ({ handleDrawerClose, open, chat }) => {

    const isOwner = (getCookie("user_id") === chat?.creator?.id)

    const drawerWidth = "20%"

    function leaveChat() {
        fetch(`http://localhost:8000/api/chats/${chat.id}/leave_chat`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
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
                <IconButton disabled={!isOwner}>
                    <EditIcon />
                </IconButton>
            </div>
            <Divider />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "25px", maxHeight: '90%', paddingBottom: 10 }}>
                <div>
                    <h1 style={{ textAlign: "center", overflowWrap: "break-word" }}>{chat?.name}</h1>
                </div>
                <div>
                    <Avatar src={chat?.photo} sx={{ width: "200px", height: "200px" }} />
                </div>
                <List sx={{ overflowY: "auto", flex: 1 }}>
                    {chat?.users?.map(user => (
                        <UserItem user={user} isOwner={isOwner} currentUserId={getCookie("user_id")} />
                    ))}
                </List>
                <div style={{ display: "flex", flexDirection: 'column', gap: 10 }}>
                    <Button endIcon={<OpenInNewIcon />} variant='contained'>Дипломна методичка</Button>
                    <Button startIcon={<LogoutIcon />} color='error' onClick={leaveChat}>Вийти з чату</Button>
                </div>
            </div>
        </Drawer>
    );
}

export default ChatSettings;