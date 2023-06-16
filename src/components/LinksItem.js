import { ListItem, IconButton, ListItemText } from "@mui/material";
import LaunchIcon from '@mui/icons-material/Launch';
const LinksItem = ({link}) => {

    const splitedLink = link.split(': ');

    console.log(splitedLink)
    return (
        <ListItem
            key={splitedLink[0]}
            disableGutters
            secondaryAction={
                <IconButton aria-label="link" href={splitedLink[1]} target="_blank" >
                    <LaunchIcon />
                </IconButton>
            }
        >
            <ListItemText primary={splitedLink[0]} />
        </ListItem>
    );
}

export default LinksItem;