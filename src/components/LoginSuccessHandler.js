import React, { useEffect, useContext } from 'react'
import { UserContext } from './UserContext'
import {useNavigate} from 'react-router-dom'

function LoginSuccessHandler() {
    const { user, setUser } = useContext(UserContext)
    const navigate = useNavigate()
    useEffect(() => {

        fetch('http://localhost:8000/api/users/me', {
            credentials: 'include'
        }).then(res =>
            res.json()
        ).then(data => {
            setUser(data);
            navigate('/')
        })
    }, [])

    return (
        <div>LoginSuccessHandler</div>
    )
}

export default LoginSuccessHandler