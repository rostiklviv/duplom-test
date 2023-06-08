import { Avatar } from "@mui/material";
import "./Message.css"
import { getCookie } from '../utils'

const Message = ({ message }) => {
    const userId = getCookie("user_id")
    const messageText = (message.text !== null) ? message.text : "test text"
    const time = (message !== null) ? message.timestamp.substring(10, 16) : "00:00"
    const user = (message !== null) ? message.user : null


    return (
        <div className={userId == message.user.id ? "messageOwner": "messageUser" }>
            <div className="messageInfo">
                <Avatar sx={{ width: "40px", height: "40px" }} src={user.profile.photo}></Avatar>
                <span>{time}</span>
            </div>
            <div className="messageContent">
                <p>{messageText}</p>
            </div>
        </div>
    );
}

export default Message;