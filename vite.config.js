import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 新增 base 設定，路徑為您的儲存庫名稱
  base: '/<YOUR_REPOSITORY_NAME>/', 
})
