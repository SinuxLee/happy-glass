const userType = require('userType')
const LocalStorageData = require('LocalStorageData')
const WorldController = require('WorldController')
let color = cc.color(0, 0, 0)

cc.Class({
  extends: cc.Component,

  spawnWater () {
    color = isNaN(LocalStorageData.get('selectWater')) ? userType.waterColor[0] : userType.waterColor[LocalStorageData.get('selectWater')]
    WorldController.tryWater && (color = userType.tryWaterColor[WorldController.tryWaterNum])

    let counter = 0
    let t = 0
    this.node.parent.rotation == 90 ? t = 1 : this.node.parent.rotation == 180 && (t = 2),
    this.schedule(() => {
      const nodeWater = new cc.Node('water' + counter++)
      nodeWater.position = cc.v2(0, 0 + 50 * Math.random(0, 1))
      nodeWater.group = 'water'

      const body = nodeWater.addComponent(cc.RigidBody)
      const collider = nodeWater.addComponent(cc.PhysicsCircleCollider)
      collider.radius = 12
      collider.tag = 111
      collider.friction = 0
      body.gravityScale = 3.5
      body.type = cc.RigidBodyType.Dynamic
      if (t == 1) {
        body.linearVelocity.y = -300
        body.linearDamping = 1
      } else if (t == 2) {
        body.linearVelocity.x = -300
        body.linearDamping = 1
      } else {
        body.linearVelocity.x = 300
        body.linearDamping = 1
      }
      body.enabledContactListener = true
      nodeWater.parent = this.node
    }, 0.05, 36)

    this.schedule(() => {
      cc.find('Canvas/music').getComponent('musicManager').waterAudio()
    }, 0.2, 9)
  },

  metaball (e, t, n, a) {
    const o = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 2.4
    const c = Math.PI / 2
    const i = n.sub(a).mag()
    const s = e + 1.9 * t
    const r = (s - i) / s * 2.2 + 0.4
    let d = void 0
    let l = void 0
    if (e === 0 || t === 0 || i > s || i <= Math.abs(e - t)) return null
    i < e + t ? (d = Math.acos((e * e + i * i - t * t) / (2 * e * i)), l = Math.acos((t * t + i * i - e * e) / (2 * t * i))) : (d = 0, l = 0)
    let h = n.sub(a).angle(cc.v2(-1, 0))
    n.y > a.y && (h = -h)
    const p = Math.acos((e - t) / i)
    const g = h + d + (p - d) * r
    const m = h - d - (p - d) * r
    const v = h + Math.PI - l - (Math.PI - l - p) * r
    const u = h - Math.PI + l + (Math.PI - l - p) * r
    const C = this.getVector(n, g, e)
    const w = this.getVector(n, m, e)
    const y = this.getVector(a, v, t)
    const f = this.getVector(a, u, t)
    const N = e + t
    const S = Math.min(r * o, C.sub(y).mag() / N) * Math.min(1, 2 * i / (e + t))
    const b = e * S
    const R = t * S
    return {
      pos1: C,
      pos2: w,
      pos3: y,
      pos4: f,
      con1: this.getVector(C, g - c, b),
      con2: this.getVector(w, m + c, b),
      con3: this.getVector(y, v + c, R),
      con4: this.getVector(f, u - c, R)
    }
  },

  getVector (e, t, n) {
    const a = n * Math.cos(t)
    const o = n * Math.sin(t)
    return cc.v2(e.x + a, e.y + o)
  },

  update (e) {
    const gl = this.node.getComponent(cc.Graphics)
    this.balls = this.node.children
    gl.clear()
    gl.fillColor = color

    for (let n = 0; n < this.balls.length; n++) {
      const ball = this.balls[n]
      const pos = ball.position
      const radius = 1.3 * ball.getComponent(cc.PhysicsCircleCollider).radius
      gl.circle(pos.x, pos.y, radius)
      gl.fill()

      for (let s = n; s < this.balls.length; s++) {
        if (n === s) continue

        const otherBall = this.balls[s]
        const otherPos = otherBall.position
        const otherRadius = 1.2 * otherBall.getComponent(cc.PhysicsCircleCollider).radius

        let metaball = null
        if (pos.y < otherPos.y) metaball = this.metaball(radius, otherRadius, pos, otherPos)
        else metaball = this.metaball(otherRadius, radius, otherPos, pos)
        if (metaball == null) continue

        gl.moveTo(metaball.pos1.x, metaball.pos1.y)
        gl.bezierCurveTo(
          metaball.con1.x, metaball.con1.y,
          metaball.con3.x, metaball.con3.y,
          metaball.pos3.x, metaball.pos3.y
        )

        gl.lineTo(metaball.pos4.x, metaball.pos4.y)
        gl.bezierCurveTo(
          metaball.con4.x, metaball.con4.y,
          metaball.con2.x, metaball.con2.y,
          metaball.pos2.x, metaball.pos2.y
        )

        gl.lineTo(metaball.pos1.x, metaball.pos1.y)
        gl.fill()
      }
    }
  }
})
