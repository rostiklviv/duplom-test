import { useState } from "react";
import { ListItem, Button, IconButton, ListItemAvatar, ListItemText } from "@mui/material";
import { Delete } from '@mui/icons-material'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const LinkedItem = ({file, isOwner}) => {

    const [isHovered, setIsHovered] = useState(false)

    return ( 
        <ListItem
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            secondaryAction={
               <IconButton edge="end" aria-label="delete">
                   {(isHovered && isOwner) && <Delete />}
                </IconButton>

            }
        >
            <ListItemAvatar>
                <InsertDriveFileIcon />
            </ListItemAvatar>
            <ListItemText
                primary={decodeURI(file.split('/').at(-1))}
            />
        </ListItem>
     );
}
 
export default LinkedItem;