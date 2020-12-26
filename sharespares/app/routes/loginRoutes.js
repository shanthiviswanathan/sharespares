//initialize
  const express = require('express');
  const router = express.Router();

  const members = require("../controllers/member.controller.js");

  // Create a new Member
  router.post("/register", members.register);
  
  //User Login
  router.post("/login", members.login);
  
  module.exports = router;