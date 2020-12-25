var moment = require('moment'); // require
const sql = require("./db.js");
const dateToday=moment().format('YYYY-MM-DD HH:mm:ss' )
// constructor
const Item = function (item) {
  this.title = item.title;
  this.subtitle = item.subtitle;
  this.description = item.description || null;
  this.status = item.status || null;
  this.owner_id = item.owner_id || null;
  this.owner_type = item.owner_type || null;
  this.category = item.category || null;
  this.location = item.location || null;
  this.address1 = item.address1 || null;
  this.address2 = item.address2 || null;
  this.city = item.city || null;
  this.state = item.state || null;
  this.zipcode = item.zipcode || null;
  this.featured_desc1 = item.featured_desc1 || null;
  this.featured_desc2 = item.featured_desc2 || null;
  this.featured_desc3 = item.featured_desc3 || null;
  this.price = item.price || null;
  this.rental_cost = item.rental_cost || null;
  this.highlights = item.highlights || null;
  this.visibility = item.visibility || null;
  this.thumbnail_image = item.thumbnail_image || null;
  this.created_by = item.created_by || null;
  this.created_date = item.created_date || null;
  this.modified_by = item.modified_by || null;
  this.modified_date = item.modified_date || null;
};

// Get all items
Item.getAll = result => {
  sql.query("SELECT * FROM shautfol_items", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("items: ", res);
    result(null, res);
  });
};

// search item by partial search
Item.search = ({ searchQuery, start, count }, result) => {
  sql.query(` SELECT  item_id, title, subtitle,description, location,thumbnail_image, visibility FROM shautfol_items WHERE MATCH (title,subtitle,description)  AGAINST('%${searchQuery}%'  IN BOOLEAN MODE ) LIMIT ${start} , ${count};`, (err, res) => {

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
    result({ kind: "not_found" }, null);
  });
};

// Get item by Id
Item.findById = (itemId, result) => {
  sql.query(`SELECT * FROM shautfol_items WHERE item_id = ${itemId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found item: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Customer with the id
    result(null, []);
  });
};


// Get user Items
Item.findOwned = ({ member_id, item_type, start, count }, result) => {
  let query;

  if (item_type === 'borrowed') {
    query = `SELECT i.item_id, i.title, i.subtitle, i.description, 'BORROWED', i.category, i.owner_id, i.thumbnail_image FROM shautfol_items i JOIN shautfol_reservations r ON r.item_id = i.item_id WHERE r.member_id = '${member_id}' AND i.owner_id !='${member_id}' AND r.start_date < NOW()  AND end_date > NOW()  AND r.item_return_date IS NULL ORDER BY r.start_date LIMIT ${start},${count};`

  }
  if (item_type === 'owned') {
    query = `SELECT i.item_id, i.title, i.subtitle, i.description, i.status, i.category, i.owner_id , i.thumbnail_image FROM shautfol_items i WHERE i.owner_id = '${member_id}' AND  i.owner_type = 'USER' AND  i.status = 'ACTIVE' ORDER BY i.created_date DESC LIMIT ${start},${count};`

  }
  if (item_type === 'reserved') {
    query = `SELECT i.item_id, i.title, i.subtitle, i.description, 'RESERVED', i.category, i.owner_id, i.thumbnail_image FROM shautfol_items i JOIN shautfol_reservations r ON r.item_id = i.item_id WHERE r.member_id = '${member_id}' AND r.start_date > now() GROUP BY r.item_id  ORDER BY MIN(r.start_date)DESC LIMIT ${start},${count};`
  }

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

// delete Item
Item.deleteItem = ({item_id,member_id} ,result) => {
  sql.query(
    `UPDATE shautfol_items  SET status = 'DELETED', visibility = 'NO', modified_by  = '${member_id}',modified_date='${dateToday}' WHERE item_id = '${item_id}'`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Customer with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, { status: 'Success' });
    }
  );
};


// Create a new Item
Item.create = (newItem, result) => {
  newItem.created_date=dateToday
  sql.query("INSERT INTO shautfol_items SET ?", newItem, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created customer: ", { id: res.insertId, ...newItem });
    result(null, { status:'Success',id: res.insertId});
  });
};

// update
Item.updateById = (id, item, result) => {
  item.modified_date=dateToday
  sql.query("UPDATE shautfol_items SET ? WHERE item_id = ?", [item, id], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found item with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null,{ status:'Success',id: id});
    }
  );
};

module.exports = Item;