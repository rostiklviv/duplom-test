import { ListItem, IconButton, ListItemAvatar, ListItemText, Avatar } from "@mui/material";
import { Delete, Folder } from '@mui/icons-material'
import { useState } from "react";


const UserItem = ({ user, isOwner, currentUserId }) => {

    const [isHovered, setIsHovered] = useState(false)

    return (
        <ListItem
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            secondaryAction={
               <IconButton edge="end" aria-label="delete">
                   {(isHovered && isOwner && currentUserId != user.id) && <Delete />}
                </IconButton>

            }
        >
            <ListItemAvatar>
                <Avatar src={user.profile.photo} />
            </ListItemAvatar>
            <ListItemText
                primary={`${user.first_name} ${user.last_name}`}
            />
        </ListItem>
    );
}

export default UserItem;