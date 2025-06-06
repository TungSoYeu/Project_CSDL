import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Đảm bảo server lắng nghe trên tất cả các interface
    port: 5173,     // Hoặc port bạn đang sử dụng cho Vite

    // THÊM HOẶC CẬP NHẬT MỤC NÀY
    allowedHosts: [
      // Thêm chính xác URL Ngrok mà bạn nhận được vào đây
      'd005-2402-800-61cf-bf4b-e057-7f50-9330-65a1.ngrok-free.app',
      
      // Bạn có thể thêm các host khác nếu cần, ví dụ:
      // 'localhost',
      // '127.0.0.1',

      // Nếu URL Ngrok của bạn thay đổi thường xuyên và bạn muốn cho phép tất cả
      // các subdomain của ngrok-free.app (ít an toàn hơn):
      // '.ngrok-free.app' 
    ],

    // Tùy chọn: Cấu hình cho HMR (Hot Module Replacement) nếu bạn muốn nó hoạt động qua Ngrok
    // Điều này phức tạp hơn và có thể không cần thiết cho việc demo đơn giản.
    // hmr: {
    //   clientPort: 443, // Ngrok thường dùng port 443 cho https
    //   host: 'd005-2402-800-61cf-bf4b-e057-7f50-9330-65a1.ngrok-free.app', // URL Ngrok của bạn
    //   protocol: 'wss', // Sử dụng wss cho kết nối an toàn
    // }
  }
})
