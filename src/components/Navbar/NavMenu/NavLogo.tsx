// components/Navbar/NavLogo.tsx
import Image from "next/image";
import Link from "next/link";

export default function NavLogo() {  // ← default export
  return (
    <Link href="/">
      <Image
        alt="Lokoji"
        src="/Logo.svg"
        width={110}
        height={35}
        priority
        className="hidden dark:block"
      />
      <Image
        alt="Lokoji"
        src="/Black Logo.svg"
        width={110}
        height={35}
        priority
        className="block dark:hidden"
      />
    </Link>
  );
}