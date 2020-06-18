const Item = require("../models/item.model.js");
const moment = require('moment');

// Create and Save a new item
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log('In create Item. ', req.body)
  // Create an item
  const item = new Item({
    title: req.body.title,
    subtitle: req.body.subtitle,    
    description: req.body.description,
    status: 'AVAILABLE',
    owner_id: req.body.ownerId,
    owner_type: req.body.ownerType,
    category:req.body.category,
    location: req.body.location,
    address1: null,
    address2: null,
    city: null,
    state: null,
    zipcode: null,   
    featured_desc1:req.body.featuredDesc1,
    featured_desc2:req.body.featuredDesc2,
    featured_desc3:req.body.featuredDesc3, 
    price: req.body.price,    
    rental_cost: req.body.rentalCost,
    highlights: req.body.highlights,  
    visibility: req.body.visibility,
    thumbnail_image: req.body.thumbnailImage,
    created_by: req.body.ownerId,
    created_date: moment().format('YYYY-MM-DD HH:mm:ss'),
    modified_by: null,
    modified_date: null,  
  });

  // Save item in the database
  Item.create(item, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Item."
      });
    else {
      res.send(data);
    }
  });
};

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

// Find a single Item with an ItemId
exports.findOne = (req, res) => {
  Item.findById(req.params.itemId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Item with id ${req.params.itemId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving item with id " + req.params.itemId
        });
      }
    } else res.send(data);
  });  
};

//Find items of an user - owner or borrowed
exports.getItemsByUserId = (req,res) => {
   Item.getItemsByUserId(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No item found for user with id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving items for user with id " + req.params.userId
        });
      }
    } else res.send(data);
  });  
}

//Process an item
exports.process = (req,res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  
  Item.processById(
    req.body.txnType,
    req.body.itemId,
    req.body.memberId,
    (err, data) => {
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
  

// Update an item identified by the itemId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Item.updateById(
    req.params.itemId,
    new Item(req.body),
    (err, data) => {
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

// Delete an item with the specified itemId in the request
exports.delete = (req, res) => {
  Item.remove(req.params.itemId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Item with id ${req.params.itemId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Item with id " + req.params.itemId
        });
      }
    } else res.send({ message: `Item was deleted successfully!` });
  });  
};

// Delete all items from the database.
exports.deleteAll = (req, res) => {
  Item.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all groups."
      });
    else res.send({ message: `All items were deleted successfully!` });
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