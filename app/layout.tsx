"use client";

import localFont from "next/font/local";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { useEffect, useState } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const API_URL = process.env.STRAPI_URL || "http://127.0.0.1:1337";

export const client = new ApolloClient({
  uri: `${API_URL}/graphql`,
  cache: new InMemoryCache(),
  defaultOptions: {
    mutate: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ApolloProvider client={client}>
          <div 
            className="container mx-auto px-4"
          >
              {children}
          </div>
        </ApolloProvider>
        
      </body>
    </html>
  );
}
