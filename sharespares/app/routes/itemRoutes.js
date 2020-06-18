//initialize
  const express = require('express');
  const router = express.Router();

  const items = require("../controllers/item.controller.js");

  // Create a new item
  router.post("/", items.create);
    
  //Search (this should come before :itemId)
  router.get("/search", items.search);
    
  //Process an item
  router.post("/process", items.process);

  // Retrieve all items
  router.get("/", items.findAll);

  // Retrieve a single item with itemId
  router.get("/:itemId", items.findOne);
  
  // Retrieve all items of an user
  router.get("/user/:userId", items.getItemsByUserId);

  // Update an item with itemId
  router.put("/:itemId", items.update);

  // Delete an item with itemId
  router.delete("/:itemId", items.delete);

  module.exports = router;

