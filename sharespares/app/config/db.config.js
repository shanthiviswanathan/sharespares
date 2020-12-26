require('dotenv').config()

let PASSWORD = "sha1vis2"
let HOST = "localhost"

if (process.env.NODE_ENV === 'test') {
  PASSWORD = process.env.TEST_PASSWORD,
  HOST = process.env.TEST_HOST
}

module.exports = {
  HOST,
  USER: "shanthi",
  PASSWORD,
  DB: "loftu"
};