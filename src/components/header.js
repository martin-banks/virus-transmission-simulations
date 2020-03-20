import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import Styled from 'styled-components'
import Logo from './logo-header'
import Github from './icons/github'

const Header = Styled.header`
  box-sizing: border-box;
  margin: 0;
  margin-bottom: 3rem;
  padding: 0;
  padding-top: 2rem;
  padding-left: 2rem;
  background: none;
  display: flex;
  width: 100%;
  justify-content: flex-start;
`

const HeaderElement = Styled.div`
  /* outline: solid 1px lime; */
  flex: 1 1 0;
`
const HeaderEndElement = Styled.div`
  /* align-self: flex-end; */
  /* outline: solid 1px purple; */
  width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ForkMe = Styled.div`
/* outline: solid 1px pink; */
  position: relative;
  display: block
  width: 40px;
  margin: 0 auto;
  overflow: hidden;
`

const theme = typeof window !== 'undefined' ? (window.matchMedia('(prefers-color-scheme: light)').matches
  ? 'light'
  : 'dark') : 'dark'

const PageHeader = ({ siteTitle, repo }) => (
  <Header>
    <HeaderElement>
      <a href='https://www.martinbanks.com.au' >
        <Logo />
      </a>
    </HeaderElement>

    { repo &&
      <HeaderEndElement>
        <ForkMe>
          <Link to={ repo }>
            <ForkMe>
              <Github fill={ theme === 'dark' ? '#ffffff' : '#000000'} size="40px" />
            </ForkMe>
          </Link>
        </ForkMe>
      </HeaderEndElement>
    }
  </Header>
)

PageHeader.propTypes = {
  siteTitle: PropTypes.string,
  repo: PropTypes.string,
}

PageHeader.defaultProps = {
  siteTitle: ``,
  repo: 'null',
}

export default PageHeader
