import React, { useRef, useLayoutEffect, useState } from 'react'
import PropTypes from "prop-types"
import Styled from 'styled-components'


/* 
Create a grid to initially position each 'person'
- Divide the width and height of the stage container by the size of the person element
- Convert this into a 2d-array
- Randomly pick array entry and render to those co-ordinates
- remove that entry from the array
- rinse and repeat
*/

const Stage = Styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const Person = Styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 12px;
  height: 12px;
  border-radius: 20px;
  background: lightblue;
  transform: ${ p => `translate(${Math.random() * (p.container.width - 20)}px, ${Math.random() * (p.container.height - 20)}px)` };
  &:first-of-type {
    background: tomato
  }
`

function makeGrid ({ width, height, size }) {
  const rows = [... new Array(width / size)]
  const columns = [... new Array(height / size)]

  return rows.map((r, ri) => {
    return columns.map((c, ci) => {
      return [ri, ci]
    })
  })
}



function Simulator (props) {
  const { count } = props
  const stageRef = useRef()
  const [ dimensions, setDimensions ] = useState({ width: 0, height: 0 })
  const [ grid, setGrid ] = useState([])
  // console.log({ dimensions })

  useLayoutEffect(() => {
    if (stageRef.current) {
      const { offsetWidth, offsetHeight } = stageRef.current
      setDimensions({
        width: offsetWidth,
        height: offsetHeight,
      })
      console.log({ stageRef })
      
      const newGrid = makeGrid({ width: offsetWidth, height: offsetHeight, size: 15 })
      setGrid(newGrid)
  
      console.log({ dimensions, newGrid, grid })
    }
  }, [])

  return <Stage ref={ stageRef }>
    {
      [... new Array(count)].map((x, i) => <Person
        key={ `person-${i}` }
        count={ count }
        container={{
          height: dimensions.height,
          width: dimensions.width,
        }} />)
    }
    <p>{ dimensions.height }</p>
  </Stage>
}

Simulator.propTypes = {
  count: Number,
}

Simulator.defaultProps = {
  count: 100,
}



export default Simulator