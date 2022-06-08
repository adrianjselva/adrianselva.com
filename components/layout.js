import Head from 'next/head'
//import { initGA, logPageView } from "./googleAnalytics"

import Navigation from './navbar'
import Footer from './footer'
import React from 'react';

class Layout extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    //if (!window.GA_INITIALIZED) {
      //initGA()
      //window.GA_INITIALIZED = true
    //}
    //logPageView()
  }

  render() {
    return (
      <div>
        <Head>
          <title>{this.props.title}</title>
          <link
            rel="stylesheet"
            href="https://bootswatch.com/4/lux/bootstrap.min.css"
          />
        </Head>
        <Navigation />
        {this.props.children}
        <Footer />
      </div>
    )
  }
}

export default Layout;
