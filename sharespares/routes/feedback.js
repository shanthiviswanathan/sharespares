module.exports = app => {
    const ratings = require('../controllers/feedback.controlller');
  
    app.post("/rating", ratings.create);
    app.get("/feedbacks", ratings.getRatings);
  
   
  };