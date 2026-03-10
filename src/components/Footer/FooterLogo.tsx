// components/Navbar/NavLogo.tsx
import Image from "next/image";
import Link from "next/link";

export default function FooterLogo() {
  // ← default export
  return (
    <Link href="/">
      <Image
        src="/Logo.svg"
        alt="لوجو لوكوجي"
        width={160}
        height={52}
        className="hidden dark:block"
      />
      <Image
        src="/Black Logo.svg"
        alt="لوجو لوكوجي"
        width={160}
        height={52}
        className="block dark:hidden"
      />
    </Link>
  );
}
