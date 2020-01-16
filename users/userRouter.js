const express = require('express');
const users = require('./userDb');
const router = express.Router();

// ---------- GET Users / Posts -------------
router.get('/', (req, res) => {
  users.get()
    .then(users => res.status(200).json(users))
    .catch(err => {
      console.log(err);
      res.status(500).json( { errorMessage: "Server error. " });
    });
});

router.get('/:id', validateUserId, (req, res) => {
  users.getById(req.params.id)
    .then(user => res.status(200).json(user))
    .catch(err => console.log(err));
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  users.getById(req.params.id)
    .then(users => res.status(200).json(users))
    .catch(err => console.log(err));
});

// ---------- POST Users ------------
router.post('/', validateUser, (req, res) => {
  const userinfo = req.body;
  users.insert(userinfo)
    .then(() => res.status(200).json(userinfo))
    .catch(err => console.log(err));
});

router.post('/:id/posts', validateUserId, (req, res) => {
  // do your magic!

});

// -------- PUT/DELETE Users -----------
router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
});


// **** Custom Middleware ****

function validateUserId(req, res, next) {
  // do your magic!
  const id = req.params.id;
  users.getById(id)
    .then(user => {
      if(user) {
        req.user = user;
        next();  
      }
      
    })
    .catch(err => console.log(err));
  console.log("We want the error 400 to go here, I think.");
  res.status(400).json({ message: "invalid user id" });
}

function validateUser(req, res, next) {
  console.log("User Body:", req.body); // TODO: Remove
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
