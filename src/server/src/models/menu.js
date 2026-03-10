import mongoose from 'mongoose'

const menuSchema = new mongoose.Schema({
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    default: null
  },
  name: {
    type: String,
    required: true
  },
  path: {
    type: String,
    default: ''
  },
  component: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['directory', 'menu', 'button'],
    default: 'menu'
  },
  permission: {
    type: String,
    default: ''
  },
  hidden: {
    type: Boolean,
    default: false
  },
  keepAlive: {
    type: Boolean,
    default: false
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

export const Menu = mongoose.model('Menu', menuSchema)
