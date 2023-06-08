import { Route, Routes } from 'react-router-dom';
import Login from '../pages/Login';
import Home from '../pages/Home';
import DefaultPage from './DefaultPage';
import MiddleBar from './MiddleBar';
import AuthProvider from './AuthProvider';
import LeftBar from './LeftBar';
import PrivateRoute from './PrivateRoute';

const Router = () => {
    return (
        <>
            <PrivateRoute skipRedirect>
                <LeftBar />
            </PrivateRoute>
            <Routes>
                <Route path='/login' element={<Login />} />

                <Route exact path='/' element={
                    <PrivateRoute>
                        <DefaultPage />
                    </PrivateRoute>
                } />

                <Route path='/room/:id' element={
                    <PrivateRoute>
                        <MiddleBar />
                    </PrivateRoute>
                } />

            </Routes>
        </>

    );
}

export default Router;