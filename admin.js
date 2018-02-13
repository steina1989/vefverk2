const express = require('express');
const csv = require('express-csv')

const router = express.Router();
const sql = require('./sql');


router.get('/',admin)
router.get('/csv', csvhandler)

async function csvhandler(req,res) {
    const result = await sql.select().catch(e => console.error(e));

    var data = [['name','email','ssn','count']]
    result.forEach(e => {
        data.push([e.name,e.email,e.ssn,e.count])
    });
    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
    res.csv(data);
    
}

async function admin(req,res) {
    const list = await sql.select().catch(e => console.error(e));
    res.render('admin', {list})

}

module.exports = router;
