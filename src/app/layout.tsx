import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "../components/AuthProvider";
import { ServiceWorkerRegister } from "../components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "Skiftschemasverige",
  description: "Skiftschema SSAB Oxelösund med röd/grön-dagar och personliga favoriter.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Skiftschemasverige",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sv">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <AuthProvider>
          <ServiceWorkerRegister />
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
              <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500" />
                  <div>
                    <div className="text-sm font-semibold tracking-wide text-emerald-300">
                      Skiftschemasverige
                    </div>
                    <div className="text-xs text-slate-400">
                      SSAB Oxelösund 3-skift
                    </div>
                  </div>
                </div>
                <nav className="flex items-center gap-4 text-xs">
                  <a href="/" className="text-slate-300 hover:text-emerald-300">
                    Kalender
                  </a>
                  <a
                    href="/favorites"
                    className="text-slate-300 hover:text-emerald-300"
                  >
                    Favoriter
                  </a>
                </nav>
              </div>
            </header>
            <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-3 pb-20 pt-4">
              {children}
            </main>
            <footer className="fixed inset-x-0 bottom-0 border-t border-slate-800 bg-slate-900/90 backdrop-blur md:hidden">
              <div className="mx-auto flex max-w-md items-center justify-around px-6 py-2 text-xs">
                <a href="/" className="flex flex-col items-center text-emerald-300">
                  <span>Kalender</span>
                </a>
                <a
                  href="/favorites"
                  className="flex flex-col items-center text-slate-300"
                >
                  <span>Favoriter</span>
                </a>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

