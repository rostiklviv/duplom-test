import { useState, useEffect } from "react";
import { List, ListItem, ListItemButton, ListItemText, ListItemAvatar, Checkbox, Avatar, Box, IconButton } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { getCookie } from "../utils";

const CheckBoxList = ({ handleSpeedDialCancleAction }) => {

    const [checked, setChecked] = useState([]);
    const [users, setUsers] = useState([]);

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
        fetch('http://localhost:8000/api/users?page=1', {
            credentials: 'include'
        }).then(res => {
            return res.json()
        }).then(data => {
            setUsers(data.results)
        })
    }, [])


    function createGroupChat() {

        const userIds = checked.map((el) => el.id)

        if (userIds.length === 0) return;

        const newChat = { users: userIds, name: `Group ${Date.now()}`, type: 'group', creator: getCookie("user_id") }

        fetch('http://localhost:8000/api/chats', {
            credentials: 'include',
            method: 'POST',
            body: JSON.stringify(newChat),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })

        handleSpeedDialCancleAction()
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
                <IconButton size='large' onClick={handleSpeedDialCancleAction}>
                    <ClearIcon color='error' sx={{ fontSize: 50 }} />
                </IconButton>
                <IconButton onClick={createGroupChat}>
                    <CheckIcon color='success' sx={{ fontSize: 50 }} />
                </IconButton>
            </Box>
        </>
    );
}

export default CheckBoxList;