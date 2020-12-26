const sql = require("./db.js");

// constructor
const GroupMember = function(groupMember) {
  this.group_id = groupMember.group_id;
  this.member_id = groupMember.member_id;
  this.status = groupMember.status;
  this.subscribe_datetime = groupMember.subscribe_datetime;
  this.unsubscribe_datetime = null;
  this.member_type = groupMember.member_type;
  this.added_by = groupMember.added_by;
};

GroupMember.create = (newGroupMember, result) => {
  sql.query("INSERT INTO loftu_group_members SET ?", newGroupMember, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created groupMember: ", { id: res.insertId, ...newGroupMember });
    result(null, { id: res.insertId, ...newGroupMember });
  });
};

GroupMember.getGroupMembers = (groupId, result) => {
  sql.query(`SELECT gm.*, m.full_name FROM loftu_group_members gm, loftu_members m WHERE gm.member_id = m.member_id and gm.id = ${groupId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("No members in this group: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Group with the id
    result({ kind: "not_found" }, null);
  });
};

GroupMember.logicalDeleteMember = (groupMember, result) => {
  sql.query(
    "UPDATE loftu_group_members SET unsubscribe_datetime = ? WHERE group_id = ? and member_id = ?",
    [groupMember.unsubscribe_datetime, groupMember.group_id, groupMember.member_id],
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

      console.log("updated groupMember: ", {...groupMember });
      result(null, { ...groupMember });
    }
  );
};

module.exports = GroupMember;