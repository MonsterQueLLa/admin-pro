export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  expiresIn: number
  user: {
    id: string
    username: string
    nickname: string
    avatar: string
    roles: string[]
    permissions: string[]
    isAdmin: boolean
  }
}
