import { TextField, IconButton, Button } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { getCookie } from "../utils";
import { useState } from "react";

const EditChat = ({ chatId, chat }) => {

    const [chatName, setChatName] = useState(chat?.name)
    const [chatAvatar, setChatAvatar] = useState()

    const baseName = chat?.name

    const handleFileUpload = (event) => {
        setChatAvatar(event.target.files[0]);
    };

    const handleChatNameField = (event) => {
        event.preventDefault();
        setChatName(event.target.value)
    }

    const changeData = () => {
        const formData = new FormData();
        if(chatName !== baseName) formData.append('name', chatName);
        if(chatAvatar !== undefined) formData.append('photo', chatAvatar);

        var csrftoken = getCookie('csrftoken');

        fetch('http://localhost:8000/api/chats/' + chatId, {
            credentials: 'include',
            method: 'PATCH',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'X-CSRFToken': csrftoken
            },
        })
    }

    return (
        <>
            <div>
                <h3 style={{ textAlign: "center", overflowWrap: "break-word" }}>Змінити назву групи</h3>
                <TextField value={chatName} onChange={handleChatNameField} />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <h3 style={{ textAlign: "center", overflowWrap: "break-word" }}>Змінити аватар групи</h3>
                <input id="icon-button-avatar-file"
                    type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
                <label htmlFor='icon-button-avatar-file'>
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="file" component="span">
                        <AccountCircleIcon sx={{ width: "150px", height: "150px" }} />
                    </IconButton>
                </label>
            </div>
            <div>
                <Button variant="contained" onClick={changeData}>Підтвердити зміну</Button>
            </div>
        </>
    );
}

export default EditChat