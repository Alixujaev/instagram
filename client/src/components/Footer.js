import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import logo_insta from "./assets/logo_insta.png";
import home from "./assets/home.png";
import user from "./assets/user.png";
import add from "./assets/add.png";
import exit from "./assets/exit.png";
import compass from "./assets/compass.png";
import { useContext } from "react";
import { UserContext } from "../App";

const Footer = () => {
  const [search, setSearch] = useState("");
  const [userFinded, setUserFinded] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();

  const searchUser = (query) => {
    setSearch(query.toLowerCase());
    fetch("/search", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        // Authorization: "Islom " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUserFinded(result.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const renderNav = () => {
    if (state) {
      return [
        <nav className="white footer_nav">
            <ul className="footer_ul">
              <li>
                <Link to={"/"}>
                  <img className="icons" src={home} />
                </Link>
              </li>
              <li>
                <Link to={"/createpost"}>
                  <img className="icons" src={add} />
                </Link>
              </li>
              <li>
                <Link to={"/allposts"}>
                  <img className="icons" src={compass} />
                </Link>
              </li>
              <li>
                <Link to={"/profile"}>
                  <img className="icons" src={user} />
                </Link>
              </li>
              <li>
                <Link
                  onClick={() => {
                    localStorage.clear();
                    dispatch({ type: "CLEAR" });
                    history.push("/signin");
                  }}
                >
                  <img className="icons" src={exit} />
                </Link>
              </li>
            </ul>
        </nav>,
      ];
    } else {
      return [""];
    }
  };
  return renderNav();
};

export default Footer;
