import {ClerkProvider} from '@clerk/nextjs'
import {dark} from '@clerk/themes'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { Inter,Comic_Neue } from 'next/font/google'
import {Toaster} from 'sonner';

const inter = Comic_Neue({ 
    subsets: ['latin'],
    weight: ['400']
})



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider appearance={{baseTheme: dark}}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
        <Toaster theme='light' position='bottom-center' />
          <ThemeProvider
            attribute="class"
            forcedTheme="dark"
            storageKey="ribbit-theme"
            enableSystem={false}
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}