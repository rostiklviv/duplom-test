import { TextField, IconButton, Button } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getCookie } from "../utils";
import { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';

const { REACT_APP_BASE_BACKEND_URL } = process.env;

const EditChat = ({ chatId, chat, isPrivate }) => {

    const [chatName, setChatName] = useState(chat?.name)
    const [chatAvatar, setChatAvatar] = useState()

    const handleFileUpload = (event) => {
        setChatAvatar(event.target.files[0]);
    };

    const handleChatNameField = (event) => {
        event.preventDefault();
        setChatName(event.target.value)
    }

    const changeData = () => {
        const formData = new FormData();
        if (chatName !== chat?.name) { formData.append('name', chatName); chat.name = chatName}
        if (chatAvatar !== undefined) formData.append('photo', chatAvatar);

        var csrftoken = getCookie('csrftoken');

        fetch(REACT_APP_BASE_BACKEND_URL + '/api/chats/' + chatId, {
            credentials: 'include',
            method: 'PATCH',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'X-CSRFToken': csrftoken
            },
        })
    }

    function deleteChat() {

        var csrftoken = getCookie('csrftoken');

        fetch(REACT_APP_BASE_BACKEND_URL + `/api/chats/${chatId}`, {
            credentials: 'include',
            method: 'DELETE',
            headers: {
                'X-CSRFToken': csrftoken
            },

        })
    }

    return (
        <>
            {!isPrivate &&
                <div>
                    <h3 style={{ textAlign: "center", overflowWrap: "break-word" }}>Змінити назву групи</h3>
                    <TextField value={chatName} onChange={handleChatNameField} />
                </div>
            }
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ textAlign: "center", overflowWrap: "break-word" }}>Змінити аватар групи</h3>
                <input id="icon-button-chat-avatar-file"
                    type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
                <label htmlFor='icon-button-chat-avatar-file'>
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="file" component="span">
                        <AccountCircleIcon sx={{ width: "150px", height: "150px" }} />
                    </IconButton>
                </label>
            </div>
            <div>
                <Button variant="contained" onClick={changeData}>Підтвердити зміну</Button>
            </div>
            <div>
                <Button startIcon={<DeleteIcon />} color='error' onClick={deleteChat} >Видалити чат</Button>
            </div>
        </>
    );
}

export default EditChat