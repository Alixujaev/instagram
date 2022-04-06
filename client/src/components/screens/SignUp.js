import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import cancel from "../assets/cancel.png";


const SignUp = () => {
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [error, setError] = useState(false);
  const [info, setInfo] = useState("");
  const history = useHistory();
  const [showAddPhoto, setShowAddPhoto] = useState(false)
  const [image, setImage] = useState(undefined);
  const [url, setUrl] = useState("https://res.cloudinary.com/dflb2mvps/image/upload/v1648692302/uimage_waejdl.png");



  // const uploadImage = () => {
  //   const data = new FormData();
  //   data.append("file", image);
  //   data.append("upload_preset", "instagram");
  //   data.append("cloud_name", "dflb2mvps");

  //   fetch("https://api.cloudinary.com/v1_1/dflb2mvps/image/upload", {
  //     method: "post",
  //     body: data,
  //   })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       setUrl(data.url);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }

  const ourFields = () => {
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: regName,
        email: regEmail,
        password: regPassword,
        pic: url
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setInfo(data.error);
          setError(true);
        } else {
          history.push("/signin");
        }
      });
  }

  // const postData = () => {
  //   if(image){
  //     uploadImage()
  //   }else{
  //     ourFields()
  //   }
  // };

  useEffect(() => {
    if(url){
      ourFields()
    }
  }, [url])

  const handleAddPhoto = () => {
    setShowAddPhoto(!showAddPhoto)
  }

  return (
    <div className="sign_up sign_in_inp container">
      <h2>Instagram</h2>
      <p>Зарегистрируйтесь, чтобы смотреть фото и видео ваших друзей.</p>
      <form>
        {/* <div class="content_img_reg content_img">
          <img src={url} alt="Avatar" class="image" />
          <div class="middle" onClick={handleAddPhoto}>
            <div class="text">Фото</div>
          </div>
        </div> */}
        <input
          type="email"
          placeholder="Эл.адрес"
          value={regEmail}
          onChange={(e) => setRegEmail(e.target.value.toLowerCase( ))}
        />
        <input
          type="text"
          placeholder="Имя пользователья"
          value={regName}
          onChange={(e) => setRegName(e.target.value.toLowerCase())}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={regPassword}
          onChange={(e) => setRegPassword(e.target.value.toLowerCase())}
        />
        <button type="button" onClick={() => ourFields()}>
          Регистрация
        </button>
        {error ? <span className="error_span">{info}</span> : ""}
      </form>
      <p>Есть аккаунт?</p>
      <Link to={"/signin"}>Вход</Link>
      {showAddPhoto ? (
        <div className='basket'>
        <div className='collection basket_list'>
          <div className='collection-item-active'>
            Выберите изображение
          </div>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          <div className='collection-item'>
            <button className="add_photo_btn" onClick={handleAddPhoto}>Submit</button>
          </div>
          <img src={cancel} class='close_icon' onClick={handleAddPhoto}/>
        </div>
      </div>
      ): ''}
    </div>
  );
};

export default SignUp;

// const postData = () => {
//   // eslint-disable-next-line
//   if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(regEmail)){
//     return toast.error('Error')
//   }
//   fetch("/signup", {
//     method: 'POST',
//     headers: {
//       "Content-Type": "application/json",
//       'Accept': 'application/json'
//     },
//     body: JSON.stringify({
//       name: regName,
//       email: regEmail,
//       password: regPassword
//     })
//   })
//   .then(res => res.json())
//     .then((data) => {
//       console.log('Hello');
//       console.log(data);
//       if(data.error){
//         toast.error(data.error)
//       }else{
//         toast.success(data.msg)
//         console.log('Hello');
//         history.push("/signin")
//       }
//     })
// }
