import { useState } from 'react';

const Home = () => {

    const [posts, setPosts] = useState([]);

    function handleClick() {
        fetch('http://localhost:8000/api/chats/')
         .then((res) => res.json())
         .then((data) => {
            console.log(data);
            setPosts(data);
         })
         .catch((err) => {
            console.log(err.message);
         });
    }

    return ( 
        <div className="home" onClick={handleClick}>
            get request
        </div>
     );
}
 
export default Home;