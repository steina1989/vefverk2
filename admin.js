const express = require('express');
const csv = require('express-csv'); // eslint-disable-line
//const cookieParser = require('cookie-parser');
const { Strategy } = require('passport-local');

const router = express.Router();
const sql = require('./sql');
const users = require('./users');


function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

router.get('/', ensureLoggedIn, admin);
router.get('/csv', ensureLoggedIn, csvhandler);


async function csvhandler(req, res) {
  const result = await sql.select().catch(e => console.error(e));

  const data = [['name', 'email', 'ssn', 'count']];
  result.forEach((e) => {
    data.push([e.name, e.email, e.ssn, e.count]);
  });
  res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
  res.csv(data);
}

async function admin(req, res) {
  const list = await sql.select().catch(e => console.error(e));
  res.render('admin', { list, user: res.locals.user, title: 'Admin' });
}

module.exports = router;
