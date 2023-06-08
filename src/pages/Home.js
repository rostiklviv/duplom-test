import LeftBar from "../components/LeftBar";
import MiddleBar from "../components/MiddleBar";
import './Home.css'

const Home = () => {

    function handleClick() {
        fetch('http://localhost:8000/api/chats/', {
            credentials: 'include'
        })
    }

    return ( 
        <div className="home">
            <MiddleBar />
        </div>
     );
}
 
export default Home;