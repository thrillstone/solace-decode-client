import React, { useState, useContext } from "react";
import { user, UserContext, User } from "./auth/User";
import {default as logoWhite} from './logos/SolaceLogoWhite.png';
import a1 from './avatars/1.svg';
import a2 from './avatars/2.svg';
import a3 from './avatars/3.svg';
import a4 from './avatars/4.svg';
import "./Login.css";

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	  var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
	  return v.toString(16);
	});
  }

export default function Login(props) {
  const [userName, setUserName] = useState("");
  const [p1, setp1] = useState(1);
  const [p2, setp2] = useState(.5);
  const [p3, setp3] = useState(.5);
  const [p4, setp4] = useState(.5);
  const [image, setImage] = useState(1);
  const [user, setUser] = useContext(UserContext);

  const submit = () => {
    // call backend
    console.log("logging in", user)
    setUser(new User({ userName, image, userId: uuidv4() }));
  };

  const avatarClick = (num) => {
    if (num == 1) {
      setp1(1);
      setp2(.5);
      setp3(.5);
      setp4(.5);
    }
    if (num == 2) {
      setp1(.5);
      setp2(1);
      setp3(.5);
      setp4(.5);
    }
    if (num == 3) {
      setp1(.5);
      setp2(.5);
      setp3(1);
      setp4(.5);
    }
    if (num == 4) {
      setp1(.5);
      setp2(.5);
      setp3(.5);
      setp4(1);
    }
    setImage(num);
  };

  return (
    <div id="login-page">
      <div id="login-subpage">
        <div class="logo-div">Logo/Graphic</div>
        <div id="powered-by">
          <p>Powered by </p>
          <img id="solace-logo-white" src={logoWhite}></img>
        </div>
        <p class="login-title">Welcome to TLDR</p>
        <p class="login-subtitle">Choose your avatar</p>
        <div id="avatar-pick">
          <img style={{opacity: p1}} class="login-avatar" src={a1} onClick={() => avatarClick(1)}></img>
          <img style={{opacity: p2}} class="login-avatar" src={a2} onClick={() => avatarClick(2)}></img>
          <img style={{opacity: p3}} class="login-avatar" src={a3} onClick={() => avatarClick(3)}></img>
          <img style={{opacity: p4}} class="login-avatar" src={a4} onClick={() => avatarClick(4)}></img>
        </div>
        <p class="login-subtitle">Enter your name</p>
        <input class="login-input" type="text" placeholder={"Name"} onChange={e => setUserName(e.target.value)}/>
        {/* <input type="text" placeholder={"image"} onChange={e => setImage(e.target.value)}/> */}
        <button class="login-submit" onClick={e => submit()}>Start Messaging</button>
      </div>
    </div>
  );
}