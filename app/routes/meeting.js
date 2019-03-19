const express = require('express');
const router = express.Router();
const { apiVersion } = require('../../config/config');
const { addMeeting } = require('../controllers/meeting')

router.post(`/add-meeting`, addMeeting);




module.exports = router;
