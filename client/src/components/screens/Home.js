import React from "react";
import heart from "../assets/heart.png";
import heart1 from "../assets/heart1.png";
import comment from "../assets/comment.png";
import send from "../assets/send.png";
import smile from "../assets/smile.png";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import SmallLoader from "./SmallLoader";

const Home = ({post, likes, unlikes, commentPost, deletePost}) => {
  const [comments, setComments] = useState(false);
  const [users, setUsers] = useState([])
  const [followedUser, setFollowedUser] = useState([])
  const { state, dispatch } = useContext(UserContext);
  
  useEffect(() => {
    fetch("/alluser", {
      headers: {
        Authorization: "Islom " + localStorage.getItem("jwt"),
      }
    }).then(res => res.json())
      .then(data => {
        setUsers(data.user.reverse().slice(0, 3))
      })
      
  }, [])

  useEffect(() => {
    fetch("/alluser", {
      headers: {
        Authorization: "Islom " + localStorage.getItem("jwt"),
      }
    }).then(res => res.json())
    .then(data => {
        if(state){
          return (
            state.following.map(x => (
               setFollowedUser((prev) => [...prev, data.user.filter(user => user._id === x)])
            ))
          )
        }else{
          console.log('xaxaxaxaax');
        }
      })
    }, [])


  return (
    <>
    <div className="home container">

      {post.length ? (
          <div className="home_cards">
            <div className="user_stories">
                <Link to={`/profile`}>
                  <img className="stories_pic" src={state ? state.pic : ''}/>
                </Link>
                {followedUser.length ? followedUser.map(i => (
                  i.length ? i.map(item => (
                    <Link to={`/profile/${item._id}`}>
                    <img className="stories_pic" src={item.pic}/>
                  </Link>
                  )) : ''
                )) : <SmallLoader/>}
            </div>
            {post.map((item, index) => (
              <div className="home_card">
              <div className="card_start">
                <div className="card_start_1">
                  <img src={item.postedBy ? item.postedBy.pic : ''} alt="card" />
                  {item.postedBy ? (
                  <Link
                    to={
                      item.postedBy._id !== state._id
                        ? `/profile/${item.postedBy._id}`
                        : "/profile"
                    }
                  >
                    <p>{state ? item.postedBy._id === state._id ? state.name : item.postedBy.name : ''}</p>
                  </Link> 
                  ) : ''}
                </div>
                <div className="card_start_2">
                  <b>...</b>
                </div>
              </div>
              <img className="card_img" src={item.photo} alt="card" />
              <div className="card_desc">
                <div className="card_icons">
                  <div className="card_icons_1">
                    {!item.likes.includes(state._id) ? (
                      <img
                        src={heart}
                        alt="icon"
                        onClick={() => likes(item._id)}
                      />
                    ) : (
                      <img
                        src={heart1}
                        className="like_active"
                        alt="icon"
                        onClick={() => unlikes(item._id)}
                      />
                    )}
                    <img
                      src={comment}
                      alt="icon"
                      onClick={() => setComments(!comments)}
                    />
                    <img src={send} alt="icon" />
                  </div>
                  {item.postedBy ? (
                    item.postedBy._id.includes(state._id) ? (
                      <p
                        onClick={() => deletePost(item._id)}
                        className="delete_icon"
                      >
                        Удалить
                      </p>
                    ) : (
                      ""
                    )
                  ):''}
                </div>
                <b className="card_like">
                  <span>{item.likes.length} отметок "Нравится"</span>
                </b>
                <div className="card_title">
                  <p>
                    {item.postedBy ? <b>{item.postedBy.name}</b> : ''} {item.title}{" "}
                    <p className="card_body">{item.body}</p>
                  </p>
                  {comments ? (
                    <div className="card_comments">
                      {item.comments
                        .map((c) => (
                          <Link to={state ? state._id === c.postedBy._id ? `/profile` :`/profile/${c.postedBy._id}` : ''} className="comment_user">
                          <img className="comment_author_img" src={c.postedBy.pic}/>
                          <p>
                            <b className="comment_author_name">{c.postedBy.name}</b>
                            <p className="card_body">{c.text}</p>
                          </p>
                          </Link>
                        ))
                        .reverse()}
                    </div>
                  ) : null}
                </div>
                <b className="card_like">
                  <span>{item.comments.length} комментaрии</span>
                </b>
                <div className="card_inputs">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      commentPost(e.target[0].value, item._id);
                      e.target[0].value = "";
                    }}
                  >
                    <img src={smile} alt="smile" />
                    <input
                      type="text"
                      placeholder="Добавьте комментарий..."
                    />
                    <button type="submit">Опубликовать</button>
                  </form>
                </div>
              </div>
            </div>  
              ))
              .reverse()}
          </div>
          ) : (
            <p className="pusto">В настоящее время пусто</p>
          )}
          <div className="home_accounts">
            <div className="my_profile">
              <img
                className="my_profile_img"
                src={state ? state.pic : ""}
              />
              <div className="my_profile_desc">
                <h5>
                  <Link to={"/profile"}>
                    <b>{state ? state.name : ""}</b>
                  </Link>
                </h5>
                <p>{state ? state.email : ''}</p>
              </div>
            </div>
            <p className="account_medium">Рекомендации для вас</p>
            <div className="others">
              {users.length > 0 ? (
                users.map(item => (
                  item._id === state._id ? "" : (
                    <div className="my_profile others_profile">
                    <div className="other_profile_content">
                      <img
                    className="my_profile_img"
                    src={item.pic}
                  />
                    <div className="my_profile_desc others_desc">
                      <h5>
                        <b>{item.name}</b>
                      </h5>
                      <p>{item.email}</p>
                    </div>
                      </div>
                  <Link to={`/profile/${item._id}`}>Посмотреть</Link>
                 </div>
                  )
                ))
              ): 'Ничего не найдено'}
            </div>
            <span>
              Информация Помощь Пресса API Вакансии Конфиденциальность Условия
              Места Популярные аккаунты Хэштеги Язык Русский
            </span>
          </div>
        </div>
    </>
  );
};

export default Home;
