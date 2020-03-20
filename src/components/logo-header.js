import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
import Styled from 'styled-components'

import blackSignature from '../files/images/signtaure.1.0.0-black.png'
import whiteSignature from '../files/images/signtaure.1.0.0-white.png'

/*
 * This component is built using `gatsby-image` to automatically serve optimized
 * images with lazy loading and reduced file sizes. The image is loaded using a
 * `useStaticQuery`, which allows us to load the image from directly within this
 * component, rather than having to pass the image data down from pages.
 *
 * For more information, see the docs:
 * - `gatsby-image`: https://gatsby.dev/gatsby-image
 * - `useStaticQuery`: https://www.gatsbyjs.org/docs/use-static-query/
 */
const Wrapper = Styled.div`
  position: relative;
  width: 100%;
  max-width: 150px;
  margin-bottom: 6rem;
`
const ImageWrapper = Styled.div`
  position: relative;
  width: 110%;
  height: auto;
  left: 50%;
  transform: translateX(-30%);
  background-size: contain;
  @media (prefers-color-scheme: dark) {
    background-image: url(${whiteSignature});
  }
  @media (prefers-color-scheme: light) {
    background-image: url(${blackSignature});
  }
`
const Box = Styled.div`
  position: absolute;
  top: 21%;
  left: 50%;
  width: 100%;
  height: 33%;
  border: solid 1px rgba(125, 125, 125, 0.4);
  transform: translateX(-50%);
`

// Config for corner positions
const cornerValues = {
  tl: {
    left: 0,
    top: 0,
    border: {
      top: 'solid 1px',
      right: 'none',
      bottom: 'none',
      left: 'solid 1px',
    },
  },
  tr: {
    left: 1,
    top: 0,
    border: {
      top: 'solid 1px',
      right: 'solid 1px',
      bottom: 'none',
      left: 'none',
    },
  },
  bl: {
    left: 0,
    top: 1,
    border: {
      top: 'none',
      right: 'none',
      bottom: 'solid 1px',
      left: 'solid 1px',
    },
  },
  br: {
    left: 1,
    top: 1,
    border: {
      top: 'none',
      right: 'solid 1px',
      bottom: 'solid 1px',
      left: 'none',
    },
  },
}
const Corner = Styled.div`
  position: absolute;
  border: none;
  border-top: ${p => cornerValues[p.side].border.top};
  border-right: ${p => cornerValues[p.side].border.right};
  border-bottom: ${p => cornerValues[p.side].border.bottom};
  border-left: ${p => cornerValues[p.side].border.left};
  @media (prefers-color-scheme: dark) {
    border-color: darkred;
  }
  @media (prefers-color-scheme: light) {
    border-color: tomato;
  }
  border-radius: 0px;
  box-sizing: content-box;
  width: 0.3rem;
  height: 0.3rem;
  padding: 0.2rem;
  top: ${p => cornerValues[p.side].top * 100}%;
  left: ${p => cornerValues[p.side].left * 100}%;
  transform: translate(-50%, -50%);
  opacity: 1;
`
const Image = () => {
  const theme = typeof window !== 'undefined' ? (window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark') : 'dark'
  

  // ? GraphQL query for using Gatsby Image Cpmponent
  // * This supports lazy loading and low-res placeholder images
  // * However this is not desirable for displaying the autograph logo
  // TODO Clean up the unused example below (kept for reference) - cleanup
//   // ! Light and dark refer to the theme detected.
//   // ! Dark theme wants the white logo and vice versa.
  const data = useStaticQuery(graphql`
    query {
      light: file(relativePath: { eq: "images/signtaure.1.0.0-black.png" }) {
        childImageSharp {
          fluid(maxWidth: 500) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      dark: file(relativePath: { eq: "images/signtaure.1.0.0-white.png" }) {
        childImageSharp {
          fluid(maxWidth: 500) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `)

  return <Wrapper>
    <Box>
      <Corner side="tl" />
      <Corner side="tr" />
      <Corner side="br" />
      <Corner side="bl" />
    </Box>
    <ImageWrapper>
      <Img fluid={data[theme].childImageSharp.fluid} style={{ opacity: 0 }} />
    </ImageWrapper>
  </Wrapper>
}

export default Image
