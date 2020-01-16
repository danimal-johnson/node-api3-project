const express = require('express');
const users = require('./userDb');
const router = express.Router();

// ---------- GET -------------
router.get('/', (req, res) => {
  users.get()
    .then(users => res.status(200).json(users))
    .catch(err => console.log(err));
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  users.getById(id)
    .then(user => res.status(200).json(user))
    .catch(err => console.log(err));
});

router.get('/:id/posts', (req, res) => {
  // do your magic!
});

// ---------- POST ------------
router.post('/', validateUser, (req, res) => {
  const userinfo = req.body;
  users.insert(userinfo)
    .then(() => res.status(200).json(userinfo))
    .catch(err => console.log(err));
});

router.post('/:id/posts', (req, res) => {
  // do your magic!
});

// -------- PUT/DELETE -----------
router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
});


// **** Custom Middleware ****

function validateUserId(req, res, next) {
  // do your magic!
  const id = req.params.id;
  users.getById(id)
    .then(user => {
      req.params.id = id;
      next();
    })
    .catch(err => console.log(err));
  console.log("We want the error 400 to go here, I think.");
  res.status(400).json({ message: "invalid user id" });
}

function validateUser(req, res, next) {
  // do your magic!
  console.log("REQUEST BODY:", req.body);
  if (!req.body ||
       req.body == {} ||
       req.body == [] ||
       req.body == null ||
       req.body == undefined ||
       req.body.length == 0
       ) {
    console.log ("Hey buddy!! There's no body!");
    res.status(400).json({ message: "missing user data" });
  }
  else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  }
  else {
    console.log("Doing the next thing.");
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
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
