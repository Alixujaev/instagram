import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import auth from "../assets/auth.png";
import { useContext } from "react";
import { UserContext } from "../../App";

const SingIn = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [logName, setlogName] = useState("");
  const [logPassword, setLogPassword] = useState("");
  const [info, setInfo] = useState("");
  const [error, setError] = useState(false);

  const logData = () => {
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: logName,
        password: logPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setInfo(data.error);
          setError(true);
        } else  {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          history.push("/");
        }
      });

  };

  return (
    <div className="sign_in container">
      <img src={auth} alt="auth" />
      <div className="sign_in_inp">
        <h2>Instagram</h2>
        <form>
          <input
            type="email"
            placeholder="Имя пользователя"
            value={logName}
            onChange={(e) => setlogName(e.target.value.toLowerCase())}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={logPassword}
            onChange={(e) => setLogPassword(e.target.value.toLowerCase())}
          />
          <button onClick={() => logData()} type="button">
            Войти
          </button>
          {error ? <span className="error_span">{info}</span> : ""}
        </form>
        <p>У вас ещё нет аккаунта?</p>
        <Link to={"/signup"}>Зарегистрироваться</Link>
      </div>
    </div>
  );
};

export default SingIn;
