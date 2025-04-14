const express = require('express')
const router = express.Router();
const responseController = require('../controller/responseController');

// HR saves response (accept/reject)
router.post('/responses', responseController.createResponse);

// Job seeker fetches their application response
router.get('/user-responses/:userId', responseController.getResponsesForUser);

module.exports = router;
