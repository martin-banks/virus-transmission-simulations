// ? Configurable options
let population = 500
let distancing = 0 // (pct of population that does not move)
let timeToCure = 4 * 1000 // (ms)
let mortality = 0.1 // (pct)


const speed = 2.5
// const timeToKill = 8 * 1000 // (ms)
const simulationLength = 20 * 1000 // (ms)
const sessionTick = 500 // How often does the chart update (ms)


// ? UI elments
const dump = document.querySelector('pre.dump')
const chartContainer = document.querySelector('div.chart')
const maxDeadLine = document.querySelector('.chartContainer hr.expectedDead')
const startButton = document.querySelector('button#start')
const stopButton = document.querySelector('button#stop')
const particleSystem = document.querySelector('#particleSystem')
const settings = document.querySelector('.settings')

const inputs = {
  distancing: document.querySelector('#distancing input'),
  population: document.querySelector('#population input'),
  timeToCure: document.querySelector('#timeToCure input'),
  mortality: document.querySelector('#mortality input'),
}

const statElements = {
  normal: document.querySelector('.stat__item--normal p'),
  infected: document.querySelector('.stat__item--infected p'),
  cured: document.querySelector('.stat__item--cured p'),
  dead: document.querySelector('.stat__item--dead p'),
}

// ? System/session variables
function canvasHeight (w) {
  return w * 0.75 
}

const canvasSize = { // TODO Set from designated area
  w: particleSystem.offsetWidth, // 400,
  h: canvasHeight(particleSystem.offsetWidth),
}
let diameter = Math.round(Math.min(canvasSize.w, canvasSize.h) / 80)
let people = []
const totals = {
  normal: population,
  infected: 0,
  cured: 0,
  dead: 0,
}
let running = false
let sessionTime = 0
const collisions = true

let windowResizeTimer = null
// let systemCanvas = null

let showConfig = true
let showChart = false



// let theme = typeof window !== 'undefined'
//   ? (window.matchMedia('(prefers-color-scheme: light)').matches
//     ? 'dark' : 'dark')
//       : 'dark'

window.addEventListener('resize', () => {
  if (windowResizeTimer) {
    clearInterval(windowResizeTimer)
  }
  windowResizeTimer = setTimeout(() => {
    const canvas = document.querySelector('canvas')
    canvas.style.display = 'none'
    // setTimeout(() => {
      canvasSize.w = particleSystem.offsetWidth
      canvasSize.h = canvasHeight(particleSystem.offsetWidth)
      resizeCanvas(canvasSize.w, canvasSize.h)
      diameter = Math.round(Math.min(canvasSize.w, canvasSize.h) / 80)
      canvas.style.display = 'block'
      stop()
      clear()
  }, 500)
})

function updateStats () {
  Object.keys(statElements).forEach(key => {
    statElements[key].innerText = totals[key]
  })
}

function setDistancing () {
  if (this && this.value) {
    distancing = parseInt(this.value, 10) / 100
  } else {
    inputs.distancing.value = distancing * 100
  }
  inputs.distancing.parentElement.querySelector('span').innerText = Math.round(distancing * 100)
}

function setPopulation () {
  if (this && this.value) {
    population = parseInt(this.value, 10)
  } else {
    inputs.population.value = population
  }
  inputs.population.parentElement.querySelector('span').innerText = Math.round(population)
}

function setCure () {
  if (this && this.value) {
    timeToCure = parseInt(this.value, 10) * 1000
  } else {
    inputs.timeToCure.value = timeToCure / 1000
  }
  inputs.timeToCure.parentElement.querySelector('span').innerText = Math.round(timeToCure / 1000)
}

function setMortality () {
  if (this && this.value) {
    mortality = parseInt(this.value, 10) / 100
  } else {
    inputs.mortality.value = mortality * 100
  }
  inputs.mortality.parentElement.querySelector('span').innerText = Math.round(mortality * 100)
}

inputs.distancing.addEventListener('change', setDistancing)
inputs.population.addEventListener('change', setPopulation)
inputs.timeToCure.addEventListener('change', setCure)
inputs.mortality.addEventListener('change', setMortality)

setDistancing()
setPopulation()
setCure()
setMortality()


// maxDeadLine.style.top = `${chartContainer.offsetHeight - (chartContainer.offsetHeight * mortality)}px`

let chart = []
function barTemplate () {
  return `<div class="chart__bar"><!--
    --><div class="chart__bar--section cured" style="height: ${totals.cured && totals.cured / population * 100}px" ></div><!--
    --><div class="chart__bar--section healthy" style="height: ${totals.normal && totals.normal / population * 100}px" ></div><!--
    --><div class="chart__bar--section infected" style="height: ${totals.infected && totals.infected / population * 100}px" ></div><!--
    --><div class="chart__bar--section dead" style="height: ${totals.dead && totals.dead / population * 100}px" ></div><!--
  --></div>`
}

function updateChart () {
  if (!running) return
  sessionTime += sessionTick
  if (sessionTime > simulationLength) {
    running = false
    return
  }
  chart.push(barTemplate())
  chartContainer.innerHTML = chart.join('')
  setTimeout(() => {
    window.requestAnimationFrame(updateChart)
  }, sessionTick)
}
// ! only call on simulation start
// window.requestAnimationFrame(updateChart)


class Person {
  constructor ({ x, y, index, diameter, infected, status, moving }) {
    this.infected = infected
    this.status = status
    this.infectedTime = infected ? new Date().getTime() : null
    this.moving = moving
    this.id = index
    this.diameter = diameter
    this.position = { x, y }
    this.velocity = {
      x: random(-1, 1) * speed,
      y: random(-1, 1) * speed,
    }
    this.order = 1
  }

