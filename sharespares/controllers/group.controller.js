const Group = require("../models/group.model.js");

// get all groups
exports.findGroups = (req, res) => {
    const  request =req.query
    Group.findGroups(request, (err, data) => {
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

exports.getGroupById=(req, res)=>{
    Group.getById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Group with id ${req.params.id}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Group with id " + req.params.id
                });
            }
        } else res.send(data);
    });

}

// get all groups categories
exports.findCategories=(req, res)=>{
    Group.getCategories((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving items."
            });
        else res.send(data);
    });

}