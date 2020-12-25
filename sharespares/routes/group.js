module.exports = app => {
    const group = require('../controllers/group.controller');
   
// Get all groups
    app.get("/groups", group.findGroups);
    app.get("/group/:id", group.getGroupById);
    app.get("/categories", group.findCategories);

  };