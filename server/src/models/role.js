import mongoose from 'mongoose'

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: ''
  },
  permissions: [{
    type: String
  }],
  menuIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu'
  }],
  dataScope: {
    type: String,
    enum: ['all', 'dept', 'self', 'custom'],
    default: 'self'
  },
  status: {
    type: Number,
    default: 1,
    enum: [0, 1]
  },
  sort: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

export const Role = mongoose.model('Role', roleSchema)
