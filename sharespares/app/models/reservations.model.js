const sql = require("./db.js");

// constructor
const Reservation = function (reservation) {
  this.item_id = reservation.item_id;
  this.member_id = reservation.member_id;
  this.reservation_status = reservation.reservation_status || 'ACTIVE';
  this.reservation_date = reservation.reservation_date || Date();
  this.start_date = reservation.start_date;
  this.end_date = reservation.end_date;
  this.item_pickup_date = reservation.item_pickup_date || null;
  this.item_return_date = reservation.item_return_date || null;
  this.cancel_date = reservation.cancel_date || null;
  this.rental_cost = reservation.rental_cost || null;
  this.created_by = reservation.created_by || Date();
  this.created_date = reservation.created_date || null;
  this.modified_by = reservation.modified_by || null;
  this.modified_date = reservation.modified_date || null;
}
  Reservation.create = (newReservation, result) => {
    sql.query("INSERT INTO loftu_reservations SET ?", newReservation, (err, res) => {
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
    sql.query(`SELECT * FROM loftu_reservations WHERE item_id = ${item_id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res[0]);
        return;
      }

      // not found Reservation with the id
      result({ kind: "not_found" }, null);
    });
  };

  module.exports = Reservation;