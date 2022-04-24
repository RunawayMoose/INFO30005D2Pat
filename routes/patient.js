var express = require('express');
var router = express.Router();

var patientController = require('../controllers/patientController');

router.get('/', patientController.patientGet);

router.post('/', patientController.patientPost);


module.exports = router;
