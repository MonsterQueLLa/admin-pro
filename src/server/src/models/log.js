import mongoose from 'mongoose'

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  module: {
    type: String,
    required: true
  },
  action: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  method: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  },
  params: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: Number,
    default: 200
  },
  result: {
    type: String,
    default: ''
  },
  ip: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// 索引
logSchema.index({ userId: 1, createdAt: -1 })
logSchema.index({ module: 1, createdAt: -1 })
logSchema.index({ action: 1, createdAt: -1 })

export const Log = mongoose.model('Log', logSchema)
