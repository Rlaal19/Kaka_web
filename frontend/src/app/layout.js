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
      <body className=" grid grid-rows-[20px_1px_20px] min-h-screen p-8 pb-2 gap-8 sm:p-4">
        <Navbar />
        <main className="p-4">{children}</main>
      </body>
    </html>
  )
}
