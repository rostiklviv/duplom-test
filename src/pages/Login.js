import React, { useCallback } from 'react';
import GoogleButton from 'react-google-button';

const { REACT_APP_GOOGLE_CLIENT_ID, REACT_APP_BASE_BACKEND_URL } = process.env;

const Login = () => {

  const openGoogleLoginPage = useCallback(() => {
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const redirectUri = 'accounts/google/login/callback/';

    const scope = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile'
    ].join(' ');

    const params = {
      response_type: 'code',
      client_id: REACT_APP_GOOGLE_CLIENT_ID,
      redirect_uri: `${REACT_APP_BASE_BACKEND_URL}/${redirectUri}`,
      prompt: 'select_account',
      access_type: 'offline',
      scope
    };

    const urlParams = new URLSearchParams(params).toString();

    window.location = `${googleAuthUrl}?${urlParams}`;
  }, []);

  return (
    <div className="App">
      <div style={{ width: "30%", height: "80%",  display: "flex", justifyContent: "space-around", alignItems: "center", flexDirection: "column" }}>
        <h1>Університетський чат</h1>
        <img src='https://quarsu.nltu.edu.ua//storage/pages/March2020/Logo_NLTU.png' style={{ width: "300px", height: "400px" }}></img>
        <GoogleButton
          onClick={openGoogleLoginPage}
          label="Sign in with Google"
          disabled={!REACT_APP_GOOGLE_CLIENT_ID}
        />
      </div>
    </div>
  );
}

export default Login;