const mongoose = require('mongoose');

const { Schema } = mongoose;

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  owner_id: {
    type: String,
    required: true,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model('Group', groupSchema);
