import React from "react"
import { Link } from "gatsby"
import Styled from 'styled-components'

import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"
import Simulator from '../components/simulator'

const Wrapper = Styled.div`
  display: grid;
  grid-template-columns: 400px 1fr;
  height: 100%;
`

const Sidebar = Styled.div`
  outline: solid 2px purple;
  padding-top: 20rem;
  padding-left: 4rem;
`
const MainDisplay = Styled.div`
  position: relative;
  outline: solid 2px pink;
`

const SimulatorContainer = Styled.section`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

`

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Wrapper>
      <Sidebar>
        <h1>Virus transmission simulator</h1>
      </Sidebar>
      <MainDisplay>
        <SimulatorContainer>
          <Simulator />
        </SimulatorContainer>
      </MainDisplay>
    </Wrapper>

  </Layout>
)

export default IndexPage
