import React from 'react'
import cancel from "../assets/cancel.png";
import {useEffect, useState, useContext} from 'react'
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';

export const SubscribeUserPost = ({handleBasket}) => {
  const [followedUser, setFollowedUser] = useState([])
  const { state, dispatch } = useContext(UserContext);

  
  useEffect(() => {
    fetch("/alluser", {
      headers: {
        Authorization: "Islom " + localStorage.getItem("jwt"),
      }
    }).then(res => res.json())
    .then(data => {
      console.log(data);
        if(state && state.following.length){
          return (
            state.following.map(x => {
              return setFollowedUser((prev) => [...prev, data.user.filter(user => user._id === x)])
            })
          )
        }else{
          console.log('xaxaxaxaax');
        }
      })
    }, [])
    


  return (
  <div className='basket'>
      <div className='collection basket_list'>
        <div className='collection-item-active'>
          Ваши подписки
        </div>
         {!followedUser.length ? (<p className='collection-item account_medium'>В настоящее время пусто</p>) : followedUser.map(i => (
            i.length ? i.map(s => (
              <div className="my_profile search_item subs_item">
              <div className='my__profile_first'>
              <img
              className="my_profile_img"
              src={s.pic}
            />
            <div className="my_profile_desc others_desc">
              <Link to={`/profile/${s._id}`}>
              <h5>
                <b>{s.name}</b>
              </h5>
              </Link>
              <p>{s.email}</p>
            </div>
              </div>
            <Link to={`/profile/${s._id}`} className='my_profile_unfollow'>Посмотреть аккаунт</Link>
          </div>
            )) : ''
         ))}
         <div className='collection-item'>
        </div>
        <img src={cancel} class='close_icon' onClick={handleBasket}/>
      </div>
    </div>
  )
}
