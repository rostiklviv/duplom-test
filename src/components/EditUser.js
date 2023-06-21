import { TextField, Button, Dialog, Avatar, IconButton } from "@mui/material";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import { getCookie } from "../utils";
import { useCookies } from "react-cookie"
import {useNavigate} from 'react-router-dom'

const { REACT_APP_BASE_BACKEND_URL } = process.env;

const EditUser = ({ open, handleClose, user }) => {
    const [cookies, setCookie, removeCookie] = useCookies(['sessionid']);
    const navigate = useNavigate()

    const [userFirstName, setUserFirstName] = useState(user.first_name)
    const [userMiddleName, setUserMiddleName] = useState(user.profile.patronymic)
    const [userLastName, setUserLastName] = useState(user.last_name)
    const [userAvatar, setUserAvatar] = useState(REACT_APP_BASE_BACKEND_URL + user.profile.photo)
    const [userDiplomaReviewer, setUserDiplomaReviewer] = useState(user.profile.diploma_reviewer)
    const [userDiplomaFirstSupervisor, setUserDiplomaFirstSupervisor] = useState(user.profile.diploma_supervisor_1)
    const [userDiplomaSecondSupervisor, setUserDiplomaSecondSupervisor] = useState(user.profile.diploma_supervisor_2)
    const [userDiplomaTopic, setUserDiplomaTopic] = useState(user.profile.diploma_topic)

    const handleFileUpload = (event) => {
        setUserAvatar(event.target.files[0]);
    };

    const changeData = () => {
        const formData = new FormData();
        if (userFirstName !== user.first_name) {
            formData.append('first_name', userFirstName)
            user.first_name = userFirstName
        }
        if (userLastName !== user.last_name) {
            formData.append('last_name', userLastName);
            user.last_name = userLastName
        }
        userMiddleName !== user.profile.patronymic && formData.append('profile.patronymic', userMiddleName); user.profile.patronymic = userMiddleName;
        userDiplomaReviewer !== user.profile.diploma_reviewer && formData.append('profile.diploma_reviewer', userDiplomaReviewer);
        userDiplomaFirstSupervisor !== user.profile.diploma_supervisor_1 && formData.append('profile.diploma_supervisor_1', userDiplomaFirstSupervisor);
        userDiplomaSecondSupervisor !== user.profile.diploma_supervisor_2 && formData.append('profile.diploma_supervisor_2', userDiplomaSecondSupervisor);
        userDiplomaTopic !== user.profile.diploma_topic && formData.append('profile.diploma_topic', userDiplomaTopic);
        if (userAvatar !== undefined && userAvatar !== REACT_APP_BASE_BACKEND_URL + user.profile.photo) {
            formData.append('profile.photo', userAvatar);
            user.profile.photo = userAvatar
        }
        // userMiddleName !== user.profile.patronymic && formData.append('profile.patronymic', userMiddleName); user.profile.patronymic = userMiddleName;
        // userLastName !== user.last_name && formData.append('last_name', userLastName);
        // userDiplomaReviewer !== user.profile.diploma_reviewer && formData.append('profile.diploma_reviewer', userDiplomaReviewer);
        // userDiplomaFirstSupervisor !== user.profile.diploma_supervisor_1 && formData.append('profile.diploma_supervisor_1', userDiplomaFirstSupervisor);
        // userDiplomaSecondSupervisor !== user.profile.diploma_supervisor_2 && formData.append('profile.diploma_supervisor_2', userDiplomaSecondSupervisor);
        // userDiplomaTopic !== user.profile.diploma_topic && formData.append('profile.diploma_topic', userDiplomaTopic);
        // userAvatar !== undefined ?? formData.append('profile.photo', userAvatar);

        var csrftoken = getCookie('csrftoken');

        fetch(REACT_APP_BASE_BACKEND_URL + '/api/users/' + user.id, {
            credentials: 'include',
            method: 'PATCH',
            body: formData,
            headers: {
                'X-CSRFToken': csrftoken
            },
        })
    }

    const logout = () => {
        var csrftoken = getCookie('csrftoken');
        fetch(REACT_APP_BASE_BACKEND_URL + "/admin/logout", {
            method: 'POST',
            credentials: 'include',
            redirect: 'follow',
            headers: {
                'X-CSRFToken': csrftoken
            },
        }).then(res => {
            navigate('/login')
        })
    }

    return (
        <>
            <Dialog
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, textAlign: 'center' }}
                open={open}
                onClose={handleClose}
                fullWidth
            >
                <div style={{ textAlign: "end" }}>
                    <IconButton onClick={handleClose}>
                        <CloseIcon style={{ height: '30px', width: '30px' }} />
                    </IconButton>
                </div>
                <div style={{ flexDirection: "column", display: "flex", alignItems: 'center' }}>
                    <h3>Аватар</h3>
                    <input id="icon-button-profile-avatar-file" accept="image/*"
                        type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
                    <label htmlFor='icon-button-profile-avatar-file'>
                        <IconButton type="button" aria-label="file" component="span">
                            <Avatar sx={{ width: '150px', height: '150px' }} src={typeof userAvatar !== 'string' ? URL.createObjectURL(userAvatar) : userAvatar} />
                        </IconButton>
                    </label>
                </div>
                <div>
                    <h3>Ім'я</h3>
                    <TextField value={userFirstName} onChange={(event) => { setUserFirstName(event.target.value) }} />
                </div>
                <div>
                    <h3>Прізвище</h3>
                    <TextField value={userLastName} onChange={(event) => { setUserLastName(event.target.value) }} />
                </div>
                <div>
                    <h3>По батькові</h3>
                    <TextField value={userMiddleName} onChange={(event) => { setUserMiddleName(event.target.value) }} />
                </div>
                <div>
                    <h3>Тема диплому</h3>
                    <TextField value={userDiplomaTopic} onChange={(event) => { setUserDiplomaTopic(event.target.value) }} />
                </div>
                <div>
                    <h3>Перший керівник диплому</h3>
                    <TextField value={userDiplomaFirstSupervisor} onChange={(event) => { setUserDiplomaFirstSupervisor(event.target.value) }} />
                </div>
                <div>
                    <h3>Другий керівнк диплому</h3>
                    <TextField value={userDiplomaSecondSupervisor} onChange={(event) => { setUserDiplomaSecondSupervisor(event.target.value) }} />
                </div>
                <div>
                    <h3>Рецензент</h3>
                    <TextField value={userDiplomaReviewer} onChange={(event) => { setUserDiplomaReviewer(event.target.value) }} />
                </div>
                <Button variant="contained" size="large" sx={{ marginTop: '20px' }} onClick={changeData}>Оновити дані</Button>
                <Button variant="contained" size="large" sx={{ marginTop: '5px' }} color="error" onClick={logout}>Вийти</Button>
            </Dialog>
        </>
    );
}

export default EditUser;