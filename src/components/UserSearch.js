import { useState, useEffect } from "react";
import { alpha, styled, List, ListItem, ListItemButton, ListItemAvatar, Avatar, InputBase, ListItemText, Box, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { getCookie } from '../utils'


const UserSearch = ({ handleSpeedDialCancleAction, user, setDataChanged }) => {

  const [users, setUsers] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const [page, setPage] = useState(1)

  const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));


  function SearchUser(searchValue) {
    fetch('http://localhost:8000/api/users?page=' + page + '&search=' + searchValue, {
      credentials: 'include'
    }).then(res => {
      return res.json()
    }).then(data => {
      setUsers(data.results)
    })
  }
  useEffect(() => {
    fetch('http://localhost:8000/api/users?page=' + page + '&search=' + searchValue, {
      credentials: 'include'
    }).then(res => {
      return res.json()
    }).then(data => {
      setUsers(data.results)
    })
  }, [])

  useEffect(() => {
    if (searchValue.length % 3 == 0)
      SearchUser(searchValue)
  }, [searchValue])

  const onChange = (event) => {
    setSearchValue(event.target.value)
  }

  const createPrivateChat = (userId) => {

    const usersIds = [user.id, userId]
    console.log(userId)
    const newChat = { users: usersIds, type: 'private', name: (user.id + ' ' + userId) }

    fetch('http://localhost:8000/api/chats/private_chat_exists?user_id=' + userId, {
      credentials: 'include',
    }).then(res => {
      return res.json()
    }).then((data) => {
      if (!data.exists) {
        var csrftoken = getCookie('csrftoken');

        fetch('http://localhost:8000/api/chats', {
          credentials: 'include',
          method: 'POST',
          body: JSON.stringify(newChat),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken
          },
        })
      }
    })


    setDataChanged(true)
    handleSpeedDialCancleAction()
  }



  return (
    <>
      <Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          autoFocus="autoFocus"
          inputProps={{ 'aria-label': 'search' }}
          value={searchValue}
          onChange={onChange}
        />
      </Search>
      <List dense sx={{ width: '100%', height: "88%", overflowY: "auto" }}>
        {users.map((value) => {
          const labelId = `user-${value.id}`;
          return (
            <ListItem
              key={value.id}
              disablePadding
              onClick={() => { createPrivateChat(value.id) }}
            >
              <ListItemButton>
                <ListItemAvatar>
                  <Avatar
                    src={value.profile.photo}
                  />
                </ListItemAvatar>
                <ListItemText value={value.id} id={labelId} primary={value.last_name + " " + value.first_name} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton size='large' onClick={handleSpeedDialCancleAction}>
          <ClearIcon color='error' sx={{ fontSize: 50 }} />
        </IconButton>
      </Box>
    </>
  );
}

export default UserSearch;