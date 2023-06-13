import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';

export default function ImageMessage({ message }) {
    const url = message.file || message.text
    const [open, setOpen] = React.useState(false);
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    console.log(message)

    return (
        <div>
            <Button onClick={handleOpen} className='imageContainer'>
                {url.includes('.mp4') ? <video src={url} loading="lazy" width='250px' height='auto' style={{ objectFit: 'contain' }}>
                </video> :
                    <img src={url} loading="lazy" width='250px' height='auto' style={{ objectFit: 'contain' }} />}
            </Button>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                {url.includes('.mp4') ? <video loading="lazy" width='250px' height='auto' style={{ objectFit: 'contain' }} controls autoPlay >

                    <source src={url} type="video/mp4" /> Video is not supported
                </video> :
                    <img src={url} loading="lazy" width='250px' height='auto' style={{ objectFit: 'contain' }} />}
            </Backdrop>
        </div>
    );
}
