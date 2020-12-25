var moment = require('moment'); // require
const sql = require("./db.js");
const dateToday=moment().format('YYYY-MM-DD HH:mm:ss' )
// constructor
const Group = function (group) {};

Group.findGroups = ({ member_id, start, count }, result) => {
  const query =`SELECT g.* FROM shautfol_groups g JOIN shautfol_group_members m ON m.member_id = '${member_id}' AND m.group_id = g.id UNION SELECT g.* FROM shautfol_groups g WHERE visibility = 'PUBLIC' LIMIT ${start}, ${count}`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found item: ", res);
      result(null, res);
      return;
    }

    // not found Customer with the id
    result(null, []);
  });
};

// Get item by Id
Group.getById = (groupId, result) => {
  sql.query(`SELECT * FROM shautfol_groups WHERE id = ${groupId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found group: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result(null, []);
  });
};


// get catagories
Group.getCategories = result => {
  sql.query("SELECT * FROM shautfol_categories", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};



module.exports = Group;
