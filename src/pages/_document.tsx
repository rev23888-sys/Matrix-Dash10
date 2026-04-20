// pages/_document.tsx
// NOTE: Do NOT put <title> here — use next/head in _app.tsx instead.
import { ColorModeScript } from '@chakra-ui/react';
import { Html, Head, Main, NextScript } from 'next/document';
import { theme } from '@/theme/config';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* meta tags that apply to every page */}
        <meta name="description" content="Matrix Bot Dashboard — Manage your Discord server" />
        <meta name="theme-color" content="#7551FF" />
        <meta property="og:title" content="Matrix Dashboard" />
        <meta property="og:description" content="Manage and configure Matrix Bot for your Discord servers" />
        <meta property="og:site_name" content="Matrix Dashboard" />
      </Head>
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
