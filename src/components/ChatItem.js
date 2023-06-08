import React, { useState, useEffect, Fragment } from 'react';
import { Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'

const Chat = ({ chat }) => {
    const chatName = (chat.name !== null) ? chat.name : "Unknown"
    const user = (chat.last_message !== null) ? chat.last_message.user.first_name : "Vlad"
    const message = (chat.last_message !== null) ? " — " + chat.last_message.text : " — test message"
    const time = (chat.last_message !== null) ? chat.last_message.timestamp.substring(10, 16) : "00:00"
    const imageSource = chat.photo

    const navigate = useNavigate()


    return (
        <ListItem alignItems='flex-start' sx={{ paddingTop: "0px", paddingBottom: "0px" }}>
            <ListItemButton onClick={() => navigate(`/room/${chat.id}`)}>
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