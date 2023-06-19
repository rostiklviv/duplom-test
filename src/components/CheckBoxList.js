import { useState, useEffect } from "react";
import { List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Checkbox, Avatar, Box, IconButton } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { getCookie } from "../utils";

const { REACT_APP_BASE_BACKEND_URL } = process.env;

const CheckBoxList = ({ handleCloseAction, isAddMoreUsers = false, chatId = -1, setDataChanged }) => {

    const [checked, setChecked] = useState([]);
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);

    const handleToggle = (value) => () => {
        console.log(value, checked)
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    useEffect(() => {
        fetch(REACT_APP_BASE_BACKEND_URL + '/api/users?page=' + page, {
            credentials: 'include'
        }).then(res => {
            return res.json()
        }).then(data => {
            setUsers(data.results)
        })
    }, [page])


    function createGroupChat() {

        const userIds = checked.map((el) => el.id)

        if (userIds.length === 0) return;

        const newChat = { users: userIds, name: `Group ${Date.now()}`, type: 'group', creator: getCookie("user_id") }

        var csrftoken = getCookie('csrftoken');

        fetch(REACT_APP_BASE_BACKEND_URL + '/api/chats', {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(newChat),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
        })

        setDataChanged()
        handleCloseAction()
    }

    function addUser() {
        
        const userIds = checked.map((el) => el.id)

        if (userIds.length === 0) return;

        const newUsers = { users: userIds}

        var csrftoken = getCookie('csrftoken');

        fetch(REACT_APP_BASE_BACKEND_URL + '/api/chats/' + chatId + '/add_users', {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(newUsers),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            },
        })

        handleCloseAction()
    }

    return (
        <>
            <List dense sx={{ width: '100%', height: "88%", overflowY: "auto" }}>
                {users.map((value) => {
                    const labelId = `checkbox-list-secondary-label-${value}`;
                    return (
                        <ListItem
                            key={value.id}
                            secondaryAction={
                                <Checkbox
                                    edge="end"
                                    onChange={handleToggle(value)}
                                    checked={checked.indexOf(value) !== -1}
                                    inputProps={{ 'aria-labelledby': labelId }}

                                />
                            }
                            disablePadding
                        >
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Avatar
                                        src={value.profile.photo}
                                    />
                                </ListItemAvatar>
                                <ListItemText id={labelId} primary={value.last_name + " " + value.first_name} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
            <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton size='large' onClick={handleCloseAction}>
                    <ClearIcon color='error' sx={{ fontSize: 50 }} />
                </IconButton>
                <IconButton onClick={isAddMoreUsers ? addUser : createGroupChat}>
                    <CheckIcon color='success' sx={{ fontSize: 50 }} />
                </IconButton>
            </Box>
        </>
    );
}

export default CheckBoxList;