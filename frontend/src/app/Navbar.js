'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-md rounded-xl opacity-95">
      <div className="flex-1 flex items-center gap-2">
        <Image
          src="/kafka.png" // ✅ ใช้ path จาก public folder ไม่ใช่ path ของเครื่อง
          width={52}
          height={52}
          alt="Kafka Logo"
        />
        {/* reload ทุกครั้งที่กด */}
        <div className="text-2xl font-bold">
          <Link href="/" onClick={() => window.location.href = '/'}>Kafka</Link>
        </div>
      </div>

      <div className="flex-none">
        <div className="dropdown dropdown-hover">
          <div tabIndex={0} role="button" className="btn m-2">Producer</div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-3 shadow-sm z-50">
            <li><Link href="/producermess" className="btn btn-ghost normal-case">Send Message</Link></li>
            <li><Link href="/shoes" className="btn btn-ghost normal-case">Send Data Shoes</Link></li>
            <li><Link href="/inventory" className="btn btn-ghost normal-case">Send Data Inventory</Link></li>
          </ul>
        </div>
      </div>

      <div className="flex-none">
        <Link href="/message" className="btn btn-ghost normal-case">Consumer</Link>
      </div>
    </div>
  );
}
