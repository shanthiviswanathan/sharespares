//initialize
  const express = require('express');
  const router = express.Router();

  const groups = require("../controllers/group.controller.js");

  // Create a new Group
  router.post("/", groups.create);

  // Retrieve all Groups
  router.get("/", groups.findAll);

  // Retrieve a single Group with groupId
  router.get("/:groupId", groups.findOne);
  
  // Retrieve all groups a user belongs to
  router.get("/user/:userId", groups.findGroupsByUserId);
  
  //Retrieve items of the group that are available
  router.get("/items/:groupId", groups.getItems);

  // Update a Group with groupId
  router.put("/:groupId", groups.update);
  
  router.get("/categories", groups.findCategories);

  // Delete a Group with groupId
  router.delete("/:groupId", groups.delete);

  // Create a new Group
  router.delete("/", groups.deleteAll);
  
   module.exports = router;

