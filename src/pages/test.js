import React from "react";
import {
  useState,
  useRef,
  useMutationEffect,
  useLayoutEffect
} from "react";
import ReactDOM from "react-dom";

// import "./styles.css";

function Comp () {
  let [value, setValue] = useState(0);
  
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      setValue(v => v + 0.1)
    })
  })
  return <h1>{ value }</h1>
}

function App() {

  function resetValue() {

  }

  return (
    <div className="App">

      <Comp />
      <button onClick={resetValue}>
        Reset Value
      </button>
    </div>
  );
}

// const rootElement = document.getElementById(
//   "root"
// );
// ReactDOM.render(<App />, rootElement);
export default App
