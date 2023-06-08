import CircularProgress from '@mui/material/CircularProgress';

const Loader = () => {
    return ( 
        <div className="loader" style={{ width: '100%', height: '100%'}}>
            <CircularProgress />
        </div>
     );
}
 
export default Loader;