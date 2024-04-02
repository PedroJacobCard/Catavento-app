import type { Metadata } from "next";
import { PT_Sans } from "next/font/google";
import "./globals.css";
import UserProvider from "./context/UserProvider";
import SchoolProvider from "./context/SchoolProvider";
import UsersProvider from "./context/UsersProvider";
import RememberProvider from "./context/RememberProvider";

const ptSans = PT_Sans({weight: "400", style: "normal", subsets: ["cyrillic"]});

export const metadata: Metadata = {
  title: "Catavento by MPC",
  description: "App suporte para os voluntários do projeto Catavento",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={ptSans.className}>
        <UserProvider>
        <SchoolProvider>
        <UsersProvider>
        <RememberProvider>
          {children}
        </RememberProvider>
        </UsersProvider>
        </SchoolProvider>
        </UserProvider>
      </body>
    </html>
  );
}
