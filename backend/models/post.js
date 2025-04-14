const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    postedBy:{type:mongoose.Schema.Types.ObjectId,
      ref:'HRProfile',
      default:null,
    },
    description: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', PostSchema);
