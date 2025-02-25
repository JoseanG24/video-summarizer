import type { Metadata } from "next";
import DarkRedNav from "@/components/other/Navbar";

export const metadata: Metadata = {
  title: "Youtube Video Summarizer",
  description: "Summarize videos",
};
export default function PagesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="h-screen">
      <DarkRedNav />
      <div className="relative z-10">{children}</div>
    </main>
  );
}
