import type { Metadata } from "next";
import "./globals.css";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: {
    default: "MochaMovies",
    template: "%s · MochaMovies",
  },
  description:
    "Track, rate, and organize the movies and shows you've watched.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-base-950 font-sans">
        <NavBar />
        <main className="pb-16">{children}</main>
      </body>
    </html>
  );
}
