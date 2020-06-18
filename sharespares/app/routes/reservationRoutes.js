//initialize
  const express = require('express');
  const router = express.Router();
  
  const reservations = require('../controllers/reservation.controller.js');

  router.post("/", reservations.create);
  
  // // Retrieve reservations with itemId
  router.get("/:itemId", reservations.findAllByItemId);
 
  module.exports = router;  