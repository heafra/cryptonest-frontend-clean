import Link from "next/link";



export default function Navbar() {

  return (

    <nav className="bg-blue-600 p-4 text-white flex justify-between">

      <h1 className="font-bold text-xl">CryptoNest</h1>

      <div>

        <Link href="/dashboard" className="mr-4">Dashboard</Link>

        <Link href="/login">Login</Link>

      </div>

    </nav>

  );

}