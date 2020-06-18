const GroupMember = require("../models/groupMember.model.js");

// Save a new member to a Group
exports.addMembers = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Group
  const groupMember = new GroupMember({
    group_id: req.body.group_id,
    member_id: req.body.member_id,
    status: req.body.status,
    subscribe_datetime: moment().format('Y-M-D H:m:s'),
    unsubscribe_datetime: null,
    member_type: req.body.member_type,
    added_by: req.body.added_by,
  });

  // Save GroupMember in the database
  GroupMember.create(groupMember, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Group Member."
      });
    else res.send(data);
  });
};

// Retrieve members of a Group from the database.
exports.findMembers = (req, res) => {
  GroupMember.getGroupMembers(req.params.groupId, (err, data) => {
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

// Update a Group identified by the groupId in the request
exports.deleteMembers = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  
  // Create a Group
  const groupMember = new GroupMember({
    group_id: req.params.group_id,
    member_id: req.params.member_id,
    status: 'Inactive',
    unsubscribe_datetime: moment().format('Y-M-D H:m:s'),
  });

  GroupMember.logicalDeleteMember(
    groupMember, (err, data) => {
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


