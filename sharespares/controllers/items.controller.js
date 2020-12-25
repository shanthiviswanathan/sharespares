const Item = require("../models/items.model.js");

// Retrieve all Items from the database.
exports.findAll = (req, res) => {
    Item.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving items."
            });
        else res.send(data);
    });
};


exports.findOwned = (req, res) => {
    const  request =req.query

    Item.findOwned(request, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found .`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving owned items"
                });
            }
        } else res.send(data);
    });
};


exports.findOne = (req, res) => {
    Item.findById(req.params.itemId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Customer with id ${req.params.itemId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Customer with id " + req.params.itemId
                });
            }
        } else res.send(data);
    });
};


// Search items
exports.search = (req, res) => {
    const  {searchQuery,start,count} =req.query
    Item.search({searchQuery,start,count}, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.send([]);
            } else {
                res.status(500).send({
                    message: "Error retrieving item with id " + searchQuery
                });
            }
        } else res.send(data);
    });
};

exports.deleteItem = (req, res) => {
    const  {item_id,member_id} =req.query
    Item.deleteItem({item_id,member_id}, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(500).send({
                    message: "No item found with  id " + item_id
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving item with id " + item_id
                });
            }
        } else res.send(data);
    });
};



exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }  
      const item = new Item(req.body)
    // Save Item in the database
    Item.create(item, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Customer."
        });
      else res.send(data);
    });
  };

//   update by id
exports.updateById = (req, res) => {
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    Item.updateById(req.params.itemId,req.body,(err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Item with id ${req.params.itemId}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating Item with id " + req.params.itemId
            });
          }
        } else res.send(data);
      }
    );
  };
