import { getTickerItems } from "@/lib/Data/tickerData";
import NavbarClient from "./NavMenu/NavbarClient";

// ✅ Server component — can use async/await
export default async function Navbar() {
  const tickerItems = await getTickerItems();
  return <NavbarClient tickerItems={tickerItems} />;
}