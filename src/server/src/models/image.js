import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  originalPath: {
    type: String,
    required: true
  },
  thumbnailPath: {
    type: String,
    required: true
  },
  subjects: [{
    type: String
  }],
  type: {
    type: String,
    default: ''
  },
  date: {
    type: Date
  },
  device: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  size: {
    type: Number
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  format: {
    type: String
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creatorName: {
    type: String,
    required: true
  }
}, {
  timestamps: true
})

export const Image = mongoose.model('Image', imageSchema)
