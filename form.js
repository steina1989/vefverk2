const express = require('express');
const { check, validationResult } = require('express-validator/check');
const router = express.Router();
const sql = require('./sql');
const xss = require('xss');  // eslint-disable-line


router.use(express.urlencoded({ extended: true }));


function form(req, res) {
  const details =  {
    name : '',
    email : '',
    ssn : '',
    count : 1
}
  res.render('form',{details} );
}

router.get('/', form);
// router.post('/post', validate,formPost);

router.post('/post',
  check('name').isLength({ min: 1 }).withMessage('Nafn má ekki vera tómt'),
  check('email').isLength({ min: 1 }).withMessage('Netfang má ekki vera tómt'),
  check('email').isEmail().withMessage('Netfang verður að vera netfang'),
  check('ssn').isLength({ min: 1 }).withMessage('Kennitala má ekki vera tóm'),
  check('ssn').matches(/^[0-9]{6}-?[0-9]{4}$/).withMessage('Kennitala verður að vera á formi 000000-0000'),
  check('count').isInt({min: 1}).withMessage('Fjöldi verður að vera stærri en 0.'),
 
  (req, res) => {
    const {
      name = '',
      email = '',
      ssn = '',
      count = 1
  } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errormessages = errors.array().map(value => value.msg);
    const details = xss(req.body);
    res.render('form', {errormessages ,details})      
    
  }
  else {
    const list = [req.body.name,req.body.email,req.body.ssn,req.body.count]
    sql.insert(list).catch(e => console.error(e));
    res.render('formsuccess');
  }
});


module.exports = router;



