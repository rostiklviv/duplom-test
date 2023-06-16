import './App.css';
import { createContext, useState } from 'react'
import Router from './components/Router'
import { UserContext } from './components/UserContext'

function App() {
  const [user, setUser] = useState({ user: null })
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
        <div className="App">
          <Router />
        </div>
    </UserContext.Provider>
  );
}

export default App;
