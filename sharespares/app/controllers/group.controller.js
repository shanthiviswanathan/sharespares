const Group = require("../models/group.model.js");
const moment = require('moment');

// Create and Save a new Group
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log('rsvp start ', req.body.rsvpStarttime);
  // Create a Group
  const group = new Group({
    name: req.body.name,
    description: req.body.description,
    status: 'A',
    admin: req.body.admin,
    location: req.body.location,
    start_datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
    end_datetime: req.body.endDatetime,
    member_limit: req.body.memberLimit,
    approval_process: req.body.approvalProcess,
    ask_signup_question: req.body.askSignupQuestion,
    rsvp_starttime: req.body.rsvpStarttime,
    rsvp_endtime: req.body.rsvpEndtime,  
  });

  // Save Group in the database
  Group.create(group, 'Admin', (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Group."
      });
    else {
      res.send(data);
    }
  });
};

// Retrieve all Groups from the database.
exports.findAll = (req, res) => {
  Group.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving groups."
      });
    else res.send(data);
  });  
};

// Find a single Group with a groupId
exports.findOne = (req, res) => {
  Group.findById(req.params.groupId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Group with id ${req.params.groupId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Group with id " + req.params.groupId
        });
      }
    } else res.send(data);
  });  
};

//Find all groups of an user
exports.findGroupsByUserId = (req,res) => {
   Group.findByUserId(req.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No group found for user with id ${req.params.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving groups for user with id " + req.params.userId
        });
      }
    } else res.send(data);
  });  
}

//Find all items of a group
exports.getItems = (req,res) => {
   Group.getItems(req.params.groupId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `No item found for group with id ${req.params.groupId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving items for group with id " + req.params.groupId
        });
      }
    } else res.send(data);
  });  
}

// Update a Group identified by the groupId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Group.updateById(
    req.params.groupId,
    new Group(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Group with id ${req.params.groupId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Group with id " + req.params.groupId
          });
        }
      } else res.send(data);
    }
  );  
};

// Delete a Group with the specified groupId in the request
exports.delete = (req, res) => {
  Group.remove(req.params.groupId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Group with id ${req.params.groupId}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Group with id " + req.params.groupId
        });
      }
    } else res.send({ message: `Group was deleted successfully!` });
  });  
};

// Delete all Groups from the database.
exports.deleteAll = (req, res) => {
  Group.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all groups."
      });
    else res.send({ message: `All Groups were deleted successfully!` });
  });  
};