import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link, useParams } from "react-router-dom";
import Loader from "./Loader";
import heart1 from "../assets/heart1.png";
import commentw from "../assets/commentw.png";
const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userId } = useParams();

  useEffect(() => {
    fetch(`http://localhost:5000/profile/${userId}`, {
      headers: {
        Authorization: "Islom " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setProfile(result);
      });
  }, []);

  const followUser = () => {
    fetch("http://localhost:5000/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Islom " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          const newFollower = [...prevState.user.followers, data._id];
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  
  const unfollowUser = () => {
    fetch("http://localhost:5000/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Islom " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (i) => i !== data._id
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {profile ? (
        <div className="profile container">
          <div className="profile_main">
            <img className="profile_ava"
              src={profile.user.pic}
              alt="profile"
            />
            <div className="profile_info">
              <div className="profile_name">
                <h3>{profile.user.name}</h3>{" "}
                {state && state.following.includes(profile.user._id) ? (
                  <button onClick={() => unfollowUser()}>
                    Oтменить Подписаться
                  </button>
                ) : (
                  <button
                    className="follow_button"
                    onClick={() => followUser()}
                  >
                    Подписаться
                  </button>
                )}
              </div>
              <div className="profile_follow">
                <p>
                  <b>{profile.posts.length}</b> публикаций
                </p>
                <p>
                  <b>{profile.user.followers.length}</b> подписчиков
                </p>
                <p>
                  <b>{profile.user.following.length}</b> подписок
                </p>
              </div>
              <h5>
                <b className="profile_email">{profile.user.email}</b>
              </h5>
            </div>
          </div>
          <div className="profile_gallary">
            <h5>ПУБЛИКАЦИИ</h5>
            <div className="profile_photos">
              {profile && profile.posts.length
            ? profile.posts.map((item) => (
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
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
};

export default UserProfile;
