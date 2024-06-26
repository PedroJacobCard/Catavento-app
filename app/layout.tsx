import type { Metadata } from "next";
import { PT_Sans } from "next/font/google";

//import globals css
import "./globals.css";

//import providers
import UserProvider from "./context/UserProvider";
import SchoolProvider from "./context/SchoolProvider";
import UsersProvider from "./context/UsersProvider";
import RememberProvider from "./context/RememberProvider";
import EventProvider from "./context/EventProvider";
import ReportProvider from "./context/ReportProvider";
import ClassProvider from "./context/ClassProvider";
import NextauthProvider from "./context/NextauthProvider";

//import toaster
import { Toaster } from "react-hot-toast";

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
        <NextauthProvider>
        <UserProvider>
        <SchoolProvider>
        <UsersProvider>
        <RememberProvider>
        <EventProvider>
        <ReportProvider>
        <ClassProvider>
          <Toaster />
          {children}
        </ClassProvider>
        </ReportProvider>
        </EventProvider>
        </RememberProvider>
        </UsersProvider>
        </SchoolProvider>
        </UserProvider>
        </NextauthProvider>
      </body>
    </html>
  );
}
