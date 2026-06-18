import NavbarClient from "./navbar-client";
import { auth } from "@/auth";
import { getAllCategories } from "@/features/categories/server";

export async function Navbar() {
  const session = await auth();
  let categories: any[] = [];
  try {
    categories = await getAllCategories();
  } catch (error) {
    console.error("Failed to load categories in navbar:", error);
  }
  return <NavbarClient session={session} categories={categories} />;
}

