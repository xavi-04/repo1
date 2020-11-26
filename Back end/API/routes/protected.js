
var express = require('express');
var router = express.Router();
var {requireSignin, adminMiddleWare} = require('../controller/autorizar.controller');

router.get('/', requireSignin ,(req, res, next) =>{
    res.send('protected')
});

router.get('/admin', requireSignin, adminMiddleWare, (req, res, next) =>{
    res.send('protected')
});

module.exports = router;