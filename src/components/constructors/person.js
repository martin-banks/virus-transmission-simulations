class Person {
  constructor ({ x, y, index, diameter, infected, status, moving, speed, width, height }) {
    this.infected = infected
    this.status = status
    this.infectedTime = infected ? new Date().getTime() : null
    this.moving = moving
    this.id = index
    this.diameter = diameter
    this.position = { x, y }
    this.velocity = {
      // x: P5.random(-1, 1) * speed,
      x: ((Math.random() - 0.5) * 2) * (speed),
      // y: P5.random(-1, 1) * speed,
      y: ((Math.random() - 0.5) * 2) * (speed),
    }
    this.order = 1
    this.minDist = diameter / 2
    this.canvas = { width, height }
  }

  move () {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    if ((this.position.x + (this.diameter / 2)) > this.canvas.width) {
      this.position.x = this.canvas.width - (this.diameter / 2)
      this.velocity.x *= -1
    } else if ((this.position.x - (this.diameter / 2)) < 0) {
      this.position.x = this.diameter / 2
      this.velocity.x *= -1
    }
    if ((this.position.y + (this.diameter / 2)) > this.canvas.height) {
      this.position.y = this.canvas.height - (this.diameter / 2)
      this.velocity.y *= -1
    } else if ((this.position.y - (this.diameter / 2)) < 0) {
      this.position.y = this.diameter / 2
      this.velocity.y *= -1
    }
  }

  // intersect (people) {
  //   // ? people is an array of Person objects craeted by this constructor
  //   if (!people) return console.error('people array is missing')
  //   if (this.status === 'dead') return
  //   for (let i = this.id + 1; i < population; i++) {
  //     if (this.id === i) return
  //     if (people[i].status === 'dead') continue

  //     let distanceX = people[i].position.x - this.position.x
  //     let distanceY = people[i].position.y - this.position.y
  //     // let distance = this.P5.sqrt((distanceX * distanceX) + (distanceY * distanceY))
  //     let distance = Math.sqrt((distanceX * distanceX) + (distanceY * distanceY))
  //     // let minDist = (people[i].diameter / 2) + (this.diameter / 2)

  //     if (distance < this.minDist) {
  //       // Handle update directions
  //       if (this.velocity.x > 0) {
  //         if (this.position.x > people[i].position.x) {
  //           people[i].velocity.x *= -1
  //         } else {
  //           this.velocity.x *= -1
  //         }
  //       } else {
  //         if (this.position.x > people[i].position.x) {
  //           this.velocity.x *= -1
  //         } else {
  //           people[i].velocity.x *= -1
  //         }
  //       }

  //       if (this.velocity.y > 0) {
  //         if (this.position.y > people[i].position.y) {
  //           people[i].velocity.y *= -1
  //         } else {
  //           this.velocity.y *= -1
  //         }
  //       } else {
  //         if (this.position.y > people[i].position.y) {
  //           this.velocity.y *= -1
  //         } else {
  //           people[i].velocity.y *= -1
  //         }
  //       }

  //       // Handle update infected
  //       if (!this.infected && !people[i].infected) {
  //         return
  //       } else if (this.infected && people[i].infected) {
  //         return

  //       } else if (this.status === 'normal' && people[i].status === 'infected') {
  //         this.infected = true
  //         this.status = 'infected'
  //         this.order = 3
  //         this.infectedTime = new Date().getTime()
  //         totals.normal--
  //         totals.infected++
  //         return

  //       } else if (this.status === 'infected' && people[i].status === 'normal') {
  //         people[i].infected = true
  //         people[i].status = 'infected'
  //         people[i].order = 3
  //         people[i].infectedTime = new Date().getTime()
  //         totals.normal--
  //         totals.infected++
  //         return
  //       }
  //     }
  //   }
  // }

  // statusUpdate () {
  //   if (this.status === 'normal') return
  //   if (this.status === 'infected') {
  //     const newStatus = random() < mortality ? 'dead' : 'cured'
  //     if (this.infectedTime && ((this.infectedTime + timeToCure) <= new Date().getTime())) {
  //       this.status = newStatus
  //       this.order = newStatus === 'dead' ? 0
  //         : newStatus === 'cured' ? 2
  //           : 1
  //       this.infected = false
  //       totals.infected--
  //       totals[newStatus]++
  //     }
  //   }
  // }

  display (P5) {
    console.log(this.id, P5)
    if (this.status === 'infected') {
      P5.fill(255, 0, 0)
    } else if (this.status === 'cured') {
      P5.fill(0, 255, 0)
    } else if (this.status === 'dead') {
      P5.fill(50)
    } else {
      P5.fill(255)
    }
    P5.ellipse(this.position.x, this.position.y, this.diameter, this.diameter)
    P5.noStroke()
  }
}

export default Person
