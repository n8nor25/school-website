import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "مدرسة الاحايوه شرق - المرحلة الاعدادية",
  description: "مدرسة الاحايوه شرق الاعدادية - اعداد جيل متميز علميا وخلقيا بمعلم كفء وادارة متميزة ومشاركة مجتمعية",
  keywords: ["مدرسة الاحايوه", "تعليم", "مرحلة اعدادية", "سوهاج"],
  authors: [{ name: "محروس شعبان" }],
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="antialiased bg-[#F8F4F0] dark:bg-gray-900 text-foreground font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
