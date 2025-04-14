const ApplicationStatus = require('../models/notificationUser');

// Save HR response
exports.createResponse = async (req, res) => {
  const { userId, jobId, status } = req.body;

  try {
    const existing = await ApplicationStatus.findOne({ userId, jobId });

    if (existing) {
      // Update existing response
      existing.status = status;
      await existing.save();
      return res.json({ message: 'Response updated successfully' });
    }

    const response = new ApplicationStatus({ userId, jobId, status });
    await response.save();
    res.status(201).json({ message: 'Response saved successfully' });
  } catch (err) {
    console.error('Error creating response:', err);
    res.status(500).json({ error: 'Failed to save response' });
  }
};

// Get responses for a user
exports.getResponsesForUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const responses = await ApplicationStatus.find({ userId }).sort({ updatedAt: -1 });
    res.json(responses);
  } catch (err) {
    console.error('Error fetching user responses:', err);
    res.status(500).json({ error: 'Failed to fetch user responses' });
  }
};
