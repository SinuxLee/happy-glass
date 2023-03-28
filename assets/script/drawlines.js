const WorldController = require('WorldController')
const userType = require('userType')
const LocalStorageData = require('LocalStorageData')
let i = 0
let s = 0
let r = false
let d = cc.v2(0, 0)
let l = cc.v2(0, 0)
let h = false
let p = 0
let g = 0
let m = cc.v2(0, 0)
let v = cc.v2(0, 0)
let u = false
const C = ['moveBox1', 'moveBox2', 'moveBox3', 'moveBox4', 'moveBox5', 'glass']

cc.Class({
  extends: cc.Component,
  properties: {
    percentShow: cc.Label,
    penSprite: {
      default: [],
      type: cc.SpriteFrame
    },
    penNode: cc.Node
  },

  onLoad () {
    cc.PhysicsAABBQueryCallback.prototype.ReportFixture = function(e){
      if (e.GetBody(), this._isPoint) {
        if (e.TestPoint(this._point)) return this._fixtures.push(e), false
      } else this._fixtures.push(e)
      return true
    }

    const e = cc.director.getPhysicsManager()
    e.enabled = true
    p = 0
    i = 0
    s = WorldController.totalLength

    const n = new cc.Node('err' + p)
    this.node.on(cc.Node.EventType.TOUCH_START, (t) => {
      if (s && !r) {
        r = true
        g = t.getID()
        WorldController.currentLevel == 0 && (cc.find('Canvas/UILayer/hand').stopAllActions(), cc.find('Canvas/UILayer/hand').active = false)
        l = t.getLocation()
        d = this.node.convertToNodeSpaceAR(l)
        m = d
        v = l
        if (e.testAABB(cc.rect(d.x, d.y, 4.5, 4.5)).length != 0) return void (r = false)

        h = true
        u = false
        p++
        const n = new cc.Node('line' + p)
        const i = n.addComponent(cc.Graphics)
        const C = n.addComponent(cc.RigidBody)
        this.node.addChild(n)
        C.gravityScale = 0
        C.type = cc.RigidBodyType.Static
        i.strokeColor = userType.penColor[LocalStorageData.get('selectPen')]
        i.lineCap = cc.Graphics.LineCap.ROUND
        i.lineWidth = 9
        i.moveTo(d.x, d.y)
        this.node.getComponent('drawlines').penNode.getComponent(cc.Sprite).spriteFrame = this.node.getComponent('drawlines').penSprite[LocalStorageData.get('selectPen')]
        this.node.getComponent('drawlines').penNode.position = d
        this.node.getComponent('drawlines').penNode.active = true
        this.node.getComponent('drawlines').penNode.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(0.2, 15), cc.rotateTo(0.2, -15))))
        cc.find('Canvas/UILayer/btnLayer/tishiBtn').getComponent(cc.Button).interactable = false
        cc.find('Canvas/UILayer/btnLayer/drawAdd').getComponent(cc.Button).interactable = false
        cc.find('Canvas/UILayer/btnLayer/tryItem').getComponent(cc.Button).interactable = false
      }
    })
    
    this.node.on(cc.Node.EventType.TOUCH_MOVE, (e) =>{
      if (h) {
        if (g === e.getID()) {
          l = e.getLocation()
          d = this.node.convertToNodeSpaceAR(l)
          if (s <= 0) return (C = this.node.getChildByName('line' + p)).getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic, C.getComponent(cc.RigidBody).gravityScale = 3.5, C.group = 'line', void (WorldController.waterIsSpawn || (WorldController.waterIsSpawn = true, WorldController.frames = cc.director.getTotalFrames(), WorldController.begin = true, this.getWaterNode().getComponent('water').spawnWater()))
          
          b = this.testrect(l.x, l.y)
          this.wideRaycast(v.x, v.y, l.x, l.y) 
          if (b && !u) {
            var C;
            const w = Math.sqrt(Math.pow(d.x - m.x, 2) + Math.pow(d.y - m.y, 2))
            (C = this.node.getChildByName('line' + p)).getComponent(cc.Graphics).lineTo(d.x, d.y)
            C.getComponent(cc.Graphics).stroke()
            C.getComponent(cc.Graphics).moveTo(d.x, d.y)
            if (w > 8) {
              if (w < 10)(N = C.addComponent(cc.PhysicsCircleCollider)).offset = cc.v2(d.x, d.y), N.radius = 4.5, N.density = 1, N.apply()
              else {
                for (let y = w / 10, f = 1; f < y; f++)(N = C.addComponent(cc.PhysicsCircleCollider)).offset = cc.v2(m.x + 10 * f * (d.x - m.x) / w, m.y + 10 * f * (d.y - m.y) / w), N.radius = 4.5, N.density = 1, N.apply()
                
                var N;
                (N = C.addComponent(cc.PhysicsCircleCollider)).offset = cc.v2(d.x, d.y)
                N.radius = 4.5
                N.density = 1
                N.apply()
              }
              m = d
              v = l
              i += w
              (s -= w) / WorldController.totalLength * 240 > 0 ? (cc.find('Canvas/UILayer/pen/lineLength').width = s / WorldController.totalLength * 240, WorldController.totalLength == 3e3 ? this.percentShow.string = (s / WorldController.totalLength * 200).toFixed(0) + '%' : this.percentShow.string = (s / WorldController.totalLength * 100).toFixed(0) + '%') : (cc.find('Canvas/UILayer/pen/lineLength').width = 0, this.percentShow.string = '0%')
            }

            cc.find('Canvas/music').getComponent('musicManager').penAudio()
            this.node.getComponent('drawlines').penNode.position = d
            this.node.getComponent('drawlines').penNode.active = true
          } else {
            const S = n.addComponent(cc.Graphics)
            S.getComponent(cc.Graphics).clear()
            S.getComponent(cc.Graphics).moveTo(m.x, m.y)
            S.getComponent(cc.Graphics).strokeColor = cc.color(255, 0, 0)
            S.getComponent(cc.Graphics).lineTo(d.x, d.y)
            S.getComponent(cc.Graphics).stroke()
          }
        }
      } else if (!r) {
        var b
        r = true
        g = e.getID()
        l = e.getLocation()
        d = this.node.convertToNodeSpaceAR(l)
        m = d
        v = l

        if (!(b = this.node.testrect(l.x, l.y))) return void (r = false)
        h = true
        u = false
        p++
        const R = new cc.Node('line' + p)
        const L = R.addComponent(cc.Graphics)
        const A = R.addComponent(cc.RigidBody)
        this.node.addChild(R)
        A.gravityScale = 0
        A.type = cc.RigidBodyType.Static
        L.strokeColor = userType.penColor[LocalStorageData.get('selectPen')]
        L.lineCap = cc.Graphics.LineCap.ROUND
        L.lineWidth = 9
        L.moveTo(d.x, d.y)
        this.node.getComponent('drawlines').penNode.getComponent(cc.Sprite).spriteFrame = this.node.getComponent('drawlines').penSprite[LocalStorageData.get('selectPen')]
        this.node.getComponent('drawlines').penNode.position = d
        this.node.getComponent('drawlines').penNode.active = true
        this.node.getComponent('drawlines').penNode.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(0.2, 15), cc.rotateTo(0.2, -15))))
        cc.find('Canvas/UILayer/btnLayer/tishiBtn').getComponent(cc.Button).interactable = false
        cc.find('Canvas/UILayer/btnLayer/drawAdd').getComponent(cc.Button).interactable = false
        cc.find('Canvas/UILayer/btnLayer/tryItem').getComponent(cc.Button).interactable = false
      }
    })
    
    this.node.on(cc.Node.EventType.TOUCH_END, (e) =>{
      if (h && g === e.getID()) {
        if (s > 0 && i > 0) {
          const n = this.node.getChildByName('line' + p)
          n.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic
          n.getComponent(cc.RigidBody).gravityScale = 3.5
          n.group = 'line'
          WorldController.waterIsSpawn || (WorldController.waterIsSpawn = true, this.getWaterNode().getComponent('water').spawnWater())
          this.node.parent.children.forEach( (e) =>{
            for (let t = 0; t < C.length; t++) {
              if (e.name == C[4]) return void (e.children[0].getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic)
              e.name == C[t] && (e.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic)
            }
          })

          WorldController.frames = cc.director.getTotalFrames()
          WorldController.begin = true
        }
        cc.find('Canvas/music').getComponent('musicManager').stopPenAudio()
        cc.find('Canvas/UILayer/wenzi').active = false
        h = false
        r = false
        this.node.getComponent('drawlines').penNode.active = false
      }
    })
    
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, (e) =>{
      if (h && g === e.getID()) {
        if (s > 0 && i > 0) {
          const n = this.node.getChildByName('line' + p)
          n.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic
          n.getComponent(cc.RigidBody).gravityScale = 3.5
          n.group = 'line'

          WorldController.waterIsSpawn || (WorldController.waterIsSpawn = true, this.getWaterNode().getComponent('water').spawnWater())
          this.node.parent.children.forEach( (e) =>{
            for (let t = 0; t < C.length; t++) {
              if (e.name == C[4]) return void (e.children[0].getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic)
              e.name == C[t] && (e.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic)
            }
          })
          
          WorldController.frames = cc.director.getTotalFrames()
          WorldController.begin = true
        }

        cc.find('Canvas/music').getComponent('musicManager').stopPenAudio()
        h = false
        r = false
        this.node.getComponent('drawlines').penNode.active = false
      }
    })
  },

  getWaterNode () {
    return cc.find('Canvas/level/out/waterNode') ? cc.find('Canvas/level/out/waterNode') : cc.find('Canvas/level/outTop/waterNode') ? cc.find('Canvas/level/outTop/waterNode') : cc.find('Canvas/level/outRight/waterNode') ? cc.find('Canvas/level/outRight/waterNode') : void 0
  },

  testrect (e, t) {
    const n = cc.director.getPhysicsManager()
    const a = n.testPoint(cc.v2(e - 4.5, t - 4.5))
    if (a == null || a.node.name == 'line' + p) {
      const o = n.testPoint(cc.v2(e - 4.5, t + 4.5))
      if (o == null || o.node.name == 'line' + p) {
        const c = n.testPoint(cc.v2(e + 4.5, t - 4.5))
        if (c == null || c.node.name == 'line' + p) {
          const i = n.testPoint(cc.v2(e + 4.5, t + 4.5))
          if (i == null || i.node.name == 'line' + p) {
            const s = n.testPoint(cc.v2(e, t))
            if (s == null || s.node.name == 'line' + p) return true
          }
        }
      }
    }
    return false
  },

  wideRaycast (e, t, n, a) {
    const o = cc.director.getPhysicsManager()
    const c = Math.sqrt(Math.pow(n - e, 2) + Math.pow(a - t, 2))
    const i = 4.5 * -(a - t) / c
    const s = 4.5 * (n - e) / c
    const r = o.rayCast(cc.v2(e - i, t - s), cc.v2(n - i, a - s), cc.RayCastType.All)
    if (r.length > 0) {
      for (var d = 0; d < r.length; d++) {
        if (r[d].collider.node.name != 'line' + p) {
          u = true
          break
        }
        u = false
      }
    }
    const l = o.rayCast(cc.v2(e + i, t + s), cc.v2(n + i, a + s), cc.RayCastType.All)
    if (l.length > 0) {
      for (d = 0; d < l.length; d++) {
        if (l[d].collider.node.name != 'line' + p) {
          u = true
          break
        }
        u = false
      }
    }
  },

  addCanDrawTotalLength () {
    s = 3e3
    this.percentShow.string = (s / WorldController.totalLength * 200).toFixed(0) + '%'
  },

  onDestroy () {
    this.unscheduleAllCallbacks()
  },

  update (e) {
    WorldController.begin && cc.director.getTotalFrames() - WorldController.frames > 480 && (WorldController.win || (cc.find('Canvas/gameOver').active = true, cc.find('Canvas/music').getComponent('musicManager').loseAudio()))
  }
})
