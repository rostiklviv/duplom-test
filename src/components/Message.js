import { useState } from "react";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import "./Message.css"
import { getCookie } from '../utils'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const Message = ({ message }) => {
    const userId = getCookie("user_id")
    const messageText = (message.text !== null) ? message.text : "test text"
    const time = (message !== null) ? message.timestamp.substring(10, 16) : "00:00"
    const user = (message !== null) ? message.user : null

    const [contextMenu, setContextMenu] = useState(null);

    const handleContextMenu = (event) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                    mouseX: event.clientX + 2,
                    mouseY: event.clientY - 6,
                }
                :
                null,
        );
    };

    const handleClose = () => {
        setContextMenu(null);
    };

    const handlePin = () => {
        var pinned = "";
        (!message.pinned) ? pinned = "pin_message" : pinned = "unpin_message"

        const chatNewMessage = { chat_id: message.chat }
        
        var csrftoken = getCookie('csrftoken');

        fetch('http://localhost:8000/api/messages/' + message.id + "/" + pinned, {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(chatNewMessage),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
        })
        setContextMenu(null);
    };


    return (
        <div className={userId == message.user.id ? "messageOwner" : "messageUser"} key={message.number}>
            <div className="messageInfo">
                <Avatar sx={{ width: "40px", height: "40px" }} src={user.profile.photo}></Avatar>
                <span>{time}</span>
            </div>
            <div className="messageContent" onContextMenu={handleContextMenu}>
                {(!message.file) ? <p>{messageText}</p> :
                    <>
                        <form action={message.file} method="get" target="_blank">
                            <Button type="submit">
                                <InsertDriveFileIcon />
                                <p>{decodeURI(message.file.split('/').at(-1))}</p>
                            </Button>
                        </form>
                    </>}

                <Menu
                    open={contextMenu !== null}
                    onClose={handleClose}
                    anchorReference="anchorPosition"
                    anchorPosition={
                        contextMenu !== null
                            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                            : undefined
                    }
                >
                    <MenuItem onClick={handleClose}>Видалити</MenuItem>
                    {(!message.pinned) ? <MenuItem onClick={handlePin}>Закріпити</MenuItem> : <MenuItem onClick={handlePin}>Відкріпити</MenuItem> }
                </Menu>
            </div>
        </div>
    );
}

export default Message;