import Message from './Message';
import { Divider, Avatar, Button } from '@mui/material';
import Loader from './Loader';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import { useState } from 'react';

let lastDate = ''

const Messages = ({ messages, isLoading, setNextPage }) => {
    return (
        <>
            {
                (messages.results !== undefined) ? <>
            
                {(() => lastDate = "")()}
                {messages.results.map(message => {
                    let anotherDay = false;
                    console.log(lastDate)
                    console.log(message.number)
                    if (lastDate === ""){
                        lastDate = message.timestamp.substring(0, 10)
                    }
                    if (lastDate !== message.timestamp.substring(0, 10)) {
                        anotherDay = true;
                        
                    }
                    console.log(anotherDay)

                    var return_value = <>
                    <Message message={message} />
                    {anotherDay && <Divider key={lastDate}>{lastDate}</Divider>}
                    </>

                    if (anotherDay){
                        lastDate = message.timestamp.substring(0, 10)
                    }

                    return (return_value)
                }

                )}
                    <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', paddingTop: 25 }}>
                        {
                            (messages.next) ?
                                <Button variant="contained" sx={{ width: 30 }} onClick={setNextPage}>
                                    {isLoading ? <Loader /> : <KeyboardDoubleArrowUpIcon />}
                                </Button>
                                :
                                <></>
                        }
                    </div>
                </> : null
            }
        </>
    );
}

export default Messages;