import React, {
  useState,
  useRef,
  useMutationEffect,
  useLayoutEffect
} from 'react'
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import Styled from 'styled-components'
import p5 from 'p5'
// import Sketch from 'react-p5'

import Person from './constructors/person'

// ? Create new P5 Sketch instance
function Sketch (p) {
  // p.setup = () => {
    // p.noCanvas()
    // p.createCanvas(700, 410)
    //   .parent('parent')
  // }

  // p.draw = () => {
  //   p.background(0)
  //   p.fill(255)
  //   p.rect(x, y, 50, 50)
  // }
}



class Simulation extends React.Component {
  y = 0
  sketch = null
  // resizeTracker = null
  constructor (props) {
    super()

    this.state = {
      // sketch: null,
      // ? Canvas size
      width: 0,
      height: 0,
      // // canvas = { // TODO Set from designated area
      // //   w: Math.min(1000, window.innerWidth) - 60, // 400,
      // //   h: Math.min(1000, window.innerWidth) - 60, // 400,
      // // },

      // ? Config settings - move to props
      // // population: 500,
      distancing: 0, // (pct of population that does not move)
      timeToCure: 8 * 1000, // (ms)
      mortality: 0.2, // (pct)

      // speed: 2, // (ms) how fast
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
    this.createPeople = this.createPeople.bind(this)
  }

  // ? Methods
  storeParentSize () {
    this.setState(state => {
      const { offsetWidth, offsetHeight } = this.childRef.current.parentNode
      console.log({ offsetWidth, offsetHeight })
      return {
        width: parseInt(offsetWidth, 10),
        height: parseInt(offsetHeight, 10),
        diameter: Math.round(Math.max(offsetWidth, offsetHeight) / 100),
      }
    })
  }

  p5Setup () {
    // p5.createCanvas(this.state.width, this.state.height)
    //   .parent(parentRef)
    this.sketch.createCanvas(this.state.width, this.state.height)
      .parent(this.childRef.current)
  }

  createPeople () {
    return new Promise((resolve, reject) => {
      const newPeople = []
      for (let i = 0; i < parseInt(this.props.population, 10); i++) {
        newPeople.push(
          new Person({
            x: Math.round(this.sketch.random(0, this.state.width)),
            y: Math.round(this.sketch.random(0, this.state.height)),
            width: this.state.width,
            height: this.state.height,
            index: i,
            diameter: this.props.diameter,
            infected: i < 1,
            status: i < 1 ? 'infected' : 'normal',
            moving: true,
            speed: this.props.speed,
          })
        )
      }
      console.log({ newPeople })
      this.setState(state =>({ people: newPeople }))
      resolve(this.state.people)
    })
  }

  updatePeople () {
    this.state.people.forEach(person => {
      person.move(this.sketch)
      person.display(this.sketch)
    })

    window.requestAnimationFrame(this.updatePeople)
  }

  // ? Lifecycle
  componentDidMount () {
    this.storeParentSize()

    setTimeout(() => {
      this.sketch = new p5(Sketch)
      console.log(this.state.width, this.state.height)
      this.p5Setup()
      // this.sketch.background(100)
      this.createPeople()






      // let updater = setInterval(() => {
      //   this.sketch.background(100)
      //   this.sketch.fill((Math.floor(Math.random() * 255)), 200, 200)
      //   this.sketch.rect(200, 200, 50, 50)
      // }, 32)

    }, 500)

    // TODO Create people objects from contructor and stor in state
  }

  // ? Render
  render () {
    return <div id="parent" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    }} ref={ this.childRef } >

      {/* {
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

        } */}
    </div>
  }
}


Simulation.propTypes = {
  population: Number,
  diameter: Number,
  speed: Number,
}
Simulation.defaultProps = {
  population: 50,
  diameter: 10,
  speed: 2,
}

export default Simulation
