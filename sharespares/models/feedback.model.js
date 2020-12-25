const sql = require("./db.js");
const moment = require('moment'); 
const { now } = require("moment");
const dateToday=moment().format('YYYY-MM-DD HH:mm:ss' )
// constructor
const Feedback = function (feedback) {
this.feedback_type=feedback.feedback_type;

this.feedback_by=feedback.feedback_by,

this.feedback_object_id=feedback.feedback_object_id,

this.feedback_object_type=feedback.feedback_object_type,

this.feedback_date=feedback.feedback_date,

this.feedback_subobject=feedback.feedback_subobject,

this.feedback_text=feedback.feedback_text|| null,

this.num_of_likes=feedback.num_of_likes|| null,

this.created_by=feedback.created_by|| now(),

this.created_date=feedback.created_date|| null,

this.modified_by=feedback.modified_by|| null,

this.modified_date=feedback.modified_date|| null

};

Feedback.getRatings = ({itemId,start,count}, result) => {
  const query =`SELECT * FROM shautfol_feedbacks r JOIN shautfol_members m ON m.member_id = r.feedback_by  WHERE feedback_object_id = '${itemId}' ORDER BY r.created_date DESC LIMIT ${start},${count}`;
  // get comments for a feedback


  // get feedback
  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
      result(null, res);
      return;
    }

  );
};

Feedback.create = (newRating, result) => {
  sql.query("INSERT INTO shautfol_feedbacks SET ?", newRating, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
    result(null, { status:'Success',id: res.insertId});
  });
};



module.exports = Feedback;