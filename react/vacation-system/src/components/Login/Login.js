import React, { useState } from 'react';
import { useLocalState } from '../../util/UseLocalStorage';
import './Login.css';

const Login = () => {
  const [jwt, setJwt] = useLocalState("", "jwt");
  const [email, setEmail] = useState("");
  const [emailLocalStorage, setEmailLocalStorage] = useLocalState("", "email");
  const [password, setPassword] = useState("");

  function sendLoginRequest() {
    const reqBody = {
      email: email,
      password: password
    };

    fetch("/users/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify(reqBody),
    }).then((response) => {
      if (response.status === 200) {
        setEmailLocalStorage(email);
        return Promise.all([response.json(), response.body]);
      }
      else
        return Promise.reject("Invalid login attempt.");
    })
      .then(([body, headers]) => {
        setJwt(body.token);
        window.location.href = "home";
      }).catch((message) => {
        alert(message);
      });
  }

  return (
    <div className="login-wrapper">
      <h1>Login Form</h1>
      <form>
        <div>
          Email
        </div>
        <div>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </div>
        <div>
          Password
        </div>
        <div>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <br></br>
        <div>
          <button type="button" onClick={() => sendLoginRequest()}>Login</button>
        </div>
      </form>
    </div>
  )
}

export default Login;