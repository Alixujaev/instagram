import React, { useState, useEffect, useContext } from "react";
import cancel from "../assets/cancel.png";
import { UserContext } from "../../App";
import Loader from "./Loader";
import { MemberPosts } from "./MemberPosts";
import { SubscribeUserPost } from "./SubscribeUserPost";
import { Link } from "react-router-dom";
import heart1 from "../assets/heart1.png";
import commentw from "../assets/commentw.png";

const Profile = ({profile}) => {

  const { state, dispatch } = useContext(UserContext);
  const [showFollow, setShowFollow] = useState(false);
  const [showMember, setShowMember] = useState(false);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [image, setImage] = useState("");
  const [myName, setMyName] = useState("")
  const [info, setInfo] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "instagram");
      data.append("cloud_name", "dflb2mvps");
      fetch("https://api.cloudinary.com/v1_1/dflb2mvps/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Islom " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };


  const editProfile = () => {
    if (myName) {
      fetch("/editname", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Islom " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          myName,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if(data.error){
            setInfo(data.error)
            setError(true)
          }
          localStorage.setItem(
            "user",
            JSON.stringify({ ...state, name: data.name.toLowerCase() })
          );
          dispatch({ type: "EDITPROFILE", payload: data.name.toLowerCase() });
        });
    }
    setShowAddPhoto(!showAddPhoto);
  };

  const handleBasket = () => {
    setShowFollow(!showFollow);
  };

  const handleMember = () => {
    setShowMember(!showMember);
  };

  const handleAddPhoto = () => {
    setShowAddPhoto(!showAddPhoto);
  };
  
  
  return profile && state ? (
    <div className="profile container">
      <div className="profile_main">
          <img
            className="profile_ava"
            src={state ? state.pic : "loading"}
            alt="profile"
          />
        <div className="profile_info">
          <div className="profile_name">
            <h3>{state ? state.name : "loading.."}</h3>{" "}
            <button onClick={handleAddPhoto}>Редактировать профиль</button>
          </div>
          <div className="profile_follow">
            <p>
              <b>{profile.length ? profile.length : 0}</b> публикаций
            </p>
            <p className="profile_member" onClick={handleMember}>
              <b>{state.followers ? state.followers.length : 0}</b> подписчиков
            </p>
            <p className="profile_member" onClick={handleBasket}>
              <b>{state.following ? state.following.length : 0}</b> подписок
            </p>
          </div>
          <h5>
            <b className="profile_email">{state ? state.email : "loading.."}</b>
          </h5>
        </div>
      </div>
      <div className="profile_gallary">
        <h5>ПУБЛИКАЦИИ</h5>
        <div className="profile_photos">
         {profile.length
            ? profile.map((item) => (
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
      {showMember ? <MemberPosts handleMember={handleMember} /> : ""}
      {showFollow ? <SubscribeUserPost handleBasket={handleBasket} /> : ""}
      {showAddPhoto ? (
        <div className="basket">
          <div className="collection basket_list">
            <div className="collection-item-active">Выберите изображение</div>
            <div className="config_content create_form">
              <p>Имя пользователя</p>
              <input
                className="config_input"
                type="text"
                placeholder="Имя пользователя"
                onChange={(e) => setMyName(e.target.value)}
              />
            </div>
            <div className="config_content create_form">
              <p>Фото профиля</p>
              <input
              type="file"
              onChange={(e) => updatePhoto(e.target.files[0])}
            />
            </div>
            {error ? <span className="error_span">{info}</span> : ""}
            <div className="collection-item">
              <button className="add_photo_btn" onClick={editProfile}>
                Отправить
              </button>
            </div>
            <img src={cancel} class="close_icon" onClick={handleAddPhoto} />
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  ) : (
    <Loader />
  );
};

export default Profile;
