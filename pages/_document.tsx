import Document, { Head, Html, Main, NextScript } from 'next/document';
class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Generate your travel plan in seconds."
          />
          <meta property="og:site_name" content="tourbuddy" />
          <meta
            property="og:description"
            content="Generate your travel plan in seconds."
          />
          <meta property="og:title" content="Travel Plan Generator" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Twitter Bio Generator" />
          <meta
            name="twitter:description"
            content="Generate your travel plan in seconds."
          />
        </Head>
        <body style={{
          backgroundImage: "url('/bg_tourbuddy.png')",
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
