import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import DefaultPage from './DefaultPage';
import MiddleBar from './MiddleBar';
import AuthProvider from './AuthProvider';
import LeftBar from './LeftBar';
import PrivateRoute from './PrivateRoute';
import LoginSuccessHandler from './LoginSuccessHandler';
import { useState } from 'react';

const Router = () => {
    const [leftBarOpen, setLeftBarOpen] = useState(true)

    return (
        <>
            <PrivateRoute skipRedirect>
                <LeftBar leftBarOpen={leftBarOpen}  setLeftBarOpen={setLeftBarOpen} />
            </PrivateRoute>
            <Routes>
                <Route path='/login' element={<Login />} />

                <Route exact path='/' element={
                    <PrivateRoute>
                        <DefaultPage setLeftBarOpen={setLeftBarOpen} />
                    </PrivateRoute>
                } />

                <Route path='/room/:id' element={
                    <PrivateRoute>
                        <MiddleBar setLeftBarOpen={setLeftBarOpen}  />
                    </PrivateRoute>
                } />

                <Route path='/login/success/' element={
                    <LoginSuccessHandler />
                } />

            </Routes>
        </>

    );
}

export default Router;