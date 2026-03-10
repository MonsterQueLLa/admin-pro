<script setup lang="ts">
import { ref } from 'vue'

const activeName = ref('basic')

const basicForm = ref({
  siteName: 'Admin Pro',
  siteLogo: '',
  copyright: '© 2024 Admin Pro. All rights reserved.'
})

const emailForm = ref({
  smtpServer: '',
  smtpPort: 587,
  smtpUser: '',
  smtpPassword: ''
})
</script>

<template>
  <div class="system-settings">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="基础设置" name="basic">
        <el-form :model="basicForm" label-width="120px">
          <el-form-item label="站点名称">
            <el-input v-model="basicForm.siteName" />
          </el-form-item>
          <el-form-item label="站点Logo">
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="版权信息">
            <el-input v-model="basicForm.copyright" type="textarea" :rows="3" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="邮件设置" name="email">
        <el-form :model="emailForm" label-width="120px">
          <el-form-item label="SMTP服务器">
            <el-input v-model="emailForm.smtpServer" placeholder="如: smtp.example.com" />
          </el-form-item>
          <el-form-item label="SMTP端口">
            <el-input-number v-model="emailForm.smtpPort" :min="1" :max="65535" />
          </el-form-item>
          <el-form-item label="SMTP账号">
            <el-input v-model="emailForm.smtpUser" />
          </el-form-item>
          <el-form-item label="SMTP密码">
            <el-input v-model="emailForm.smtpPassword" type="password" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary">保存</el-button>
            <el-button>测试连接</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="安全设置" name="security">
        <el-empty description="安全设置功能开发中" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
