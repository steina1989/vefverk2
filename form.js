const express = require('express');
const { check, validationResult } = require('express-validator/check');

const router = express.Router();
const sql = require('./sql');
const xss = require('xss');  // eslint-disable-line


router.use(express.urlencoded({ extended: true }));

function form(req, res) {
  const details = {
    name: '',
    email: '',
    ssn: '',
    count: 1,
  }; //eslint-disable-line
  res.render('form', { list: details, user: res.locals.user });
}

router.get('/', form);

router.post(
  '/post',
  check('name').isLength({ min: 1 }).withMessage('Nafn má ekki vera tómt'),
  check('email').isLength({ min: 1 }).withMessage('Netfang má ekki vera tómt'),
  check('email').isEmail().withMessage('Netfang verður að vera netfang'),
  check('ssn').isLength({ min: 1 }).withMessage('Kennitala má ekki vera tóm'),
  check('ssn').matches(/^[0-9]{6}-?[0-9]{4}$/).withMessage('Kennitala verður að vera á formi 000000-0000'),
  check('count').isInt({ min: 1 }).withMessage('Fjöldi verður að vera stærri en 0.'),

  async (req, res) => {
    const title = 'Forsíða';
    const { //eslint-disable-line
      name = '', //eslint-disable-line
      email = '', //eslint-disable-line
      ssn = '', //eslint-disable-line
      count = 1, //eslint-disable-line
    } = req.body; //eslint-disable-line

    const errors = validationResult(req);
    let errormessages = errors.array().map(value => value.msg);

    Object.keys(req.body).map(key => req.body[key] = xss(req.body[key])); // eslint-disable-line

    if (!errors.isEmpty()) {
      res.render('form', {
        errormessages, list: req.body, user: res.locals.user, title,
      });
    } else {
      const sqlresult = await sql.insert(req.body);
      if (sqlresult === -1) {
        errormessages = ['Villa varð í gagnagrunni'];
        res.render('form', {
          errormessages, list: req.body, user: res.locals.user, title,
        });
      } else {
        res.render('formsuccess');
      }
    }
  },
);


module.exports = router;

