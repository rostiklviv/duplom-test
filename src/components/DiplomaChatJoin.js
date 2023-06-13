import { Dialog, IconButton, TextField, Button } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { getCookie } from "../utils";
import { useState } from "react";

const { REACT_APP_BASE_BACKEND_URL } = process.env;

const DiplomaChatJoin = ({ open, handleClose, setDataChanged}) => {

    const [groupCode, setGroupCode] = useState('')

    function joinDiplomaChat() {

        const formData = new FormData();
        if(groupCode !== '') formData.append('code', groupCode);

        var csrftoken = getCookie('csrftoken');

        fetch(REACT_APP_BASE_BACKEND_URL + '/api/users/change_group', {
            credentials: 'include',
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
                'X-CSRFToken': csrftoken
            },
        })

        setDataChanged(true)
        handleClose()
    }

    const onChange = (event) => {
        event.preventDefault()
        setGroupCode(event.target.value)
    }

    return (
        <>
            <Dialog
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, textAlign: 'center' }}
                open={open}
                onClose={handleClose}
            >
                <div style={{ display: "flex", justifyContent: 'space-around' }}>
                    <h3>Введіть код чату</h3>
                    <div>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>
                <div style={{ margin: '10px' }}>
                    <TextField value={groupCode} onChange={onChange} />
                </div>
                <Button variant="contained" size="large" onClick={joinDiplomaChat}>Підключитись</Button>
            </Dialog>
        </>
    );
}

export default DiplomaChatJoin;