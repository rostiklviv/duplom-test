import { useState } from "react";
import { Drawer, List, IconButton, Divider, Button, Avatar } from "@mui/material";
import UserItem from "./UserItem";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LinkedItem from './LinkedItem';
import LinksItem from "./LinksItem";
import { getCookie } from "../utils";
import { useEffect } from "react";
import EditChat from "./EditChat";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckBoxList from "./CheckBoxList";
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';


const { REACT_APP_BASE_BACKEND_URL } = process.env;

const ChatSettings = ({ handleDrawerClose, open, chat, chatId, linkedListItems }) => {
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.up('sm'));


    const [isLinkedList, setIsLinkedList] = useState(false)
    const [isLinksList, setIsLinksList] = useState(false)
    const [page, setPage] = useState(1)
    const [editBarActive, setEditBarActive] = useState(false);
    const [addUsersBarActive, setAddUsersBarActive] = useState(false);
    const [documents, setDocuments] = useState([]);

    const isOwner = (getCookie("user_id") == chat?.creator?.id)
    const isPrivate = (chat?.type === "private")
    const isDiploma = (chat?.type === "diploma")


    const drawerWidth = "400px"

    function leaveChat() {
        fetch(REACT_APP_BASE_BACKEND_URL + `/api/chats/${chatId}/leave_chat`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        })
    }

    function getDocuments() {
        fetch(REACT_APP_BASE_BACKEND_URL + '/api/document_templates', {
            credentials: 'include'
        }).then(res => {
            return res.json()
        }).then((data) => {
            setDocuments(data.results)
        })
    }

    function printDocument(titlePage) {
        window.open(REACT_APP_BASE_BACKEND_URL + `/api/users/print_document?document_name=${titlePage}.docx`, '_blank')
        // , {
        //     credentials: 'include',
        // })
    }

    useEffect(() => {
        setEditBarActive(false)
        setAddUsersBarActive(false)
        getDocuments()
    }, [chatId])

    const openLinkedList = () => {
        setIsLinkedList(true)
        setIsLinksList(false)
    }

    const openUsersList = () => {
        setIsLinkedList(false)
        setIsLinksList(false)
    }
    
    const openLinksList = () => {
        setIsLinksList(true)
        setIsLinkedList(false)
        console.log(chat.group.information.split('\r\n'))
    }

    const changeEditState = () => {
        !editBarActive ? setEditBarActive(true) : setEditBarActive(false)
    }

    const changeAddUsersState = () => {
        !addUsersBarActive ? setAddUsersBarActive(true) : setAddUsersBarActive(false)
    }

    return (
        <Drawer
            sx={{
                position: 'relative',
                width: isTablet ? drawerWidth : '100vw',
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: isTablet ? drawerWidth : '100vw',
                },
            }}
            variant="persistent"
            anchor="right"
            open={open}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", maxHeight: "10%", height: "100%" }}>
                <IconButton onClick={handleDrawerClose}>
                    <CloseIcon />
                </IconButton>
                <IconButton disabled={!isOwner} onClick={changeEditState}>
                    <EditIcon />
                </IconButton>
            </div>
            <Divider />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "25px", maxHeight: '90%', paddingBottom: 10 }}>
                {addUsersBarActive && <CheckBoxList handleCloseAction={changeAddUsersState} isAddMoreUsers={true} chatId={chatId} />}
                {isPrivate && <EditChat chatId={chatId} chat={chat} isPrivate={isPrivate} />}
                {editBarActive && <EditChat chatId={chatId} chat={chat} isPrivate={isPrivate} />}
                {!addUsersBarActive && !editBarActive && !isPrivate &&
                    <>
                        <div>
                            <h1 style={{ textAlign: "center", overflowWrap: "break-word" }}>{chat?.name}</h1>
                        </div>
                        <div>
                            <Avatar src={chat?.photo} sx={{ width: "200px", height: "200px" }} />
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px' }}>
                            <Button variant='contained' onClick={openUsersList} size="small">Користувачі</Button>
                            <Button variant='contained' onClick={openLinkedList} size="small">Закріплені файли</Button>
                            {isDiploma && <Button variant='contained' onClick={openLinksList} size="small" >Посилання</Button>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <List sx={{ overflowY: "auto", flex: 1, }}>
                                {!(isLinkedList || isLinksList) &&
                                    chat?.users?.map(user => (
                                        <UserItem user={user} isOwner={isOwner} currentUserId={getCookie("user_id")} />
                                    ))
                                }
                                {isLinkedList &&
                                    linkedListItems.map(linkedItem => (
                                        <LinkedItem file={linkedItem.file} isOwner={isOwner} />
                                    ))
                                }
                                {isLinksList && chat.group.information.split('\r\n').map(link => (
                                    <LinksItem link={link}/>
                                ))}
                            </List>
                            {!(isLinkedList || isLinksList) &&
                                <IconButton onClick={changeAddUsersState}>
                                    <PersonAddIcon />
                                </IconButton>
                            }

                        </div>
                        {isDiploma ?
                            <div style={{ display: "flex", justifyContent: "center", flexWrap: 'wrap', gap: '10px' }}>
                                <Button endIcon={<OpenInNewIcon />} variant='contained' href={chat.group.methodological_guide} target="_blank">Дипломна методичка</Button>
                                {documents.map(document => (
                                    <Button endIcon={<OpenInNewIcon />} variant='contained' onClick={() => printDocument(document.name)}>{document.button_text}</Button>
                                ))}
                            </div> :
                            <div style={{ display: "flex", flexDirection: 'column', gap: "10px" }}>
                                <Button startIcon={<LogoutIcon />} color='error' onClick={leaveChat}>Вийти з чату</Button>
                            </div>
                        }



                    </>
                }

            </div>
        </Drawer>
    );
}

export default ChatSettings;