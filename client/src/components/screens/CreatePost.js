import React from "react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const history = useHistory();
  const [error, setError] = useState(false);
  const [info, setInfo] = useState("");

  const postDetails = () => {
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
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (url) {
      fetch("http://localhost:5000/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Islom " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setInfo(data.error);
            setError(true);
          } else {
            history.push("/");
          }
        });
    }
  }, [url]);

  return (
    <div className="create_post sign_in_inp container">
        <h2>Instagram</h2>
      <form className="create_form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Придумайте заглавие..."
        />
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Придумайте подпись..."
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          placeholder="Пароль"
        />
        <button type="button" onClick={() => postDetails()}>
          Создать пост
        </button>
        {error ? <span className="error_span">{info}</span> : ""}
      </form>
    </div>
  );
};
