const mongoose = require('mongoose');

const applicationStatusSchema = new mongoose.Schema({
  jobId: { type: String, required: true },
  userId: { type: String, required: true },
  status: { type: String, required: true, enum: ['pending', 'accepted', 'rejected'] },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ApplicationStatus', applicationStatusSchema);