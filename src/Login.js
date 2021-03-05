import React, { useState, useContext } from "react";
import { user, UserContext, User } from "./auth/User";
import "./Login.css";

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	  var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	  return v.toString(16);
	});
  }

export default function Login(props) {
  const [userName, setUserName] = useState("");
  const [image, setImage] = useState(1);
  const [user, setUser] = useContext(UserContext);

  const submit = () => {
    // call backend
    console.log("logging in", user)
    setUser(new User({ userName, image, userId: uuidv4() }));
  };

  return (
    <div id="login-page">
      <input type="text" placeholder={"username"} onChange={e => setUserName(e.target.value)}/>
      <input type="text" placeholder={"image"} onChange={e => setImage(e.target.value)}/>
      <button onClick={e => submit()}>Log in</button>
    </div>
  );
}