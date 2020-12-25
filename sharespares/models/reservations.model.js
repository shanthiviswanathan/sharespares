const sql = require("./db.js");
const moment = require('moment'); 
const dateToday=moment().format('YYYY-MM-DD HH:mm:ss' )

// constructor
const Reservation = function (reservation) {
  this.item_id = reservation.item_id;
  this.member_id = reservation.member_id;
  this.reservation_status = reservation.reservation_status || 'ACTIVE';
  this.reservation_date = reservation.reservation_date || null;
  this.start_date = reservation.start_date;
  this.end_date = reservation.end_date;
  this.item_pickup_date = reservation.item_pickup_date || null;
  this.item_return_date = reservation.item_return_date || null;
  this.cancel_date = reservation.cancel_date || null;
  this.item_cost = reservation.item_cost || null;
  this.created_by = reservation.created_by ||null;
  this.created_date = reservation.created_date ||  null;
  this.modified_by = reservation.modified_by || null;
  this.modified_date = reservation.modified_date || null;
}
  Reservation.create = (newReservation, result) => {
    sql.query("INSERT INTO shautfol_reservations SET ?", newReservation, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log("created reservation: ", { id: res.insertId, ...newReservation });
      result(null, { id: res.insertId, ...newReservation });
    });
  };

  Reservation.findByItemId = (item_id, result) => {
    sql.query(`SELECT * FROM shautfol_reservations WHERE item_id = ${item_id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res);
        return;
      }

      // not found Reservation with the id
      result({ kind: "not_found" }, null);
    });
  };
  
  // return borrowed Item
  Reservation.returnItem = ({item_id,member_id} ,result) => {
  const query=`UPDATE shautfol_reservations SET item_return_date = NOW() where item_id = '${item_id}' AND member_id = '${member_id}'AND start_date < NOW()  AND end_date > NOW()  AND item_return_date IS NULL; UPDATE shautfol_items SET status = 'AVAILABLE' WHERE item_id = '${item_id}'`
  sql.query(query,(err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      if (res.affectedRows == 0) {

        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { status: 'Success' });
    }
  );
};

  module.exports = Reservation;