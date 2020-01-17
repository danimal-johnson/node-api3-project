const express = require('express');
const users = require('./userDb');
const posts = require('../posts/postDb');
const router = express.Router();

// ---------- GET Users / Posts -------------

// Get all the users
router.get('/', (req, res) => {
  users.get()
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.log(err);
      res.status(500).json( { errorMessage: "Server error. " });
    });
});

// Get a specific user
router.get('/:id', validateUserId, (req, res) => {
  users.getById(req.params.id)
    .then(user => res.status(200).json(user))
    .catch(err => console.log(err));
});

// Get all the posts for a user
router.get('/:id/posts', validateUserId, (req, res) => {
  console.log("REQ.USER =", req.user);
  users.getUserPosts(req.params.id)
    .then(posts => res.status(200).json(posts))
    .catch(err => {
      console.log(err);
      res.status(500).json( { errorMessage: `Server error: ${err}` });
    });
});

// ---------- POST Users/Posts ------------

// Create a new user. Make sure the user info is valid first.
router.post('/', validateUser, (req, res) => {
  const userinfo = req.body;
  users.insert(userinfo)
    .then(() => res.status(200).json(userinfo))
    .catch(err => console.log(err));
});

// Create a new post. Ensure the user exists and the post is valid.
router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const postinfo = req.body;
  posts.insert(postinfo)
    .then(() => res.status(201))
    .catch(err => console.log(err));
});

// -------- PUT/DELETE Users -----------

// Delete: Make sure a user exists before deleting.
router.delete('/:id', validateUserId, (req, res) => {
  users.remove(req.params.id)
    .then(() => res.status(200))
    .catch(err => console.log(err));
});

// Modify: Check user id to replace. Ensure replacement info is valid.
router.put('/:id', validateUserId, validateUser, (req, res) => {
  const userinfo = req.body;
  users.update(req.params.id, userinfo)
    .then(() => res.status(200).json(userinfo))
    .catch(err => console.log(err));
});


// **** Custom Middleware ****

function validateUserId(req, res, next) {
  users.getById(req.params.id)
    .then(user => {
      if(user) {
        req.user = user;
        next();
      }
      else {
        res.status(400).json({ message: "invalid user id" });
      }
    })
    .catch(err => console.log(err));
}

function validateUser(req, res, next) {
  console.log("User Body:", req.body);
  if (!req.body || Object.keys(req.body).length === 0) {
      //  req.body == {} ||
      //  req.body == [] ||
      //  req.body == null ||
      //  req.body == undefined ||
      //  req.body.length == 0
      //  ) {
    res.status(400).json({ message: "missing user data" });
  }
  else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  }
  else {
    next();
  }
}

function validatePost(req, res, next) {

  console.log("Post Body:", req.body);
  if (!req.body || Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "missing post data" });
  }
  else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  }
  else {
    next();
  }
}

// Example from class
function check(prop) {
  return function(req, res, next) {
    if (req.body[prop]) {
      next();
    }
    else {
      res.status(400).json({ errorMessage: `required ${prop}`});
    }
  };
}

module.exports = router;
