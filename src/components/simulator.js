import React, {
  useState,
  useRef,
  useMutationEffect,
  useLayoutEffect
} from 'react'
import ReactDOM from "react-dom";
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

// const Person = Styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 12px;
//   height: 12px;
//   border-radius: 20px;
  /* background: ${p =>
    p.status === 'infected' ? 'tomato'
      : p.status === 'cured' ? 'seagreen' 
        : 'lightblue'
    }; */
  /* transform: ${ p => `translate(${p.location.x}px, ${p.location.y}px)` }; */
// `

// function makeGrid ({ width = 1, height = 1, size = 1 } = {}) {
//   console.log({ width, height, size })
//   const rows = [... new Array(width || 100 / size)]
//   const columns = [... new Array(height || 100 / size)]

//   return rows.map((r, ri) => {
//     return columns.map((c, ci) => {
//       return [ri, ci]
//     })
//   })
// }


// ? Solution from this issue post
// ? https://github.com/facebook/react/issues/14195
// ? https://codesandbox.io/s/ojxl32jm4z
const useAnimationFrame = callback => {
  const callbackRef = useRef(callback);
  useMutationEffect(
    () => {
      callbackRef.current = callback;
    },
    [callback]
  );

  const loop = () => {
    frameRef.current = requestAnimationFrame(
      loop
    );
    const cb = callbackRef.current;
    cb();
  };

  const frameRef = useRef();
  useLayoutEffect(() => {
    frameRef.current = requestAnimationFrame(
      loop
    );
    return () =>
      cancelAnimationFrame(frameRef.current);
  }, []);
};


function makePeople (
  {
    width, height,
    size = 10,
    maxSpeed = 1,
    count = 2
  } = {}) {
    if (!width || !height) return
    // console.log({ width, height })
    // const rows = [... new Array(count * count)]
    // const columns = [... new Array(count * count)]

    return [... new Array(count)].map((p , i) => {
      const direction = {
        // x: (Math.random() > 0.5 ? 1 : -1),
        // y: (Math.random() > 0.5 ? 1 : -1),
        x: ((Math.random() * 2) - 1),
        y: ((Math.random() * 2) - 1),
      }
      return {
        id: `marker--${`00000${i}`.slice(-5)}`,
        height,
        width,
        direction,
        position: { x: Math.random() * width, y: Math.random() * height },
        // position: { x: 0.5 * width, y: 0.5 * height },
        velocity: { x: maxSpeed, y: maxSpeed/* Math.random() * maxSpeed */},
        status: (i === 0) ? 'infected' : 'healthy'
      }
    })
}


// function moveDot ({ dot = null, velocity = { x: 1, y: 1 }, position = { x: 0, y: 0 } } = {}) {
//   if (!dot) return
//   const newTransform = `translate3d(${position.x += velocity.x}, ${position.y += velocity.y})`
//   return
// }



function Simulator (props) {
  const { count } = props
  const stageRef = useRef()
  const [ dimensions, setDimensions ] = useState({ width: 10, height: 10 })
  const [ grid, setGrid ] = useState([])
  const [ people, setPeople ] = useState(null)
  let [ counter, setCounter ] = useState(0)

  // console.log({ stageRef })

  useLayoutEffect(() => {
    if (stageRef.current) {
      const { offsetWidth, offsetHeight } = stageRef.current
      setDimensions({
        width: offsetWidth,
        height: offsetHeight,
      })

      if (offsetWidth && offsetHeight) {
        const madePeople = makePeople({ width: offsetWidth, height: offsetHeight, size: 15, count: 200 })
        setPeople(madePeople)

        // setTimeout(() => updatePeople(people), 4000)
      }
    }
      
    //   // if (offsetWidth && offsetHeight) {
    //     //   const madePeople = makePeople({ width: offsetWidth, height: offsetHeight, size: 15, count: 5 })
    //     //   setPeople(madePeople)
    //     //   setTimeout(() => updatePeople(madePeople), 4000)
    //     // }
    //   }

  }, [])


  useLayoutEffect(() => {

    requestAnimationFrame(() => {
      // setCounter(v => v + 0.1)
      setPeople(x => {
        const update = [...x]
        update.forEach((p, i) => {
          const { velocity, direction, width, height } = x[i]
          // console.log(velocity.x)
          if (direction.x > 0) {
            if ((x[i].position.x) >= (width - 20)) {
              x[i].direction.x = x[i].direction.x * -1
            }
          } else if (direction.x < 0) {
            if (x[i].position.x <= 0) {
              x[i].direction.x = x[i].direction.x * -1
            }
          }

          if (direction.y > 0) {
            if ((x[i].position.y) >= (height - 20)) {
              x[i].direction.y = x[i].direction.y * -1
            }
          } else if (direction.y < 0) {
            if (x[i].position.y <= 0) {
              x[i].direction.y = x[i].direction.y * -1
            }
          }

          x[i].position.x += (velocity.x * direction.x)
          x[i].position.y += (velocity.y * direction.y)
          // } else {
            // if ((x[i].position.x) >= width) {
            //   x[i].position.x += velocity.x
            // } else if (x[i].position.x <= 0) {
            //   x[i].position.x -= velocity.x
            // } else {
            //   x[i].position.x -= velocity.x
            // }
          // }

          // if ((y[i].position.y + 20) >= x[i].height) {
          //   x[i].position.y -= p.velocity.y
          // } else if (y[i].position.y <= 0) {
          //   x[i].position.y += p.velocity.y
          // }
        })
        return update
      })
    })
  })




  // function resetValue() {
  //   setCounter(0);
  // }



  // useEffect (() => {
    // function updatePeople (peopleList) {
    // const update = [...people]
    // update.forEach((p, i) => {
    //   update[i].position.x += p.velocity.x
    //   update[i].position.y += p.velocity.y
    // })
    // setPeople(update)
    // }

  // })

  return <Stage ref={ stageRef }>
    <h1>{ counter }</h1>
    {
      people && people.map((p, i) => {
        return <div
          key={ p.id }
          // container={{
          //   height: dimensions.height,
          //   width: dimensions.width,
          //   x: 100,
          //   y: 100
          // }}
          // location={{ x: p.position.x, y: p.position.y }}
          // status={ p.status }
          data-veloicty={ JSON.stringify(p.velocity) }
          data-direction={ JSON.stringify(p.direction) }
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '12px',
            height: '12px',
            borderRadius: '20px',
            background: p.status === 'infected' ? 'tomato'
              : p.status === 'cured' ? 'seagreen' 
                : 'lightblue',

            transform: `translate3d(${p.position.x}px, ${p.position.y}px, 0)`,
          }}
        />
      })
    }
    <p>{ dimensions.height }</p>
  </Stage>
}


Simulator.propTypes = {
  count: Number,
}
Simulator.defaultProps = {
  count: 1,
}



export default Simulator
