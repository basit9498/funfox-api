const mongoose = require('mongoose');

const { Schema } = mongoose;

const groupTaskSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  order_number: {
    type: Number,
    required: true,
    default: 1,
  },
  is_complete: {
    type: Boolean,
    required: true,
    default: false,
  },
  group_id: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
  },
});

module.exports = mongoose.model('GroupTask', groupTaskSchema);
