
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
          return

        } else if (this.status === 'infected' && people[i].status === 'normal') {
          people[i].infected = true
          people[i].status = 'infected'
          people[i].order = 3
          people[i].infectedTime = new Date().getTime()
          totals.normal--
          totals.infected++
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
      }
    }
  }

  display (person) {
    if (this.status === 'infected') {
      fill(255, 0, 0)
    } else if (this.status === 'cured') {
      fill(0, 255, 0)
    } else if (this.status === 'dead') {
      fill(50)
    } else {
      fill(255)
    }
    ellipse(this.position.x, this.position.y, this.diameter, this.diameter)
    noStroke()
  }
}

export default Person
