import App, { Container } from "next/app"
import React from "react"
import Head from "next/head"

import { Provider } from "react-redux"
import withReduxStore from "../store/withReduxStore"

import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
  div#__next, html, body {
    margin: 0;
    height: 100%;
    width: 100%;

    display: flex;
    justify-content: center;
  }
`

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <Container>
        <GlobalStyle />
        <Head>
          <title>convos</title>
        </Head>
        <Provider store={reduxStore} >
          <Component {...pageProps} />
        </Provider>
      </Container>
    )
  }
}

export default withReduxStore(MyApp)
