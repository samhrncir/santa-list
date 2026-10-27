import type { Metadata, Viewport } from "next";
import { IM_Fell_English, IM_Fell_English_SC, Pinyon_Script } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import "./globals.css";

const fell = IM_Fell_English({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-fell",
  display: "swap",
});

const fellSmallCaps = IM_Fell_English_SC({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fell-sc",
  display: "swap",
});

const pinyon = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pinyon",
  display: "swap",
});

const description =
  "Write an old-fashioned letter to Santa, add wishes with links, and share it with family by private link.";

export const metadata: Metadata = {
  metadataBase: new URL("https://santa.mappa.systems"),
  title: { default: "Letters to Santa", template: "%s · Letters to Santa" },
  description,
  openGraph: { title: "Letters to Santa", description, type: "website", siteName: "Letters to Santa" },
};

export const viewport: Viewport = {
  themeColor: "#0f1d36",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fell.variable} ${fellSmallCaps.variable} ${pinyon.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
