import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Bulk Video Builder",
  description: "Spreadsheet to video at scale"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-900">
        <div className="mx-auto max-w-6xl p-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Bulk Video Builder</h1>
            <a className="text-sm underline" href="/dashboard">Dashboard</a>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
