import Message from './Message';
import { Divider, Avatar, Button } from '@mui/material';
import Loader from './Loader';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

let lastDate = ""

const Messages = ({ messages, isLoading, setNextPage }) => {

    return (
        <>
            {(messages.results !== undefined) ? <> {messages.results.map(message => {
                let anotherDay = false;
                
                if (lastDate !== message.timestamp.substring(0, 10)) {
                    anotherDay = true;
                    lastDate = message.timestamp.substring(0, 10)
                }
                return (
                    <>
                        <Message message={message} />
                        {anotherDay && <Divider key={lastDate}>{message.timestamp.substring(0, 10)}</Divider>}
                    </>
                )
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
            </> : null}
        </>
    );
}

export default Messages;