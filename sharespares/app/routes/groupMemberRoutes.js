//initialize
  const express = require('express');
  const router = express.Router();

  const groupmembers = require("../controllers/groupMember.controller.js");

  // Retrieve a single Group members with groupId
  router.get("/groupmembers/:groupId", groupmembers.findMembers);
  
  // Add a member to a group
  router.post("/groupmembers/:groupId/bulk", groupmembers.AddMembers);
  
  // Retrieve a single Group members with groupId
  router.delete("/groupmembers/:groupId/bulk", groupmembers.deleteMembers);

  module.exports = router;

