/*
 * size
 *  - String width/size hack
 *  (because measureText sucks)
 *
 * @param {string} font
 */
// eslint-disable-next-line no-extend-native
String.prototype.size = function (font) {
  var f = font || '12px arial'
  var o = document.createElement('div')
  var t = document.createTextNode(this)
  o.appendChild(t)
  o.style.position = 'absolute'
  o.style.float = 'left'
  o.style['white-space'] = 'nowrap'
  o.style.visibility = 'hidden'
  o.style.font = f
  document.body.appendChild(o)
  var w = o.clientWidth
  var h = o.clientHeight
  o.parentNode.removeChild(o)
  return { height: h, width: w }
}

/**
 * particle
 *  - creates a particle object with x,y / vx,vy
 *    particles have gravity of k to the mouse and v
 *    back to their original starting position.
 *
 * @param {object} parent
 * @param {object} params
 */
class Particle {
  constructor (parent, params) {
    this.parent = parent
    this.x = params.x
    this.y = params.y
    this.size = params.size
    this.color = params.color
    this.origX = params.x
    this.origY = params.y
    this.vx = params.vx || 0
    this.vy = params.vy || 0
    this.vMax = params.vMax || Math.random() * (5 - 2) + 2
    this.PI2 = Math.PI * 2
    this.orbit = {
      speed: params.orbit.speed || 3000
    }
  }

  // draw the particle
  draw () {
    var self = this

    self.parent.ctx.beginPath()
    self.parent.ctx.arc(self.x, self.y, self.size / 2, 0, self.PI2)
    self.parent.ctx.fillStyle = self.color
    self.parent.ctx.closePath()
    self.parent.ctx.fill()
  }

  // gravity animation physics
  update () {
    var self = this

    // set position based
    // on current velocity
    self.y += self.vy
    self.x += self.vx

    // TODO variation?
    // var variation = Math.random();
    var mouseForce = 15 // * variation;
    var originForce = 0.2 // * variation;

    var friction = 0.09 //* variation;

    // --- target positions --- //
    if (self.parent.mouse.x === 9999 || self.parent.mouse.y === 9999) {
      // origin
      if (self.x > self.origX) {
        self.vx -= originForce
      } else if (self.x < self.origX + 0.1 && self.x > self.origX - 0.1) {
        self.vx = 0
      } else {
        self.vx += originForce
      }
      if (self.y > self.origY) {
        self.vy -= originForce
      } else if (self.y < self.origY + 0.1 && self.y > self.origY - 0.1) {
        self.vy = 0
      } else {
        self.vy += originForce
      }
    } else {
      //  mouse
      var mouse = {}
      mouse.x = self.parent.mouse.x
      mouse.y = self.parent.mouse.y
      mouse.dx = self.x - mouse.x
      mouse.dy = self.y - mouse.y
      mouse.radius = Math.sqrt(Math.pow(mouse.dx, 2) + Math.pow(mouse.dy, 2))
      mouse.dTotal = Math.abs(mouse.dx) + Math.abs(mouse.dy)
      mouse.accX = ((Math.abs(mouse.dx) * 2) / mouse.dTotal) * (1 / mouse.radius) * mouseForce
      mouse.accY = ((Math.abs(mouse.dy) * 2) / mouse.dTotal) * (1 / mouse.radius) * mouseForce

      // apply acceleration
      if (mouse.dx < 0) {
        self.vx += mouse.accX
      } else {
        self.vx -= mouse.accX
      }
      if (mouse.dy < 0) {
        self.vy += mouse.accY
      } else {
        self.vy -= mouse.accY
      }

      // orbit the cursor
      if (mouse.radius < 20) {
        self.vy = 0
        self.vx = 0

        var currentTime = new Date().getTime()
        var passedTime = currentTime - self.parent.startTime
        var angle = self.PI2 * (passedTime / self.orbit.speed)

        self.x = self.x + Math.sin(angle)
        self.y = self.y + Math.cos(angle)
      }
    }

    // --- max velocity --- //
    if (self.vx > 0) {
      self.vx = self.vx > self.vMax ? self.vMax : self.vx
    } else {
      self.vx = self.vx < self.vMax * -1 ? self.vMax * -1 : self.vx
    }
    if (self.vy > 0) {
      self.vy = self.vy > self.vMax ? self.vMax : self.vy
    } else {
      self.vy = self.vy < self.vMax * -1 ? self.vMax * -1 : self.vy
    }

    //  --- friction --- //
    if (self.vx > 0) {
      self.vx -= friction
    } else if (self.vx < 0) {
      self.vx += friction
    }
    if (self.vy > 0) {
      self.vy -= friction
    } else if (self.vy < 0) {
      self.vy += friction
    }
  }
}

//
// particleText
//  - build a word on canvas that is made up of
//    tons of tiny rad gravitational particles
//
// @author Michael Roth <mroth@highbridgecreative.com>
// @version v0.0.3
//
class ParticleText {
  constructor (text = 'TEXT', params) {
    // text to be particlized
    this.text = text
    this.params = params

    // canvas
    this.id = params.canvas || 'canvas'
    this.canvas = null
    this.canvasWidth = params.canvasWidth
    this.canvasHeight = params.canvasHeight
    this.ctx = null

    // font
    this.font = {
      // basic font styles
      size: params.font.size || 12,
      family: params.font.family || 'helvetica',
      color: params.font.color || '#000000',
      weight: params.font.weight || 'bold'
    }

    // the mouse
    this.mouse = {
      x: 9999,
      y: 9999,
      d2c: 0
    }

    // general
    this.disableAnim = false
    this.animId = null
    this.startTime = null
    this.particles = []
    this.pixels = []
    this.density = params.density || 5
    this.size = params.size || 3
    this.width = 0
    this.height = 0
    this.center = {
      x: 0,
      y: 0
    }

    this.init()
  }

