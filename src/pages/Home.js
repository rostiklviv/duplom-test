
const Home = () => {

    function handleClick() {
        fetch('http://localhost:8000/api/chats/', {
            credentials: 'include'
        })
    }

    return ( 
        <div className="home" onClick={handleClick}>
            get request
        </div>
     );
}
 
export default Home;