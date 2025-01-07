
import type { Metadata } from "next";
import localFont from "next/font/local"
import SideBar from "@/components/SideBar";
import TitleBar from "@/components/TitleBar";
import 'material-icons/iconfont/material-icons.css';
import "./globals.css";



export const metadata: Metadata = {
  title: "Gerenciador de Propostas",
  description: "Gerenciador de Propostas desenvolvido por Homio CRM",
};

const helvetica = localFont({
  src: [
    {
      path: '../public/fonts/HelveticaNowDisplay-ExtBdIta.woff2',
      weight: '800',
      style: 'italic'

    },
    {
      path: '../public/fonts/HelveticaNowDisplay-BoldIta.woff2',
      weight: '700',
      style: "italic",
    },
    {
      path: '../public/fonts/HelveticaNowDisplay-ExtraBold.woff2',
      weight: '800',
    },
    {
      path: '../public/fonts/HelveticaNowDisplay-Light.woff2',
      weight: '300',
    },
    {
      path: '../public/fonts/HelveticaNowDisplay-LightIta.woff2',
      weight: '300',
      style: "italic",
    },
    {
      path: '../public/fonts/HelveticaNowDisplay-MedIta.woff2',
      weight: '500',
      style: "italic",
    },
    {
      path: '../public/fonts/HelveticaNowDisplay-Medium.woff2',
      weight: '500',
    },
    {
      path: '../public/fonts/HelveticaNowDisplay-RegIta.woff2',
      weight: '400',
      style: "italic",
    },
    {
      path: '../public/fonts/HelveticaNowDisplay-Regular.woff2',
      weight: '400',
    }
  ],
  variable: '--font-helvetica-now-display'
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={` ${helvetica.variable} font-sans`}
      >
        <div className="flex">
          <SideBar></SideBar>
          <TitleBar text='Empreendimentos Mivita'></TitleBar>
        </div>
        {children}
      </body>
    </html>
  );
}
