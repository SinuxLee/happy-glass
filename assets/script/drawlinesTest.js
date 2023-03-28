const WorldController = require('WorldController')
let o = 0
let c = false
let a = cc.v2(0, 0)
let l = cc.v2(0, 0)
let r = 0
let s = cc.v2(0, 0)
let d = cc.v2(0, 0)
let v = false
let h = []
let p = WorldController.totalLength

cc.Class({
  extends: cc.Component,

  onLoad () {
    cc.PhysicsAABBQueryCallback.prototype.ReportFixture = function(e) {
      if (this._isPoint) {
        if (e.TestPoint(this._point)) return this._fixtures.push(e), false
      } else this._fixtures.push(e)
      return true
    }

    const e = cc.director.getPhysicsManager()
    e.enabled = true

    new cc.Node('err' + r)
    this.node.on(cc.Node.EventType.TOUCH_START, (n) => {
      if (p > 0) {
        if (c || r != 0) {
          l = n.getLocation()
          a = this.node.convertToNodeSpaceAR(l)
          const u = this.testrect(l.x, l.y)
          this.wideRaycast(d.x, d.y, l.x, l.y)
          if (u && !v) {
            const f = Math.sqrt(Math.pow(a.x - s.x, 2) + Math.pow(a.y - s.y, 2))
            const g = this.node.getChildByName('line' + r)
            g.getComponent(cc.Graphics).lineTo(a.x, a.y)
            g.getComponent(cc.Graphics).stroke()
            g.getComponent(cc.Graphics).moveTo(a.x, a.y)
            for (let m = 0; m < f / 10; m++) {
              const y = g.addComponent(cc.PhysicsCircleCollider)
              y.offset = cc.v2(s.x + 10 * m * (a.x - s.x) / f, s.y + 10 * m * (a.y - s.y) / f)
              y.radius = 4.5
              y.density = 1
              y.apply()
            }
            s = a
            d = l
            o += f
            p -= f
            cc.find('Canvas/lineLength').width = p / WorldController.totalLength * 240
          }
          h.push(a)
        } else {
          c = true
          n.getID()
          l = n.getLocation()
          a = this.node.convertToNodeSpaceAR(l)
          s = a
          d = l
          if (e.testAABB(cc.rect(a.x, a.y, 4.5, 4.5)).length != 0) return void (c = false)

          v = false, r++
          const C = new cc.Node('line' + r)
          const x = C.addComponent(cc.Graphics)
          const w = C.addComponent(cc.RigidBody)
          this.node.addChild(C)
          w.gravityScale = 0
          w.type = cc.RigidBodyType.Static
          x.lineCap = cc.Graphics.LineCap.ROUND
          x.lineWidth = 9
          x.moveTo(a.x, a.y)
          h.push(a)
        }
      }
    })
  },

  clearLines () {
    h = []
    this.node.getChildByName('line1') && this.node.getChildByName('line1').destroy()
    cc.find('Canvas/lineLength').width = 240
    p = WorldController.totalLength
    o = 0
    r = 0
    c = false
    this.getWaterNode() && this.getWaterNode().removeAllChildren()
  },

  getWaterNode () {
    return cc.find('Canvas/level/out/waterNode') ? cc.find('Canvas/level/out/waterNode') : cc.find('Canvas/level/outTop/waterNode') ? cc.find('Canvas/level/outTop/waterNode') : cc.find('Canvas/level/outRight/waterNode') ? cc.find('Canvas/level/outRight/waterNode') : void 0
  },

  getLinesData () {
    return h
  },

  startTest () {
    console.log('water!!!!!!!!!!!!')
    if (p > 0 && o > 0) {
      const e = this.node.getChildByName('line1')
      e.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic
      e.getComponent(cc.RigidBody).gravityScale = 3.5
      e.group = 'line'
      this.getWaterNode().getComponent('water').spawnWater()
    }
  },

  testrect (e, t) {
    const n = cc.director.getPhysicsManager()
    const i = n.testPoint(cc.v2(e - 4.5, t - 4.5))
    if (i == null || i.node.name == 'line' + r) {
      const o = n.testPoint(cc.v2(e - 4.5, t + 4.5))
      if (o == null || o.node.name == 'line' + r) {
        const c = n.testPoint(cc.v2(e + 4.5, t - 4.5))
        if (c == null || c.node.name == 'line' + r) {
          const a = n.testPoint(cc.v2(e + 4.5, t + 4.5))
          if (a == null || a.node.name == 'line' + r) {
            const l = n.testPoint(cc.v2(e, t))
            if (l == null || l.node.name == 'line' + r) return true
          }
        }
      }
    }
    return false
  },

  wideRaycast (e, t, n, i) {
    const o = cc.director.getPhysicsManager()
    const c = Math.sqrt(Math.pow(n - e, 2) + Math.pow(i - t, 2))
    const a = 4.5 * -(i - t) / c
    const l = 4.5 * (n - e) / c
    const s = o.rayCast(cc.v2(e - a, t - l), cc.v2(n - a, i - l), cc.RayCastType.Any)
    if (s.length > 0) {
      for (var d = 0; d < s.length; d++) {
        if (s[d].collider.node.name != 'line' + r) {
          v = true
          break
        }
        v = false
      }
    }
    const h = o.rayCast(cc.v2(e + a, t + l), cc.v2(n + a, i + l), cc.RayCastType.Any)
    if (h.length > 0) {
      for (d = 0; d < h.length; d++) {
        if (h[d].collider.node.name != 'line' + r) {
          v = true
          break
        }
        v = false
      }
    }
  }
})
