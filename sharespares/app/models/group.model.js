const sql = require("./db.js");
const async      = require('async');

// constructor
const Group = function(group) {
  this.name = group.name;
  this.description = group.description;
  this.status = group.status;
  this.admin_id = group.admin_id;
  this.location = group.location;
  this.visibility = group.visibility;  
  this.start_date = group.start_date;
  this.end_date = group.end_date;
  this.member_limit = group.member_limit;
  this.approval_process = group.approval_process;
  this.ask_signup_question = group.ask_signup_question;
  this.rsvp_start_date = group.rsvp_start_date;
  this.rsvp_end_date = group.rsvp_end_date;
  this.modified_date = group.modified_date;
  this.modified_by = group.modified_by;  
};  

function createGroup (newGroup) {
  return new Promise ((resolve, reject) => {
    sql.query("INSERT INTO loftu_groups SET ?", newGroup, (err, res) => err ? reject(err): resolve(res))
  })
}

function createGroupMember (id, newGroup, memType) {
  return new Promise ((resolve, reject) => {
    sql.query("INSERT INTO loftu_group_members (group_id, member_id, status, subscribe_date, member_type) VALUES (?,?, ?, ?, ?)", [id, newGroup.admin, newGroup.status, newGroup.start_date, memType], (err, res) => err ? reject(err): resolve(res))
  })
}

Group.create = async (newGroup, memType, result) => {
    var grpId = ''
    try {
      res = await createGroup(newGroup)
      console.log(res)
      res = await createGroupMember(res.insertId, newGroup, memType)
      result(null, res);
      return;
    }
    catch(err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
  
}

//Group.findById = (groupId, result) => {
//  sql.query(`SELECT * FROM loftu_groups WHERE id = ${groupId}`, (err, res) => {
//    if (err) {
//      console.log("error: ", err);
//      result(err, null);
//      return;
//    }
//
//    if (res.length) {
//      console.log("found group: ", res[0]);
//      result(null, res[0]);
//      return;
//    }

    // not found Group with the id
//    result({ kind: "not_found" }, null);/
//  });
//};

Group.findById = (groupId, callback) => {
  var query1 = `SELECT * FROM loftu_groups WHERE id = ${groupId}`
  var query2 = `SELECT * FROM loftu_items WHERE owner_id = ${groupId} AND owner_type='GROUP'`
  var query3 = `SELECT * FROM loftu_group_members WHERE group_id = ${groupId}`
  var return_data = {};
  
  async.parallel([
    function(callback) {
      sql.query(query1, function(err, results) {
               if (err) return callback(err);
               return_data.group = results;
               callback();
           });
       },
       function(callback) {       
             sql.query(query2, function(err, results) {
               if (err) return callback(err);
               return_data.items = results;
               callback();
           });
       },
       function(callback) {       
             sql.query(query3, function(err, results) {
               if (err) return callback(err);
               return_data.members = results;
               callback();
           });
       }
    ], function(err) {
         if (err) console.log(err);
         callback(null,return_data);
    });       
};

Group.findByUserId = (userId, result) => {
  q = `SELECT g.* FROM loftu_groups g JOIN loftu_group_members m ON m.member_id = '${userId}' AND m.group_id = g.id UNION SELECT g.* FROM loftu_groups g WHERE visibility = 'PUBLIC' LIMIT 5`;
  
  sql.query(q, (err, res) => {
     if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("group 1=: ", res[0]);
      result(null, res);
      return;
    }

    // not found Group with the id
    result({ kind: "not_found" }, null);
  });
};

Group.getItems = (groupId, result) => {
  sql.query(`SELECT i.*, r.start_date, r.item_return_date, r.end_date FROM loftu_items i LEFT JOIN loftu_reservations r ON i.item_id = r.item_id WHERE i.owner_id = '${groupId}' AND i.owner_type = 'GROUP' AND now() between r.start_date and coalesce(r.end_date, date_add(now(), interval 1 day)  ORDER BY i.status LIMIT 3`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("group 1=: ", res[0]);
      result(null, res);
      return;
    }

    // not found Group with the id
    result({ kind: "not_found" }, null);
  });
};

Group.getAll = result => {
  sql.query("SELECT * FROM loftu_groups", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("groups: ", res);
    result(null, res);
  });
};

Group.updateById = (id, group, userid, result) => {
  sql.query(
    "UPDATE loftu_groups SET name = ?, description = ?, status = ?, admin_id = ?, location = ?, member_limit = ?, approval_process = ?, ask_signup_question = ?, visibility=?, modified_date=?, modified_by = ? WHERE id = ?",
    [group.name, group.description, group.status, group.admin, group.location, group.member_limit, group.approval_process, group.ask_signup_question, group.visibility, now(), userid, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Group with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated group: ", { id: id, ...group });
      result(null, { id: id, ...group });
    }
  );
};

Group.remove = (id, result) => {
  sql.query("DELETE FROM loftu_groups WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Group with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted group with id: ", id);
    result(null, res);
  });
};

Group.removeAll = result => {
  sql.query("DELETE FROM loftu_groups", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} groups`);
    result(null, res);
  });
};

module.exports = Group;