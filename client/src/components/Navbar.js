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

const Navbar = () => {
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
        <nav className="white navbar_nav">
          <div className="nav-wrapper nav_bg ">
            <Link to="/" className="brand-logo">
              <img src={logo_insta} />
            </Link>

            <div className="navbar_search navbar_search-nav">
              <input
                type="text"
                placeholder="Поиск"
                value={search}
                onChange={(e) => searchUser(e.target.value)}
              />
              {search.length ? (
                <div className="search_list">
                  <p>Поиск лист</p>
                  {userFinded.length > 0 ? (
                    userFinded.map(item => (
                      <Link onClick={() => setSearch("")} to={item._id !== state._id ? `/profile/${item._id}` : '/profile'} className="my_profile others_profile search_item">
                      <img
                        className="my_profile_img"
                        src={item.pic}
                        alt={item.name}
                      />
                      <div className="my_profile_desc others_desc">
                        <h4>
                          <b>{item.name}</b>
                          <p>{item.email}</p>
                        </h4>
                      </div>
                    </Link>
                    ))
                  ) : (
                    <p className="not_found">Nothing found(</p>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
            <ul id="nav-mobile" className="nav_mobile_nav right hide-on-med-and-down">
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
          </div>
        </nav>,
      ];
    } else {
      return [""];
    }
  };
  return renderNav();
};

export default Navbar;
