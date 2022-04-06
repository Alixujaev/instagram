const { Router } = require("express");
const router = Router();
const mongoose = require("mongoose");
const login = require("../middleware/login");
const User = mongoose.model("User");
const Post = mongoose.model("Post");

router.get("/alluser", login, (req, res) => {
  User.find()
    .then((user) => {
      res.json({ user });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/profile/:id", login, (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id, name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          } else {
            res.json({ user, posts });
          }
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});

router.put("/follow", login, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

router.put("/unfollow", login, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});

// router.put("/updatepic", login, (req, res) => {
//   User.findByIdAndUpdate(
//     req.user._id,
//     { $set: { pic: req.body.pic } },
//     { new: true },
//     (err, result) => {
//       if (err) {
//         return res.status(422).json({ error: "Picture can not posted" });
//       }
//       res.json(result);
//     }
//   );
// });

// });

router.put("/updatepic", login, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ err: "Picture can not posted" });
      }
      res.json(result);
    }
  );
});

// router.put("/editname", login, (req, res) => {
//   // const { myName } = req.body;
//   // console.log(name);
//   User.findByIdAndUpdate(
//     req.user._id,
//     { $set: { name: req.body.myName.toLowerCase() } },
//     { new: true },
//     (err, result) => {
//       if (err) {
//         return res.status(422).json({ error: "Nameda xato" });
//       }
//       res.json(result);
//     }

//   );

router.put("/editname", login, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { name: req.body.myName.toLowerCase() } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ err: "Your Name can not be posted" });
      }
      res.json(result);
    }
  );
});

router.post("/search", (req, res) => {
  const userSearchPanel = new RegExp("^" + req.body.query);
  User.find({ name: { $regex: userSearchPanel } })
    .select("_id name email pic")
    .then((user) => res.json({ user }))
    .catch((err) => console.log(err));
});

module.exports = router;
