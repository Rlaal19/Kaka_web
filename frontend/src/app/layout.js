// app/layout.js
import './globals.css'
import Navbar from './Navbar' // ชื่อไฟล์ต้องตรงกับ Navbar.js

export const metadata = {
  title: 'Kafka Web UI',
  description: 'UI to manage Kafka messages',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen p-8 pb-2 gap-8 sm:p-4">
        {/* ตัวหนังสือใหญ่พื้นหลัง */}
        <div className="absolute inset-0 flex items-center justify-end mt-32 pointer-events-none z-0">
          <h1
            className="text-[15vw] font-bold text-white/8 mr-8 select-none 
              drop-shadow-[0_0_20px_rgba(0,123,255,0.15)] blur-[0.5px]"
          >
            Kafka
          </h1>
        </div>

        {/* Navbar อยู่บนสุด */}
        <div className="relative z-50">
          <Navbar />
        </div>

        <main className="relative z-10 p-4">{children}</main>
      </body>
    </html>
  );
}