  move () {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    if ((this.position.x + (this.diameter / 2)) > width) {
      this.position.x = width - (this.diameter / 2)
      this.velocity.x *= -1
    } else if ((this.position.x - (this.diameter / 2)) < 0) {
      this.position.x = this.diameter / 2
      this.velocity.x *= -1
    }
    if ((this.position.y + (this.diameter / 2)) > height) {
      this.position.y = height - (this.diameter / 2)
      this.velocity.y *= -1
    } else if ((this.position.y - (this.diameter / 2)) < 0) {
      this.position.y = this.diameter / 2
      this.velocity.y *= -1
    }
  }

  setDiameter (d) {
    this.diameter = d
  }

  intersect () {
    if (this.status === 'dead') return
    for (let i = this.id + 1; i < population; i++) {
      if (this.id === i) return
      if (people[i].status === 'dead') continue

      let distanceX = people[i].position.x - this.position.x
      let distanceY = people[i].position.y - this.position.y
      let distance = sqrt((distanceX * distanceX) + (distanceY * distanceY))
      let minDist = (people[i].diameter / 2) + (this.diameter / 2)

      if (distance < minDist) {
        if (collisions) {
          // Handle update directions
          if (this.velocity.x > 0) {
            if (this.position.x > people[i].position.x) {
              people[i].velocity.x *= -1
            } else {
              this.velocity.x *= -1
            }
          } else {
            if (this.position.x > people[i].position.x) {
              this.velocity.x *= -1
            } else {
              people[i].velocity.x *= -1
            }
          }
  
          if (this.velocity.y > 0) {
            if (this.position.y > people[i].position.y) {
              people[i].velocity.y *= -1
            } else {
              this.velocity.y *= -1
            }
          } else {
            if (this.position.y > people[i].position.y) {
              this.velocity.y *= -1
            } else {
              people[i].velocity.y *= -1
            }
          }
        }

        // Handle update infected
        if (!this.infected && !people[i].infected) {
          return
        } else if (this.infected && people[i].infected) {
          return

        } else if (this.status === 'normal' && people[i].status === 'infected') {
          this.infected = true
          this.status = 'infected'
          this.order = 3
          this.infectedTime = new Date().getTime()
          totals.normal--
          totals.infected++
          updateStats()
          return

        } else if (this.status === 'infected' && people[i].status === 'normal') {
          people[i].infected = true
          people[i].status = 'infected'
          people[i].order = 3
          people[i].infectedTime = new Date().getTime()
          totals.normal--
          totals.infected++
          updateStats()
          return
        }
      }
    }
  }

  statusUpdate () {
    if (this.status === 'normal') return
    if (this.status === 'infected') {
      const newStatus = random() < mortality ? 'dead' : 'cured'
      if (this.infectedTime && ((this.infectedTime + timeToCure) <= new Date().getTime())) {
        this.status = newStatus
        this.order = newStatus === 'dead' ? 0
          : newStatus === 'cured' ? 2
            : 1
        this.infected = false
        totals.infected--
        totals[newStatus]++
        updateStats()
      }
    }
  }

  display (person) {
    if (this.status === 'infected') {
      fill(255, 0, 0)
    } else if (this.status === 'cured') {
      fill(0, 255, 0)
    } else if (this.status === 'dead') {
      fill(200, 200, 200, 50)
    } else {
      fill(100, 200, 250)
    }
    ellipse(this.position.x, this.position.y, this.diameter, this.diameter)
    noStroke()
  }
}

function createSimulation () {
  clear()
  for (let i = 0; i < population; i++) {
    people.push(new Person({
      x: random(width - (diameter * 2)) + (diameter),
      y: random(height - (diameter * 2)) + (diameter),
      index: i,
      diameter, // : diameter + (10 * i),
      infected: i < 1,
      status: i < 1 ? 'infected' : 'normal',
      moving: distancing > 0 ? (i < population - (population * distancing)) : true,
    }))
  }
}


function setup () {
  createCanvas(canvasSize.w, canvasSize.h)
    .parent('particleSystem')
  // createSimulation()
}

function updateDump () {
  dump.innerText = JSON.stringify({
    settings: {
      population,
      distancing,
      timeToCure,
      mortality,
    },
    stats: {
      normal: totals.normal,
      infected: totals.infected,
      cured: totals.cured,
      dead: totals.dead,
    },
    sessionTime,
  }, null, 2)
}

updateDump()



function draw () {
  if (running) {
    // background(0)
    clear()
    people.forEach(function (person, i) {
        if (person.moving && person.status !== 'dead'){
          person.move()
        }
        person.intersect()
        person.statusUpdate()
        person.display(person)
      })
    updateDump()
  } else {
    stop()
  }
}

function showControls () {
  startButton.style.display = 'block'
  stopButton.style.display = 'none'
  settings.style.display = 'block'
}
function hideControls () {
  startButton.style.display = 'none'
  stopButton.style.display = 'block'
  settings.style.display = 'none'
}

function stop () {
  running = false
  noLoop()
  showControls()
  // ? Clears canvas to grey
  // setTimeout(() => {
  //   background(100)
  // }, 3000)
}

function reset () {
  people = []
  chart = []
  sessionTime = 0
  Object.keys(totals).forEach(k => totals[k] = 0)
  totals.normal = population
  // background(0)
  clear()
}

function start () {
  reset()
  hideControls()
  createSimulation()
  running = true
  loop()
  window.requestAnimationFrame(updateChart)
}

startButton.addEventListener('click', start)
stopButton.addEventListener('click', stop)


