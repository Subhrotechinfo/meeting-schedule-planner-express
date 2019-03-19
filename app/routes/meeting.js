const express = require('express');
const router = express.Router();
const { apiVersion } = require('../../config/config');
const { addMeeting , getMeetingDetails} = require('../controllers/meeting')

router.post(`/add-meeting`, addMeeting);
router.get(`/get-meeting`, getMeetingDetails);


module.exports = router;

