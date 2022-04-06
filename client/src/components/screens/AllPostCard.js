import React, {useEffect, useState} from 'react'
import comment from "../assets/comment.png";
import send from "../assets/send.png";
import smile from "../assets/smile.png";
import heart from "../assets/heart.png";
import heart1 from "../assets/heart1.png";
import { useContext } from "react";
import { UserContext } from "../../App";
import { Link, useParams } from 'react-router-dom';


export const AllPostCard = ({data, likes, unlikes, commentPost, deletePost}) => {
  const [postCard, setPostCard] = useState([])
  const [comments, setComments] = useState(false);
  const { state, dispatch } = useContext(UserContext);
  const {id} = useParams();

  useEffect(() => {
    if(data.length){
      return setPostCard(data.filter(user => user._id === id))
    }
  }, [data])


  return (
    <div className='all_post_card container'>
      {      postCard && postCard.map(item => {
        return (
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
                <p>{item.postedBy.name}</p>
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
        )
      })
}
    </div>

    
  )
}
