import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../App";

const Search = () => {
  const [search, setSearch] = useState("");
  const [userFinded, setUserFinded] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  
  const searchUser = (query) => {
    setSearch(query.toLowerCase());
    fetch("/search", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
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

  return (
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
  )
}

export default Search