module.exports = app => {
    const reservations = require('../controllers/reservation.controller');
  
    app.post("/reservations", reservations.create);
    app.post("/return-item", reservations.returnItem);
    // // Retrieve reservations with itemId
    app.get("/reservations/:itemId", reservations.findAllByItemId);
  
   
  };