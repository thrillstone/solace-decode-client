import React, { useEffect } from "react";

class User {
  constructor(obj) {
		this.userName = obj.userName;
    this.image = obj.image;
		this.userId = obj.userId;
	}

  save() {
    window.localStorage.setItem("user", JSON.stringify(this));
  }
}

let user = window.localStorage.getItem("user");
if (user) user = JSON.parse(user);
else user = {};
user = new User(user);
console.log("initialize user", user);
const UserContext = React.createContext({ user: user, setUser: () => {} });
export { user, UserContext, User }