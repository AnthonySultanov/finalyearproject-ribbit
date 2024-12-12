import {ClerkProvider} from '@clerk/nextjs'
import {dark} from '@clerk/themes'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider appearance={{baseTheme: dark}}>
      <html lang="en">
        <body className={inter.className}>
        <ThemeProvider
            attribute="class"
            forcedTheme="dark"
            storageKey="ribbit-theme"
          >
            {children}
        </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}