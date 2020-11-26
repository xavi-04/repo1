var express = require('express');
var router = express.Router();

var {signup, signin} = require('../controller/autorizar.controller');

router.post('/signup', signup);
router.post('/signin', signin);

module.exports = router;