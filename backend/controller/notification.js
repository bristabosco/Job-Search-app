const Response = require('../models/response');
const Job = require('../models/post');

exports.createResponse = async (req, res) => {
  try {
    const { userId, jobId, message, status } = req.body;

    // Optional: Find job to get job title
    const job = await Job.findById(jobId);

    const newResponse = new Response({
      userId,
      jobId,
      message,
      status
    });

    await newResponse.save();

    res.status(201).json({
      success: true,
      data: newResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating response',
      error: error.message
    });
  }
};

exports.getUserResponses = async (req, res) => {
  try {
    const { userId } = req.params;

    const responses = await Response.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: responses.length,
      data: responses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching responses',
      error: error.message
    });
  }
};