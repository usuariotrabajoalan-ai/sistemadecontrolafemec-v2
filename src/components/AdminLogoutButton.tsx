"use client";

import { signOut } from "next-auth/react";

export default function AdminLogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/extras/login" })}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow transition-colors"
    >
      Cerrar Sesion
    </button>
  );
}