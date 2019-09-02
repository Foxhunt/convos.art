import App from "next/app"

import { Provider } from "react-redux"
import withReduxStore from "../store/withReduxStore"

class MyApp extends App {
  render() {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <Provider store={reduxStore} >
        <Component {...pageProps} reduxStore={ reduxStore } />
      </Provider>
    )
  }
}

export default withReduxStore(MyApp)
