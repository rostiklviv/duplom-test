import { useState } from "react";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import "./Message.css"
import { getCookie } from '../utils'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageMessage from './ImageMessage'

const IMAGE_CONSTANTS = ['gif', 'png', 'jpg', 'jpeg', 'mp4']

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

    const parseUrl = (text) => {
        try {
            var url = new URL(text);
            var pathname = url.pathname;
            return <a href={text} target="_blank">{text}</a>
        }
        catch {
            return text;
        }
    }

    console.log(user.profile.photo)

    return (
        <div className={userId == message.user.id ? "messageOwner" : "messageUser"} key={message.number}>
            <div className="messageInfo">
                <Avatar sx={{ width: "40px", height: "40px" }} src={user.profile.photo}></Avatar>
                <span>{time}</span>
            </div>
            <div className="messageContent" onContextMenu={handleContextMenu}>
                {(message.file || IMAGE_CONSTANTS.includes(message.text.split('.').at(-1))) ?
                    <>
                        {(
                            IMAGE_CONSTANTS.includes(message?.file?.split('.').at(-1))
                            || IMAGE_CONSTANTS.includes(message?.text?.split('.').at(-1))
                        ) ?
                            <ImageMessage message={message} />

                            :
                            <>
                                <form action={message.file} method="get" target="_blank">
                                    <Button startIcon={<InsertDriveFileIcon />} type="submit">
                                        <p>{decodeURI(message.file.split('/').at(-1))}</p>
                                    </Button>
                                </form>
                            </>
                        }
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
                            <MenuItem onClick={() => { window.navigator.clipboard.writeText(messageText || message?.file); setContextMenu(null) }}>Скопіювати посилання</MenuItem>
                            {(!message.pinned) ? <MenuItem onClick={handlePin}>Закріпити</MenuItem> : <MenuItem onClick={handlePin}>Відкріпити</MenuItem>}
                        </Menu>
                    </> : <p>{parseUrl(messageText)}</p>
                }
            </div>
        </div>
    );
}

export default Message;