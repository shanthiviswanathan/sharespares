module.exports = app => {
    const items = require('../controllers/items.controller');
    // Create a new Customer
    app.post("/items", items.create);
    // Retrieve all items
    app.get("/items", items.findAll);
    app.get("/my-items", items.findOwned);
    app.get("/items/:itemId", items.findOne);
    app.get("/search", items.search);
  
    app.delete("/delete-item", items.deleteItem);
  // Update a Item with itemId
     app.put("/items/:itemId", items.updateById);

  };