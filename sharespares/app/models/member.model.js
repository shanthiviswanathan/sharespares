const sql = require("./db.js");
global.crypto = require('crypto')

// constructor
const Member = function(member) {
  this.member_id = member.member_id;
  this.email = member.email;
  this.hash = member.hash;
  this.salt = member.salt;
  this.display_name = member.display_name;
  this.first_name = member.first_name;
  this.middle_name = member.middle_name;
  this.last_name = member.last_name;
  this.title = member.title;
  this.address1 = member.address1;
  this.address2 = member.address2;
  this.citystate = member.citystate;
  this.country = member.country;
  this.dob = member.dob;
  this.join_date = member.join_date;
  this.leave_date = member.leave_date;
  this.reset_password = member.reset_password;
  this.security_question1 = member.security_question1;
  this.security_answer1 = member.security_answer1;
  this.security_question2 = member.security_question2;
  this.security_answer2 = member.security_answer2;
  this.photo = member.photo;
};


// Method to set salt and hash the password for a user 
// setPassword method first creates a salt unique for every user 
// then it hashes the salt with user password and creates a hash 
// this hash is stored in the database as user password 
Member.setPassword = (newMember, pwd) => { 
     
 // Creating a unique salt for a particular user 
    newMember.salt = crypto.randomBytes(16).toString('hex'); 
  
    // Hashing user's salt and password with 1000 iterations, 
    //64 length and sha512 digest 
    newMember.hash = crypto.pbkdf2Sync(pwd, newMember.salt,  
    1000, 64, `sha512`).toString(`hex`); 
    return;
}; 

// Method to check the entered password is correct or not 
// valid password method checks whether the user 
// password is correct or not 
// It takes the user password from the request  
// and salt from user database entry 
// It then hashes user password and salt 
// then checks if this generated hash is equal 
// to user's hash in the database or not 
// If the user's hash is equal to generated hash  
// then the password is correct otherwise not 
Member.validPassword = (newMember, pwd) => { 
    var hash = crypto.pbkdf2Sync(pwd,  
    newMember.salt, 1000, 64, `sha512`).toString(`hex`); 
    return newMember.hash === hash; 
}; 

Member.create = (newMember, result) => {
  sql.query("INSERT INTO loftu_members SET ?", newMember, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created member: ", { ...newMember });
    result(null, { ...newMember });
  });
};

Member.findByEmail = (email, result) => {
  console.log("Email = " + email)
  sql.query(`SELECT * FROM loftu_members WHERE email = "${email}"`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found member: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Member with the id
    result({ kind: "not_found" }, null);
  });
};

Member.findById = (memberId, result) => {
  sql.query(`SELECT * FROM loftu_members WHERE member_id = ${memberId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found member: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Member with the id
    result({ kind: "not_found" }, null);
  });
};

Member.getAll = result => {
  sql.query("SELECT * FROM loftu_members", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("members: ", res);
    result(null, res);
  });
};

Member.updateById = (id, member, result) => {
  sql.query(
    "UPDATE loftu_members SET email = ?, display_name = ?, first_name = ?, middle_name = ?, last_name = ?, title = ?, address1 = ?, address2 = ?, city = ?, state = ?, country = ?, dob = ?, security_question1 = ?, security_answer1 = ?, security_question2 = ?, security_answer2 = ? WHERE member_id = ?",
    [member.email, member.display_name, member.first_name, member.middle_name, member.last_name, member.title, member.address1, member.address2, member.city, member.state, member.country, member.dob, member.join_date, member.reset_password, member.security_question1, member.security_answer1, member.security_question2, member.security_answer2, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Member with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated member: ", { id: id, ...member });
      result(null, { id: id, ...member });
    }
  );
};

Member.remove = (id, result) => {
  sql.query("DELETE FROM loftu_members WHERE member_id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Member with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted member with id: ", id);
    result(null, res);
  });
};

Member.removeAll = result => {
  sql.query("DELETE FROM loftu_members", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} members`);
    result(null, res);
  });
};

module.exports = Member;