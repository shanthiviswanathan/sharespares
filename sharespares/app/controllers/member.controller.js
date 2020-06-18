const Member = require("../models/member.model.js");
const moment = require('moment');

// Create and Save a new Member
exports.register = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const newMember = new Member ({
     member_id: req.body.memberId,
     email: req.body.email,
     hash: null,
     salt: null,
     display_name: req.body.displayName,
     first_name:  req.body.first_name,
     middle_name:  req.body.middle_name,
     last_name: req.body.last_name,
     title: req.body.title,
     address1: req.body.address1,
     address2: req.body.address2,
     citystate: req.body.location,
     country: req.body.country || 'USA',
     dob: req.body.dob,
     join_date: moment().format('Y-M-D H:m:s'),
     leave_date: null,
     reset_password: false,
     security_question1: req.body.securityQuestion1,
     security_answer1: req.body.securityAnswer1,
     security_question2: req.body.securityQuestion2, 
     security_answer2: req.body.securityAnswer2,
     photo: null,     
  });
  Member.setPassword(newMember, req.body.password)

  // Save Member in the database
  Member.create(newMember, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Member."
      });
    else res.send(data);
  });
};

// Find member with email
exports.login = (req, res) => {
  Member.findByEmail(req.body.email, (err, data) => {
    console.log(data);
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Member email ${req.body.email}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Member for " + req.body.email
        });
      }
    } else { 
            if (Member.validPassword(new Member(data), req.body.password)) { 
                return res.status(201).send({ 
                    message : "User Logged In", 
                }) 
            } 
            else { 
                return res.status(400).send({ 
                    message : "Wrong Password"
                }); 
            } 
        } 
  });
};  

// Update a Member identified by the memberId in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  const newMember = new Member ({
     email: req.body.email,
     display_name: req.body.display_name,
     first_name:  req.body.first_name,
     middle_name:  null,
     last_name: req.body.last_name,
     title: null,
     address1: req.body.address1,
     address2: req.body.address2,
     city: req.body.city,
     state: req.body.state,
     country: req.body.country,
     dob: req.body.dob,
     security_question1: req.body.security_question1,
     security_answer1: req.body.security_answer1,
     security_question2: req.body.security_question2, 
     security_answer2: req.body.security_answer2,     
  });

  Member.updateById(
    req.params.memberId,
    newMember,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Member with id ${req.params.memberId}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Member with id " + req.params.memberId
          });
        }
      } else res.send(data);
    }
  );  
};

