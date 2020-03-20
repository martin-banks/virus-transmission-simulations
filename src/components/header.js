import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import Styled from 'styled-components'
import Logo from './logo-header'

const Header = Styled.header`
  margin: 0;
  margin-bottom: 3rem;
  padding: 0;
  background: none;
  h1 {
    color: red;
  }
`

const PageHeader = ({ siteTitle }) => (
  <Header>
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <Link to="https://martinbanks.com.au" >
        <Logo />
      </Link>
    </div>
  </Header>
)

PageHeader.propTypes = {
  siteTitle: PropTypes.string,
}

PageHeader.defaultProps = {
  siteTitle: ``,
}

export default PageHeader
