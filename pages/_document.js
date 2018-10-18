import Document, { Head, Main, NextScript } from 'next/document'
import { createGlobalStyle, ServerStyleSheet } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  div#__next, html, body {
    margin: 0;
    height: 100%;
    width: 100%;
  }
`;

export default class MyDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags }
  }

  render () {
    return (
      <html>
        <Head>
          <meta name="viewport" content="initial-scale=1.0, width=device-width, maximum-scale=1.0, user-scalable=no, minimal-ui" key="viewport" />
          <meta name="theme-color" content="orange" />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
          <GlobalStyle />
        </body>
      </html>
    )
  }
}
