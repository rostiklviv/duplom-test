import React, { useState, useEffect, Fragment } from 'react';
import { Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import { getCookie } from '../utils';

const Chat = ({ chat, setLeftBarOpen, isTablet }) => {
    const otherUserId = (getCookie('user_id') == chat.users[0].id) ? 1 : 0 
    const chatName = (chat.type !== "private") ? chat.name : chat.users[otherUserId].first_name + " " + chat.users[otherUserId].last_name 
    const user = (chat.last_message !== null) ? chat.last_message.user.first_name : ""
    const message = (chat.last_message !== null) ? !chat.last_message?.file ? " — " + lastMessageText(chat.last_message.text) : " — " + 
    lastMessageText(decodeURI(chat.last_message.file.split('/').at(-1))) : ""
    const time = (chat.last_message !== null) ? chat.last_message.timestamp.substring(10, 16) : ""
    const imageSource = chat.photo

    const navigate = useNavigate()

    function lastMessageText(text) {
        if(text.length < 20) return text
        else return  text.substring(0, 20) + "..."
    }

    return (
        <ListItem alignItems='flex-start' sx={{ paddingTop: "0px", paddingBottom: "0px" }}>
            <ListItemButton onClick={() =>{navigate(`/room/${chat.id}`); !isTablet && setLeftBarOpen(false)}}>
                <ListItemAvatar>
                    <Avatar src={imageSource} />
                </ListItemAvatar>
                <ListItemText
                    primary={chatName}
                    secondary={
                        <Fragment>
                            <Typography
                                sx={{ display: 'inline' }}
                                component="span"
                                variant="body2"
                                color="text.primary"
                            >
                                {time} {user}
                            </Typography>
                            {message}
                        </Fragment>
                    }
                />
            </ListItemButton>
        </ListItem>
    );
}

export default Chat;