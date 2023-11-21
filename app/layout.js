
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./components/navBar/page";
import { usePathname } from "next/navigation";
import Admin from "./components/administration/panel/page";
import { Providers } from "./redux/provider";

const inter = Inter({ subsets: ["latin"] });
 export const metadata = {   title: 'Create Next App',   description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}) {
    
  const pathname = usePathname();
  const pathAdmin = pathname.includes("administration");

  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>
          <header>
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500&display=swap"
            />
            <Navbar />
          </header>
          <main className={pathAdmin ? "admin_main" : inter.className}>
            {pathAdmin && <Admin />}
            <section>{children}</section>
          </main>
        </body>
      </html>
    </Providers>
  );
}