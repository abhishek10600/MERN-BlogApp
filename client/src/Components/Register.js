import React, { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const register = async (ev) => {
    ev.preventDefault();
    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (response.status === 200) {
      alert("Signed up successfully");
    } else {
      alert("Signup failed");
    }
  };
  return (
    <>
      <form className="register" onSubmit={register}>
        <h1>Register</h1>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(ev) => {
            return setUsername(ev.target.value);
          }}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(ev) => {
            return setPassword(ev.target.value);
          }}
        />
        <button>Register</button>
      </form>
    </>
  );
};

export default Register;
