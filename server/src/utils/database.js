import mongoose from 'mongoose'
import { config } from '../config/index.js'

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri)
    console.log('✅ MongoDB 连接成功')
  } catch (error) {
    console.error('❌ MongoDB 连接失败:', error.message)
    process.exit(1)
  }
}
