import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import JsonLd from "@/components/seo/JsonLd";
import { getAllPosts } from "@/lib/blog";
import { BUSINESS, SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

const inter = Geist({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "es_ES",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-V9KLHGZ86C"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-V9KLHGZ86C');
          `}
        </Script>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: BUSINESS.name,
            url: BUSINESS.url,
            description: SITE_DESCRIPTION,
            email: BUSINESS.email,
            telephone: BUSINESS.telephone,
            address: { "@type": "PostalAddress", ...BUSINESS.address },
            areaServed: "ES",
          }}
        />
        <Header showBlog={(await getAllPosts()).length > 0} />
        {children}
      </body>
    </html>
  );
}
