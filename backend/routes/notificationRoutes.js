const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

// Save notification when job seeker applies
router.post('/', async (req, res) => {
  const { jobId, userId, message } = req.body;
  const newNotification = new Notification({ jobId, userId, message });

  await newNotification.save();
  res.json({ success: true, message: 'Notification sent to HR' });
});

// Get all notifications for HR
router.get('/', async (req, res) => {
  const notifications = await Notification.find();
  res.json(notifications);
});

module.exports = router;