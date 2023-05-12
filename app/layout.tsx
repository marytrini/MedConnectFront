'use client';
import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from './components/navBar/page';
const inter = Inter({ subsets: ['latin'] })


export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout(
  {
  children,
}: {
  children: React.ReactNode
}) 
{
  
  return (
    <html lang="en">
      {/* // aca va el provider encerrando el body */}
      <body className={inter.className}>
        <header>
          <Navbar/>
        </header>
        <main>
          
          <section>
            {children}
          </section>
        </main>
        </body>
    </html>
  )
}
