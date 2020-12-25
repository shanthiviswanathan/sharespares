const Rating = require("../models/feedback.model");

const getFeedbacks = (itemId, start, count) => new Promise((resolve, reject) =>
  Rating.getRatings({ itemId, start, count }, (err, data) => {
    if (err) {
      reject(err)
    } else {
      resolve(data)
    }
  }));

// get all groups
exports.getRatings = async (req, res) => {
  const { itemId, start, count } = req.query
  try {
    const reviews = await getFeedbacks(itemId, start, count);
    const feedbacks = JSON.parse(JSON.stringify(reviews))
    if (!!!feedbacks.length) {
      res.send();
    } else {
      const dataWithComments = feedbacks.map(async review => {
        const data = await getFeedbacks(review.feedback_id, 0, 20);
        const comments = JSON.parse(JSON.stringify(data))
        console.log('getCommentsgetCommentsgetComments', comments)
        return { ...review, comments: comments }
      })
      const data = await Promise.all(dataWithComments)
      res.status(200).send(data);
    }

  }
  catch{
    res.status(404).send({
      message: `Rating not found`
    });
  }
};

exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const rating = new Rating(req.body)
  Rating.create(rating, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the rating."
      });
    else res.send(data);
  });
};