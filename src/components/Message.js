import { useState, useContext } from "react";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import "./Message.css"
import { getCookie } from '../utils'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageMessage from './ImageMessage'
import { UserContext } from './UserContext'

const IMAGE_CONSTANTS = ['gif', 'png', 'jpg', 'jpeg', 'mp4']
const { REACT_APP_BASE_BACKEND_URL } = process.env;

const Message = ({ message }) => {
    const { user } = useContext(UserContext)
    const messageText = (message.text !== null) ? message.text : "test text"
    const time = (message !== null) ? message.timestamp.substring(10, 16) : "00:00"
    const messageUser = (message !== null) ? message.user : null
    const [pinned, setPinned] = useState(!message?.pinned)
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

        const pinText = pinned ? "unpin_message" : 'pin_message'

        const chatNewMessage = { chat_id: message.chat }

        const csrftoken = getCookie('csrftoken');

        fetch(REACT_APP_BASE_BACKEND_URL + '/api/messages/' + message.id + "/" + pinText, {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(chatNewMessage),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
        }).then((res) => {
            setPinned(prev => !prev)
        }).catch(() => { })

        setContextMenu(null);
    };

    const delMessage = () => {
        const csrftoken = getCookie('csrftoken');

        fetch(REACT_APP_BASE_BACKEND_URL + '/api/messages/' + message.id + "/delete", {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-CSRFToken': csrftoken
            },
        })
        setContextMenu(null);
    }

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

    return (
        <div className={user?.id == message.user.id ? "messageOwner" : "messageUser"} key={message.number}>
            <div className="messageInfo">
                <Avatar sx={{ width: "40px", height: "40px" }} src={messageUser.profile.photo}></Avatar>
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
                            {(!pinned) ? <MenuItem onClick={handlePin}>Закріпити</MenuItem> : <MenuItem onClick={handlePin}>Відкріпити</MenuItem>}
                            {user?.id == message.user.id && <MenuItem onClick={handlePin} sx={{color: "red"}}>Видалити</MenuItem>}
                        </Menu>
                    </> : <>
                        <p>{parseUrl(messageText)}</p>
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
                            {user?.id == message.user.id && <MenuItem onClick={handlePin} sx={{color: "red"}}>Видалити</MenuItem>}
                        </Menu></>
                }
            </div>
        </div>
    );
}

export default Message;