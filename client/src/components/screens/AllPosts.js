import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../App";
import heart1 from "../assets/heart1.png";
import commentw from "../assets/commentw.png";
import Search from './Search';

const AllPosts = ({data}) => {

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
    <div className='container'>
    <div className="navbar_search navbar_search-nav all_post_search">
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
        <div className="profile_photos">
          {data.length
            ? data.map((item) => (
              <Link to={`/allpostcard/${item._id}`} className='all_posts'>
                <img src={item.photo} alt="img" />
                <div className='all_posts_info'>
                  <div className='all_posts_like'>
                    <img src={heart1} alt="img" />
                    <p>{item.likes.length}</p>
                  </div>
                  <div className='all_posts_comment'>
                    <img src={commentw} alt="img" />
                    <p>{item.comments.length}</p>
                  </div>
                </div>
              </Link>
            )).reverse()
            : "Записей не найдено"}
        </div>
    </div>
  )
}

export default AllPosts