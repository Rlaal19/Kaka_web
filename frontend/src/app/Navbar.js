'use client'
import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-md rounded-xl">
      <div className="flex-1">
        <div className="text-2xl font-bold">Kafka</div>
      </div>

      <div className="flex-none">
        <div className="dropdown dropdown-hover">
          <div tabIndex={0} role="button" className="btn m-2">Producer</div>
          <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-3 shadow-sm">
            <li><Link href="/producermess" className="btn btn-ghost normal-case">Send Message</Link></li>
            <li><Link href="/producerjson" className="btn btn-ghost normal-case">Send JSON</Link></li>
          </ul>
        </div>
      </div>

      <div className="flex-none">
        <Link href="/message" className="btn btn-ghost normal-case">Consumer</Link>
      </div>
    </div>
  );
}

