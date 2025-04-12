"use client"

import type React from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@/contexts/auth-context"
import { WebSocketProvider } from "@/hooks/use-websocket"
import { ToastProvider } from "@/components/toast"
import { Red_Hat_Display } from "next/font/google";
import "@/styles/globals.css"
import { AppProps } from "next/app"
import { ReactNode } from "react"

const red_hat_display = Red_Hat_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-red-hat-display",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});
const queryClient = new QueryClient()

type ComponentWithLayout = AppProps['Component'] & {
  getLayout?: (page: ReactNode) => ReactNode
}

export default function App({ Component, pageProps }: AppProps) {

  const ComponentWithLayout = Component as ComponentWithLayout
  const getLayout = ComponentWithLayout.getLayout || ((page: ReactNode) => page)

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WebSocketProvider>
          <ToastProvider>
            <div className={red_hat_display.className}>
              {getLayout(
                <Component {...pageProps} />
              )}
            </div>
          </ToastProvider>
        </WebSocketProvider>
      </AuthProvider>
    </QueryClientProvider>

  )
}
