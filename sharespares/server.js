const config = require('./app/config/config')

const groupsRouter = require("./app/routes/groupRoutes")
const itemsRouter = require('./app/routes/itemRoutes')
const loginRouter = require("./app/routes/loginRoutes")
const reservationsRouter = require("./app/routes/reservationRoutes")

const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const express = require("express")
const app = express();

const cors = require('cors')

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/groups', groupsRouter);
app.use('/api/items', itemsRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/', loginRouter);
require("./app/routes/upload.js")(app);

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Loftu application." });
});

app.post('/auth', function(request, response) {
	var email = request.body.email;
	var password = request.body.password;
  console.log(email)
  console.log(password)
	if (email && password) {
		connection.query('SELECT * FROM loftu_members WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = email;
				response.redirect('/home');
			} else {
				response.send('Incorrect email and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter email and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		response.send('Welcome back, ' + request.session.username + '!');
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

// set port, listen for requests
app.listen(4000, () => {
  console.log("Server is running on port 4000.");
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;