  /*
  * updateMousePos
  *  - get current mouse pos
  *
  * @param {object} e
  */
  updateMousePos (e) {
    var rect = this.canvas.getBoundingClientRect()
    this.mouse.x = e.clientX - rect.left
    this.mouse.y = e.clientY - rect.top
    return this.mouse
  }

  /*
  * mousemove
  *  - mouse move event functionality
  */
  mousemove (e) {
    var pos = this.updateMousePos(e)
    this.mouse.x = pos.x
    this.mouse.y = pos.y
  }

  /*
  * mouseout
  *  - mouse out event functionality
  */
  mouseout (e) {
    this.mouse.x = 9999
    this.mouse.y = 9999
  }

  /*
  * getOffset
  *  - get top/left offset of element
  *
  * @param {object} el
  */
  getOffset (el) {
    var x = 0
    var y = 0
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
      x += el.offsetLeft - el.scrollLeft
      y += el.offsetTop - el.scrollTop
      el = el.offsetParent
    }
    return { x: x, y: y }
  }

  /*
  * animate
  *  - animate the whole shebang
  *
  * @param {string} word
  */
  animate () {
    var self = this
    // update time
    var date = new Date()
    self.time = date.getTime()

    // ---- update ---- //
    var len = self.particles.length
    while (len > 0) {
      self.particles[len - 1].update()
      len--
    }

    // ---- clear ---- //
    self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height)

    // ---- re-render ---- //
    len = self.particles.length
    while (len > 0) {
      self.particles[len - 1].draw()
      len--
    }

    // diabled animations
    if (self.disableAnim) return true

    self.animId = requestAnimationFrame(function doAnim () {
      self.animate()
    })
  }

  /*
  * checkPixel
  *  - check if a pixel is defined and has an alpha
  *
  * @param {int} x
  * @param {int} y
  */
  checkPixel (y, x) {
    if (!this.pixels[y]) return true

    var pixel = this.pixels[y][x]

    if (typeof pixel === 'undefined') return true
    return pixel.a === 0
  }

  /*
  * rasterize
  *  - convert font pixel data into particles
  */
  rasterize () {
    var self = this
    // reset
    self.particles = []
    self.pizels = []

    // setup word
    self.ctx.fillStyle = self.font.color
    self.ctx.fillText(self.text, 0, self.height * 1.5)

    var imageData = self.ctx.getImageData(0, 0, self.canvas.width, self.canvas.height)
    self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height)

    // build bounding polygon
    var pixelData = imageData.data
    var len = pixelData.length
    for (var i = 0; i < len; i += 4) {
      var pixel = {
        r: pixelData[i],
        g: pixelData[i + 1],
        b: pixelData[i + 2],
        a: pixelData[i + 3]
      }

      // setup array if not yet created
      var x = (i / 4) % self.canvas.width
      var y = Math.floor(i / 4 / self.canvas.width)

      if (typeof self.pixels[y] === 'undefined') {
        self.pixels[y] = []
      }
      self.pixels[y][x] = pixel
    }

    var yLen, xLen
    // create the particles
    for (y = 0, yLen = self.pixels.length; y < yLen; y++) {
      for (x = 0, xLen = self.pixels[y].length; x < xLen; x++) {
        // transparent pixel?
        if (self.checkPixel(y, x)) {
          continue
        }

        var speed = (x % 8) * 1000 + 1000
        self.particles.push(
          new Particle(self, {
            color: self.font.color,
            size: self.size * (self.pixels[y][x].a / 255),
            x: x * self.density + self.width + self.width / 2,
            y: y * self.density - (self.height * self.density) / 2,
            orbit: {
              speed: speed + 1000
            }
          })
        )
      }
    }
  }

  /*
  * init
  *  - set er up
  */
  init () {
    var self = this

    // setup
    var font = self.font.weight + ' ' + self.font.size + 'px ' + self.font.family
    self.canvas = document.getElementById(self.id)
    self.width = self.text.size(font).width
    self.height = self.text.size(font).height
    self.canvas.width =
      self.canvasWidth || self.width * self.density + self.width * self.density * 0.4
    self.canvas.height =
      self.canvasHeight || self.height * self.density + self.height * self.density * 0.4
    self.ctx = self.canvas.getContext('2d')
    self.ctx.font = font

    // canvas position
    var canvasOffset = self.getOffset(self.canvas)
    self.canvas.x = canvasOffset.x
    self.canvas.y = canvasOffset.y

    // center of word
    self.center = {
      x: self.canvas.x + (self.width * self.density) / 2,
      y: self.canvas.y + (self.height * self.density) / 2
    }

    // bind events
    self.canvas.addEventListener('mousemove', self.mousemove.bind(self))
    self.canvas.addEventListener('mouseout', self.mouseout.bind(self))

    // rasterize the word
    self.rasterize()

    // start animations
    var date = new Date()
    self.startTime = date.getTime()
    self.animate()
  }

  /**
   * destroy
   *  - unbind events / unintialize
   */
  destroy () {
    var self = this

    // clear bound events
    if (self.animId) {
      cancelAnimationFrame(self.animId)
    }
    self.canvas.removeEventListener('mousemove', self.mousemove)
    self.canvas.removeEventListener('mouseout', self.mouseout)

    // reset canvas
    var canvas = document.getElementById(self.id)
    if (canvas && canvas.parentNode) {
      var parent = canvas.parentNode
      parent.removeChild(canvas)
      var newCanvas = document.createElement('canvas')
      newCanvas.id = self.id
      parent.appendChild(newCanvas)
    }
  }
}

// export default ParticleText
export default ParticleText
