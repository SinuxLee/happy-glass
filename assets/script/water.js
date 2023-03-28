const a = require('userType')
const o = require('LocalStorageData')
const c = require('WorldController')
let i = cc.color(0, 0, 0)
cc.Class({
  extends: cc.Component,
  properties: {},
  onLoad: function () {},
  spawnWater: function () {
    i = isNaN(o.get('selectWater')) ? a.waterColor[0] : a.waterColor[o.get('selectWater')]
    c.tryWater && (i = a.tryWaterColor[c.tryWaterNum])
    let e = 0
    let t = 0
    this.node.parent.rotation == 90 ? t = 1 : this.node.parent.rotation == 180 && (t = 2),
    this.schedule(function () {
      const n = new cc.Node('water' + e++)
      n.position = cc.v2(0, 0 + 50 * Math.random(0, 1)), n.group = 'water'
      const a = n.addComponent(cc.RigidBody)
      const o = n.addComponent(cc.PhysicsCircleCollider)
      o.radius = 12, o.tag = 111, o.friction = 0, a.gravityScale = 3.5, a.type = cc.RigidBodyType.Dynamic, t == 1 ? (a.linearVelocity.y = -300, a.linearDamping = 1) : t == 2 ? (a.linearVelocity.x = -300, a.linearDamping = 1) : (a.linearVelocity.x = 300, a.linearDamping = 1), a.enabledContactListener = !0, n.parent = this.node
    }, 0.05, 36), this.schedule(function () {
      cc.find('Canvas/music').getComponent('musicManager').waterAudio()
    }, 0.2, 9)
  },
  metaball: function (e, t, n, a) {
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
  getVector: function (e, t, n) {
    const a = n * Math.cos(t)
    const o = n * Math.sin(t)
    return cc.v2(e.x + a, e.y + o)
  },
  update: function (e) {
    const t = this.node.getComponent(cc.Graphics)
    this.balls = this.node.children, t.clear(), t.fillColor = i
    for (let n = 0; n < this.balls.length; n++) {
      const a = this.balls[n]
      const o = a.position
      const c = 1.3 * a.getComponent('cc.PhysicsCircleCollider').radius
      t.circle(o.x, o.y, c), t.fill()
      for (let s = n; s < this.balls.length; s++) {
        if (n !== s) {
          const r = this.balls[s]
          const d = r.position
          const l = 1.2 * r.getComponent('cc.PhysicsCircleCollider').radius
          let h = null;
          (h = o.y < d.y ? this.metaball(c, l, o, d) : this.metaball(l, c, d, o)) && (t.moveTo(h.pos1.x, h.pos1.y), t.bezierCurveTo(h.con1.x, h.con1.y, h.con3.x, h.con3.y, h.pos3.x, h.pos3.y), t.lineTo(h.pos4.x, h.pos4.y), t.bezierCurveTo(h.con4.x, h.con4.y, h.con2.x, h.con2.y, h.pos2.x, h.pos2.y), t.lineTo(h.pos1.x, h.pos1.y), t.fill())
        }
      }
    }
  }
})
