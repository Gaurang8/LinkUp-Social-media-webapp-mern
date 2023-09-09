import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { MyContext } from "../MyContext";
import logo from "../pagelogo.png";
import "./CSS/user.css";


function User() {
  const { setIsAuth, setUser } = useContext(MyContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmitReg = async (e) => {
    e.preventDefault();

    console.log(process.env.REACT_APP_BACKEND_ADDR);
    const newUser = { name, email, password };

    const response = await fetch(`${process.env.REACT_APP_BACKEND_ADDR}/register`, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });

    try {
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setIsAuth(true)
        setUser(result.user)
        setName("");
        setPassword("");
        setEmail("");
        navigate("/");
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      setError("Enter Correct Input");
    }
  };
  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    const newUser = { email, password };

    const response = await fetch(`${process.env.REACT_APP_BACKEND_ADDR}/login`, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });

    try {
      if (response.ok) {
        const result = await response.json();
        console.log(result);
        setIsAuth(true)
        setUser(result.user)
        console.log(document.cookie);
        setName("");
        setPassword("");
        setEmail("");
        navigate("/");
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      setError("Enter Correct Input");
    }
  };
  return (
    <>
      {
        isLogin ? (
          <div className="container">
            <div className="left">
               <img src={logo} alt="logo" style={{filter:"drop-shadow(1px 2px 6px white)"}}/>
            </div>
            <div className="right">
              <h2>
                Login To Explore <br /> LinkUp
              </h2>
              <div className="form">
                <form onSubmit={handleSubmitLogin}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input

                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <input type="submit" value="Login" />
                  <p>
                    Don't have an account?{" "}
                    <span onClick={() => setIsLogin(false)}>Register</span>
                  </p>
                </form>

              </div>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="left">
              <img src={logo} alt="logo" style={{filter:"drop-shadow(1px 2px 6px white)"}} />
            </div>
            <div className="right">
              <h2>
                Register To Explore <br /> LinkUp
              </h2>
              <div className="form">
                <form onSubmit={handleSubmitReg}>
                  <input

                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <input

                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <input type="submit" value="Register" />
                  <p>
                    Already have an account?{" "}
                    <span onClick={() => setIsLogin(true)}>Login</span>
                  </p>
                </form>

              </div>
            </div>
          </div>
        )
      }
    </>
  );
}

export default User;