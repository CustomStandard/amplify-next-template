import type { Metadata } from "next";
import { DM_Sans } from 'next/font/google'
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import ModalProvider from '@/providers/modal-provider'
import ConfigureAmplifyClientSide from "./amplify-cognito-config";


const font = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RiskExpert',
  description: "Isaiah's Risk Management Expert",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <html lang="en">
    <body className={font.className}>
    <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
      <ModalProvider>
      <>
          <ConfigureAmplifyClientSide />
          {children}
        </></ModalProvider>
    </ThemeProvider>

    </body>
  </html>
  );
}
