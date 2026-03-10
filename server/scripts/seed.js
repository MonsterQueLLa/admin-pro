import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { User } from '../src/models/user.js'
import { Role } from '../src/models/role.js'
import { Menu } from '../src/models/menu.js'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/admin-pro'

// 连接数据库
await mongoose.connect(MONGODB_URI)
console.log('✅ 数据库连接成功')

// 清空数据
await User.deleteMany({})
await Role.deleteMany({})
await Menu.deleteMany({})
console.log('🗑️  已清空旧数据')

// 创建菜单
const menus = await Menu.insertMany([
  // 首页
  { name: '首页', path: '/dashboard', component: 'dashboard/index', icon: 'HomeFilled', type: 'menu', sort: 1 },
  
  // 图片管理
  { name: '图片管理', path: '/images', icon: 'PictureFilled', type: 'directory', sort: 2 },
  { name: '图片列表', path: '/images/list', component: 'images/index', type: 'menu', permission: 'image:view', sort: 1, parentId: null },
  
  // 系统管理
  { name: '系统管理', path: '/system', icon: 'Setting', type: 'directory', sort: 3 },
  { name: '用户管理', path: '/system/users', component: 'users/index', type: 'menu', permission: 'system:user:view', sort: 1, parentId: null },
  { name: '角色管理', path: '/system/roles', component: 'roles/index', type: 'menu', permission: 'system:role:view', sort: 2, parentId: null },
  { name: '菜单管理', path: '/system/menus', component: 'menus/index', type: 'menu', permission: 'system:menu:view', sort: 3, parentId: null }
])

// 更新父菜单ID
const imageDir = menus.find(m => m.name === '图片管理')
const systemDir = menus.find(m => m.name === '系统管理')

await Menu.updateMany(
  { name: { $in: ['图片列表'] } },
  { parentId: imageDir._id }
)
await Menu.updateMany(
  { name: { $in: ['用户管理', '角色管理', '菜单管理'] } },
  { parentId: systemDir._id }
)

console.log('✅ 菜单创建成功')

// 创建角色
const adminRole = await Role.create({
  name: '超级管理员',
  code: 'super-admin',
  description: '拥有所有权限',
  permissions: ['*'],
  menuIds: menus.map(m => m._id),
  dataScope: 'all'
})

const editorRole = await Role.create({
  name: '编辑者',
  code: 'editor',
  description: '可以管理图片',
  permissions: ['image:view', 'image:upload', 'image:update', 'image:delete'],
  menuIds: menus.filter(m => m.name !== '系统管理').map(m => m._id),
  dataScope: 'self'
})

const viewerRole = await Role.create({
  name: '访客',
  code: 'viewer',
  description: '只能查看',
  permissions: ['image:view'],
  menuIds: menus.filter(m => m.name === '首页' || m.path === '/images').map(m => m._id),
  dataScope: 'self'
})

console.log('✅ 角色创建成功')

// 创建管理员用户
const adminUser = await User.create({
  username: 'admin',
  password: '123456',
  nickname: '管理员',
  email: 'admin@example.com',
  roleIds: [adminRole._id],
  status: 1,
  isAdmin: true
})

console.log('✅ 管理员创建成功')
console.log('')
console.log('🎉 初始化完成！')
console.log('')
console.log('默认账号:')
console.log('  用户名: admin')
console.log('  密码: 123456')
console.log('')

await mongoose.disconnect()
process.exit(0)
