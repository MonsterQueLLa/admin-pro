import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/admin-pro'

// 连接数据库
await mongoose.connect(MONGODB_URI)
console.log('✅ 数据库连接成功')

// 更新 admin 用户头像
const result = await mongoose.connection.collection('users').updateOne(
  { username: 'admin' },
  { $set: { avatar: '/uploads/avatar.png' } }
)

if (result.matchedCount > 0) {
  console.log('✅ 头像更新成功')
} else {
  console.log('❌ 用户未找到')
}

await mongoose.disconnect()
process.exit(0)
