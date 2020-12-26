const sql = require("./db.js");
var moment = require('moment'); // require
const dateToday=moment().format('YYYY-MM-DD HH:mm:ss' )

// constructor
const Item = function(item) {
 this.title = item.title;
  this.subtitle = item.subtitle;
  this.description=item.description || null;
  this.status=item.status || null;
  this.owner_id=item.owner_id || null;
  this.owner_type=item.owner_type || null;
  this.category=item.category || null;
  this.location=item.location || null;
  this.address1=item.address1 || null;
  this.address2=item.address2 || null;
  this.city=item.city || null;
  this.state=item.state || null;
  this.zipcode=item.zipcode || null;
  this.featured_desc1=item.featured_desc1 || null;
  this.featured_desc2=item.featured_desc2 || null;
  this.featured_desc3=item.featured_desc3 || null;
  this.price=item.price || null;
  this.rental_cost=item.rental_cost || null;
  this.highlights=item.highlights || null;
  this.visibility=item.visibility || null;
  this.thumbnail_image=item.thumbnail_image || null;
  this.created_by=item.created_by || null;
  this.created_date=item.created_date || null;
  this.modified_by=item.modified_by || null;
  this.modified_date=item.modified_date || null;
};  

function createItem (newItem) {
  return new Promise ((resolve, reject) => {
    sql.query("INSERT INTO loftu_items SET ?", newItem, (err, res) => err ? reject(err): resolve(res))
  })
}

Item.create = async (newItem, result) => {
    try {
      res = await createItem(newItem)
      console.log(res)
      result(null, res);
      return;
    }
    catch(err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }
  
}

Item.findById = (itemId, result) => {
  sql.query(`SELECT * FROM loftu_items WHERE item_id = ${itemId}`, (err, res) => {
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

    // not found Item with the id
    result({ kind: "not_found" }, null);
  });
};

Item.getByAltId = (altId, ownerType, result) => {
  sql.query(`SELECT i.* FROM loftu_items i WHERE i.owner_id = '${altId}' AND i.owner_type='${ownerType}' ORDER BY i.status`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("item 1=: ", res[0]);
      result(null, res);
      return;
    }

    // not found Item with the id
    result({ kind: "not_found" }, null);
  });
};

Item.getItemsByUserId= (userId, result) => {
  //Items owned by user and available/borrowed/reserved
  q = `SELECT i.item_id, i.title, i.subtitle, i.description, i.status, i.category, i.owner_id FROM loftu_items i WHERE i.owner_id = ? AND  i.owner_type = ? UNION SELECT i.item_id, i.title, i.subtitle, i.description, 'BORROWED', i.category, i.owner_id FROM loftu_items i JOIN loftu_reservations r ON r.item_id = i.item_id WHERE r.member_id = ? AND r.start_date < now() AND r.item_return_date IS NULL UNION SELECT i.item_id, i.title, i.subtitle, i.description, 'RESERVED', i.category, i.owner_id FROM loftu_items i JOIN loftu_reservations r ON r.item_id = i.item_id WHERE r.member_id = ? AND r.start_date > now()`; 
  sql.query(q, [userId, 'USER', userId, userId], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("item 1=: ", res[0]);
      result(null, res);
      return;
    }

    // not found Item with the id
    result({ kind: "not_found" }, null);
  });
};

// Get user Items
Item.findOwned = ({ member_id, item_type, start, count }, result) => {
  let query;

  if (item_type === 'borrowed') {
    query = `SELECT i.item_id, i.title, i.subtitle, i.description, 'BORROWED', i.category, i.owner_id, i.thumbnail_image FROM loftu_items i JOIN loftu_reservations r ON r.item_id = i.item_id WHERE r.member_id = '${member_id}' AND r.start_date < now() AND r.item_return_date IS NULL ORDER BY r.start_date LIMIT ${start},${count};`

  }
  if (item_type === 'owned') {
    query = `SELECT i.item_id, i.title, i.subtitle, i.description, i.status, i.category, i.owner_id , i.thumbnail_image FROM loftu_items i WHERE i.owner_id = '${member_id}' AND  i.owner_type = 'USER' AND  i.status = 'ACTIVE' ORDER BY i.created_date DESC LIMIT ${start},${count};`

  }
  if (item_type === 'reserved') {
    query = `SELECT i.item_id, i.title, i.subtitle, i.description, 'RESERVED', i.category, i.owner_id, i.thumbnail_image FROM loftu_items i JOIN loftu_reservations r ON r.item_id = i.item_id WHERE r.member_id = '${member_id}' AND r.start_date > now()  ORDER BY r.start_date LIMIT ${start},${count};`
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



Item.getAll = result => {
  sql.query("SELECT * FROM loftu_items", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("items: ", res);
    result(null, res);
  });
};

Item.processById = (txnType, itemId, memberId, startDate, endDate, status, result) => {
console.log('txn Type = ', txnType);
var q = '';
if (txnType == 'RESERVE') {
//Modify item_availability dates, item status and add reservation
   q = `INSERT INTO loftu_reservations (item_id, member_id, reservation_date, start_date, end_date, created_by)
VALUES (?, ?, NOW(), ?, ?, member_id)`}
else if (txnType == 'RETURN') {
  q = `update loftu_reservations set item_return_date = NOW() where item_id = ? AND member_id = ? AND item_return_date IS NULL; UPDATE loftu_items SET status = 'AVAILABLE' WHERE item_id = ?` }
else if (txnType == 'UNRESERVE') {
//Modify item_availability dates,
  q = `UPDATE loftu_reservations set cancel_date = NOW() WHERE item_id = ? AND member_id = ? AND start_date = ? AND end_date=? AND cancel_date IS NULL)`}

  sql.query(
     q, [itemId, memberId, startDate, endDate, item_id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      console.log("updated item: ", res);
      if ((txnType == 'RETURN') && (res[0].affectedRows == 0)) {
        // not found Item with the id
        result({ kind: "not_found" }, null);
        return;
      }

      result(null, res[0]);
    }
  );
};    

Item.updateById = (id, item, result) => {
  sql.query(
    "UPDATE loftu_items SET title = ?, subtitle = ?, description = ?, status = ?, owner_id = ?, owner_type = ?, category= ?, location = ?, featured_desc1 = ?, featured_desc2 = ?, featured_desc3 = ?, price = ?, rental_cost=?, highlights = ?, visibility=?, min_rental_days=?, max_rental_days=?, pickup_lead_days=?, modified_by=?, modified_date=? WHERE id = ?",
    [item.title, item.subtitle, item.description, item.status, item.owner_id, item.owner_type, item.category, item.location, item.featured_desc1, item.featured_desc2, item.featured_desc3, item.price, item.rental_cost, item.highlights, item.visibility, item.min_rental_days, item.max_rental_days, item.pickup_lead_days, item.owner_id, now(), id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Item with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated item: ", { id: id, ...item });
      result(null, { id: id, ...item });
    }
  );
};

Item.remove = ({item_id,member_id}, result) => {
  sql.query(`UPDATE loftu_items  SET status = 'DELETED', visibility = 'NO', modified_by  = '${member_id}',modified_date='${dateToday}' WHERE item_id = '${item_id}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Item with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted item with id: ", id);
    result(null, res);
  });
};

Item.search =  ({searchQuery,start,count}, result)  => {
  sql.query(` SELECT  item_id, title, subtitle,description, location,thumbnail_image, visibility FROM loftu_items WHERE MATCH (title,subtitle,description)  AGAINST('%${searchQuery}%'  IN BOOLEAN MODE ) LIMIT ${start} , ${count};`, (err, res) => {
     
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

module.exports = Item;