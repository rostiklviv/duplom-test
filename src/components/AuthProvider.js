import React, { useContext } from 'react'
import { UserContext } from './UserContext'
import { useNavigate } from 'react-router-dom'
import { getCookie } from '../utils'

function AuthProvider({ children }) {
    const navigate = useNavigate()
    const { user } = useContext(UserContext)
    console.log(user.user);
    if (getCookie("user_id") === null) navigate('/login')

    return (
        <div>{children}</div>
    )
}

export default AuthProvider