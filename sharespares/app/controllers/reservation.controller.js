const Reservations = require("../models/reservations.model");

// Create and Save a new Reservation
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
  
    // Create a Reservations
    const reservations = new Reservations({
      item_id :req.body.item_id,
      member_id :req.body.member_id,
      reservation_status :req.body.reservation_status,
      reservation_date :req.body.reservation_date,
      start_date :req.body.start_date,
      end_date :req.body.end_date,
      item_pickup_date :req.body.item_pickup_date,
      item_return_date :req.body.item_return_date,
      cancel_date :req.body.cancel_date,
      item_cost :req.body.item_cost,
      created_by :req.body.created_by ,
      created_date :req.body.created_date,
      modified_by :req.body.modified_by,
      modified_date :req.body.modified_date,

    });
  
    // Save Reservations in the database
    Reservations.create(reservations, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the reservations."
        });
      else res.send(data);
    });
  };


// Find  Reservations with a itemId
exports.findAllByItemId = (req, res) => {
  Reservations.findByItemId(req.params.itemId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.send([]);
        } else {
          res.status(500).send({
            message: "Error retrieving reservation with id " + req.params.itemId
          });
        }
      } else res.send(data);
    });
  };
