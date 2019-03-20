const express = require('express');
const router = express.Router();
const { apiVersion } = require('../../config/config');
const { addMeeting , getMeetingDetail, updateMeeting, deleteMeeting} = require('../controllers/meeting')

router.post(`/add-meeting`, addMeeting);
router.get(`/get-meeting`, getMeetingDetail);
router.post(`/update-meeting`,updateMeeting);
router.post(`/delete-meeting`, deleteMeeting);


module.exports = router;

