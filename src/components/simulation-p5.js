import React, {
  useState,
  useRef,
  useMutationEffect,
  useLayoutEffect
} from 'react'
import ReactDOM from "react-dom";
import PropTypes from "prop-types"
import Styled from 'styled-components'
import Sketch from 'react-p5'

import Person from './constructors/person'

class Simulation extends React.Component {
  y = 0
  resizeTracker = null
  constructor (props) {
    super()
    this.state = {
      // ? Canvas size
      width: 0,
      height: 0,
      // canvas = { // TODO Set from designated area
      //   w: Math.min(1000, window.innerWidth) - 60, // 400,
      //   h: Math.min(1000, window.innerWidth) - 60, // 400,
      // },

      // ? Config settings - move to props
      population: 500,
      distancing: 0, // (pct of population that does not move)
      timeToCure: 8 * 1000, // (ms)
      mortality: 0.2, // (pct)

      speed: 2, // (ms) how fast
      simulationLength: 30 * 1000, // (ms)
      sessionTick: 500, // How often does the chart update (ms)

      // ? System/session variables
      diameter: 0,
      people: [],
      totals: {
        normal: props.population,
        infected: 0,
        cured: 0,
        dead: 0,
      },
      running: false,
      sessionTime: 0,
    }

    // ? Refs
    this.childRef = React.createRef()

    // ? Bound Methods
    this.p5Setup = this.p5Setup.bind(this)
    this.storeParentSize = this.storeParentSize.bind(this)
  }

  // ? Methods
  storeParentSize () {
    this.setState(state => {
      const { offsetWidth, offsetHeight } = this.childRef.current.parentNode
      return {
        width: offsetWidth,
        height: offsetHeight,
        diameter: Math.round(Math.max(offsetWidth, offsetHeight) / 100),
      }
    })
  }

  p5Setup ({ p5, parentRef }) {
    p5.createCanvas(this.state.width, this.state.height)
      .parent(parentRef)
  }

  // ? Lifecycle
  componentDidMount () {
    this.storeParentSize()
    // TODO Create people objects from contructor and stor in state
  }

  // ? Render
  render () {
    return <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    }} ref={ this.childRef } >

      {
        this.state.width && this.state.height && <Sketch
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          setup={ (p5, parentRef) => {
            window.addEventListener('resize', () => {
              clearTimeout(this.resizeTracker)
              this.resizeTracker = setTimeout(() => {
                this.storeParentSize()
                p5.resizeCanvas(this.state.width, this.state.height)
              }, 300)
            })
            this.p5Setup({ p5, parentRef })
          }}
          draw={p5 => {
            // p5.background(150)
            p5.fill(255, 0, 255)
            p5.noStroke()
            // p5.ellipse(this.state.width / 2, this.state.height / 2, this.state.diameter)

            // TODO Implement rendering people into canvas
            // this.state.people.forEach(function (person, i) {
            //   if (person.moving && person.status !== 'dead'){
            //     person.move()
            //   }
            //   person.intersect()
            //   person.statusUpdate()
            //   person.display(person)
            // })
          }}
        />

        }
    </div>
  }
}


Simulation.propTypes = {}
Simulation.defaultProps = {}

export default Simulation
