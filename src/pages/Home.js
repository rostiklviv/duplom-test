
const Home = () => {

    function handleClick() {
        fetch('http://localhost:8000/api/chats/', {
            credentials: 'same-origin',
            headers: { "Content-Type": "application/json" },
        }).then(response => response.json())
        .then(data => this.setState({ totalReactPackages: data.total }));
    }

    return ( 
        <div className="home" onClick={handleClick}>
            get request
        </div>
     );
}
 
export default Home;