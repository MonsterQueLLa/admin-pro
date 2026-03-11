import mongoose from 'mongoose'

const imageSchema = new mongoose.Schema({
  title: {
    type: String,
    default: '',
    unique: true,               // ensure each image title is unique
    index: true
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

// 强制在数据库层面创建唯一索引，避免并发写入时重复标题
imageSchema.index({ title: 1 }, { unique: true })

export const Image = mongoose.model('Image', imageSchema)
