const express = require('express');
const csv = require('express-csv'); // eslint-disable-line
const router = express.Router();
const sql = require('./sql');

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  return res.redirect('/login');
}

async function csvhandler(req, res) {
  const result = await sql.select().catch(e => console.error(e));

  const data = [['id', 'name', 'email', 'ssn', 'count', 'date']];
  result.forEach((e) => {
    data.push([e.id, e.name, e.email, e.ssn, e.count, e.date]);
  });
  res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
  res.csv(data);
}

async function admin(req, res) {
  const list = await sql.select().catch(e => console.error(e));
  res.render('admin', { list, user: res.locals.user, title: 'Admin' });
}

router.get('/', ensureLoggedIn, admin);
router.get('/csv', ensureLoggedIn, csvhandler);

module.exports = router;
