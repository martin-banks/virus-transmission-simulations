/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import Styled from 'styled-components'

import Header from "./header"

const Page = Styled.div`
  position: relative;
  padding-top: 20rem;
  min-width: 100%;
  min-height: 100%;
  min-height: 100vh;
`

// const Footer = Styled.footer`
//   display: block;
//   position: absolute;
//   left: 0;
//   bottom: 0;
// `

const Main = Styled.main`
  display: block;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
`

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <Page>
      <Header siteTitle={ data.site.siteMetadata.title } />
      <Main>{ children }</Main>
      {/* <Footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.org">Gatsby</a>
      </Footer> */}
    </Page>

  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
