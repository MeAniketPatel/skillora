import NavbarClient from "./navbar-client";
import { auth } from "@/auth";

export async function Navbar() {
  const session = await auth();
  return <NavbarClient session={session} />;
}
