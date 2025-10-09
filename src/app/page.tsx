import Link from "next/link";
import Image from "next/image";

// Assets
import Logo from "@/assets/yeslawyer.webp";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#fef4e6]">
      <div className="text-center text-[#e05c28]">
        <Image src={Logo} alt="Logo" width={150} height={150} className="mx-auto mb-6" />
        <h1 className="text-5xl font-bold mb-4">Welcome</h1>
        <p className="text-xl mb-4">Chat Live System with Django & Next.js</p>
        <p className="text-sm mb-8">By Alejandro Hernandez</p>
        <div className="space-x-4">
          <Link href="/login" className="btn">
            Login
          </Link>
          <Link href="/register" className="btn">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
