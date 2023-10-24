import { Analytics } from "@vercel/analytics/react";
import "../styles/globals.css";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className="scroll-smooth">
          {props.children}
          <div id="modals" />
        </body>
      </html>
    </>
  );
}
