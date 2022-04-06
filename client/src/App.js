import "./App.css";
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import Home from "./components/screens/Home";
import SingIn from "./components/screens/SingIn";
import SignUp from "./components/screens/SignUp";
import Profile from "./components/screens/Profile";
import { CreatePost } from "./components/screens/CreatePost";
import { createContext, useReducer, useEffect, useContext, useState } from "react";
import { reducer, initialState } from "./reducer/userReducer";
import UserProfile from "./components/screens/UserProfile";
import AllPosts from "./components/screens/AllPosts";
import { AllPostCard } from "./components/screens/AllPostCard";
import Footer from "./components/Footer";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [post, setPost] = useState([])
  const [profile, setProfile] = useState([]);


   useEffect(() => {
    if(localStorage.getItem("user") !== null){
      fetch("/allpost", {
        headers: {
          Authorization: "Islom " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          setData(result.posts);
        });
    }
  });
  
  useEffect(() => {
    if(localStorage.getItem("user") !== null){
      fetch("/getsubspost", {
        headers: {
          authorization: "Islom " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          setPost(result.posts);
        });
    }
  });

  useEffect(() => {
    if(localStorage.getItem("user") !== null) {
      fetch("/mypost", {
        headers: {
          authorization: "Islom " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((result) => {
          setProfile(result.myPost);
        });
    }
  });

  const likes = (id) => {
    fetch("http://localhost:5000/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Islom " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        const newPost = post.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setPost(newPost);
      })
      .catch((err) => console.log(err));
  };
  const unlikes = (id) => {
    fetch("http://localhost:5000/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Islom " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
        const newPost = post.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setPost(newPost);
      })
      .catch((err) => console.log(err));
  };
  const commentPost = (text, postId) => {
    if (text.length > 0) {
      fetch("http://localhost:5000/comments", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Islom " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          postId,
          text,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          const newData = data.map((item) => {
            if (item._id === result._id) {
              return result;
            } else {
              return item;
            }
          });
          setData(newData);
          const newPost = post.map((item) => {
            if (item._id === result._id) {
              return result;
            } else {
              return item;
            }
          });
          setPost(newPost);
        })
        .catch((err) => console.log(err));
    }
  };
  const deletePost = (postId) => {
    fetch(`http://localhost:5000/delete/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Islom " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((i) => i._id !== result._id);
        setData(newData);
        const newPost = post.filter((i) => i._id !== result._id);
        setPost(newPost);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/signin");
    }
  }, []);
  
  return (
    <Switch>
      <Route exact path="/">
        <Home post={[...post, ...profile]} likes={likes} unlikes={unlikes} commentPost={commentPost} deletePost={deletePost}/>
      </Route>
      <Route path="/signin" component={SingIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/profile" exact>
        <Profile profile={profile}/>
      </Route>
      <Route path="/profile/:userId" exact component={UserProfile} />
      <Route path="/createpost" component={CreatePost} />
      <Route path="/allposts">
        <AllPosts data={data}/>
      </Route>
      <Route path="/allpostcard/:id">
        <AllPostCard data={data} likes={likes} unlikes={unlikes} commentPost={commentPost} deletePost={deletePost}/>
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Router>
        <div className="navbar">
        <Navbar />
        </div>
        <Routing />
        <div className="footer">
          <Footer/>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
