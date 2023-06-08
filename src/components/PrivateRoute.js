import React from 'react'
import { Navigate } from 'react-router-dom'
import { getCookie } from '../utils'

function PrivateRoute({ children, skipRedirect = false }) {
    const user_id = getCookie("user_id")

    if (!user_id && !skipRedirect) return <Navigate to={'/login'} />

    if (!user_id && skipRedirect) return <></>
    return (
        <>{children}</>
    )
}

export default PrivateRoute