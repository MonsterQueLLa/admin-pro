import express from 'express'
import cors from 'cors'
import path from 'path'
import { config } from '../config/index.js'
import { connectDB } from './utils/database.js'

// 导入路由
import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import roleRoutes from './routes/role.js'
import menuRoutes from './routes/menu.js'
import imageRoutes from './routes/image.js'

const app = express()

// 连接数据库
connectDB()

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 静态文件
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// 路由
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/roles', roleRoutes)
app.use('/api/v1/menus', menuRoutes)
app.use('/api/v1/images', imageRoutes)

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    code: 500,
    message: err.message || '服务器内部错误',
    data: null
  })
})

// 404
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在',
    data: null
  })
})

app.listen(config.port, () => {
  console.log(`🚀 服务器运行在 http://localhost:${config.port}`)
})
