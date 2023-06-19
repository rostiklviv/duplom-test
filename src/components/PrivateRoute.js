import React, { useEffect, useContext, useState } from 'react'
import { UserContext } from './UserContext'
import { Navigate } from 'react-router-dom'
import { getCookie } from '../utils'

const { REACT_APP_BASE_BACKEND_URL } = process.env;

function PrivateRoute({ children, skipRedirect = false }) {
    const { user } = useContext(UserContext)
    const cookieUserId = getCookie('user_id')
    const [logged, setLogged] = useState(false)

    useEffect(() => {

        fetch(REACT_APP_BASE_BACKEND_URL + '/api/users/me', {
            credentials: 'include'
        }).then(res => {
            if(res.ok) setLogged(true)
        })
    }, [])


    if (logged && !user?.id) {
        return <Navigate to={'/login/success/?user_id=' + cookieUserId} />
    }


    if (!user?.id && !skipRedirect) return <Navigate to={'/login'} />

    if (!user?.id && skipRedirect) return <></>
    return (
        <>{children}</>
    )
}

export default PrivateRoute