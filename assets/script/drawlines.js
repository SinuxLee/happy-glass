const WorldController = require('WorldController')
const userType = require('userType')
const LocalStorageData = require('LocalStorageData')
let i = 0
let s = 0
let r = false
let relTouchPos = cc.v2(0, 0)
let touchPos = cc.v2(0, 0)
let h = false
let lineId = 0
let eventId = 0
let m = cc.v2(0, 0)
let v = cc.v2(0, 0)
let u = false
const rigids = ['moveBox1', 'moveBox2', 'moveBox3', 'moveBox4', 'moveBox5', 'glass']

cc.Class({
  extends: cc.Component,
  properties: {
    percentShow: cc.Label,
    penSprite: {
      default: [],
      type: cc.SpriteFrame
    },
    penNode: cc.Node,

    _physics: null
  },

  onLoad () {
    cc.PhysicsAABBQueryCallback.prototype.ReportFixture = function (e) {
      if (e.GetBody(), this._isPoint) {
        if (e.TestPoint(this._point)) return this._fixtures.push(e), false
      } else this._fixtures.push(e)
      return true
    }

    this._physics = cc.director.getPhysicsManager()
    this._physics.enabled = true

    lineId = 0
    i = 0
    s = WorldController.totalLength

    this.node.on(cc.Node.EventType.TOUCH_START, this.startDraw, this)
    this.node.on(cc.Node.EventType.TOUCH_MOVE, this.drawingLine, this)
    this.node.on(cc.Node.EventType.TOUCH_END, this.stopDraw, this)
    this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.cancelDraw, this)
  },

  startDraw (event) {
    if (!s || r) return

    r = true
    eventId = event.getID()
    if (WorldController.currentLevel == 0) {
      const hand = cc.find('Canvas/UILayer/hand')
      hand.stopAllActions()
      hand.active = false
    }

    touchPos = event.getLocation()
    relTouchPos = this.node.convertToNodeSpaceAR(touchPos)

    m = relTouchPos
    v = touchPos

    const rect = cc.rect(relTouchPos.x, relTouchPos.y, 4.5, 4.5)
    if (this._physics.testAABB(rect).length != 0) {
      r = false
      return
    }

    h = true
    u = false
    lineId++

    const line = new cc.Node('line' + lineId)
    this.node.addChild(line)

    const rigidBody = line.addComponent(cc.RigidBody)
    rigidBody.gravityScale = 0
    rigidBody.type = cc.RigidBodyType.Static

    const gl = line.addComponent(cc.Graphics)
    gl.strokeColor = userType.penColor[LocalStorageData.get('selectPen')]
    gl.lineCap = cc.Graphics.LineCap.ROUND
    gl.lineWidth = 9
    gl.moveTo(relTouchPos.x, relTouchPos.y)

    const penNode = this.node.getComponent('drawlines').penNode
    penNode.getComponent(cc.Sprite).spriteFrame = this.node.getComponent('drawlines').penSprite[LocalStorageData.get('selectPen')]
    penNode.position = relTouchPos
    penNode.active = true
    penNode.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(0.2, 15), cc.rotateTo(0.2, -15))))

    cc.find('Canvas/UILayer/btnLayer/tishiBtn').getComponent(cc.Button).interactable = false
    cc.find('Canvas/UILayer/btnLayer/drawAdd').getComponent(cc.Button).interactable = false
    cc.find('Canvas/UILayer/btnLayer/tryItem').getComponent(cc.Button).interactable = false
  },

  drawingLine (event) {
    if (h) {
      if (eventId === event.getID()) {
        touchPos = event.getLocation()
        relTouchPos = this.node.convertToNodeSpaceAR(touchPos)
        if (s <= 0) {
          const lineNode = this.node.getChildByName('line' + lineId)
          lineNode.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic
          lineNode.getComponent(cc.RigidBody).gravityScale = 3.5
          lineNode.group = 'line'
          if (WorldController.waterIsSpawn) return

          WorldController.waterIsSpawn = true
          WorldController.frames = cc.director.getTotalFrames()
          WorldController.begin = true
          this.getWaterNode().getComponent('water').spawnWater()
          return
        }

        isInRect = this.testrect(touchPos.x, touchPos.y)
        this.wideRaycast(v.x, v.y, touchPos.x, touchPos.y)
        if (isInRect && !u) {
          const newLineLen = relTouchPos.sub(m).mag()
          const lineNode = this.node.getChildByName('line' + lineId)
          const gl = lineNode.getComponent(cc.Graphics)
          gl.lineTo(relTouchPos.x, relTouchPos.y)
          gl.stroke()
          gl.moveTo(relTouchPos.x, relTouchPos.y)

          if (newLineLen > 8) {
            if (newLineLen < 10) {
              const circle = lineNode.addComponent(cc.PhysicsCircleCollider)
              circle.offset = cc.v2(relTouchPos.x, relTouchPos.y)
              circle.radius = 4.5
              circle.density = 1
              circle.apply()
            } else {
              for (let y = newLineLen / 10, f = 1; f < y; f++) {
                const xLen = m.x + 10 * f * (relTouchPos.x - m.x) / newLineLen
                const yLen = m.y + 10 * f * (relTouchPos.y - m.y) / newLineLen

                const circle = lineNode.addComponent(cc.PhysicsCircleCollider)
                circle.offset = cc.v2(xLen, yLen)
                circle.radius = 4.5
                circle.density = 1
                circle.apply()
              }

              const circle = lineNode.addComponent(cc.PhysicsCircleCollider)
              circle.offset = cc.v2(relTouchPos.x, relTouchPos.y)
              circle.radius = 4.5
              circle.density = 1
              circle.apply()
            }
            m = relTouchPos
            v = touchPos
            i += newLineLen
            s -= newLineLen

            if (s / WorldController.totalLength * 240 > 0) {
              cc.find('Canvas/UILayer/pen/lineLength').width = s / WorldController.totalLength * 240
              if (WorldController.totalLength == 3000) {
                this.percentShow.string = (s / WorldController.totalLength * 200).toFixed(0) + '%'
              } else {
                this.percentShow.string = (s / WorldController.totalLength * 100).toFixed(0) + '%'
              }
            } else {
              cc.find('Canvas/UILayer/pen/lineLength').width = 0
              this.percentShow.string = '0%'
            }
          }

          cc.find('Canvas/music').getComponent('musicManager').penAudio()
          this.node.getComponent('drawlines').penNode.position = relTouchPos
          this.node.getComponent('drawlines').penNode.active = true
        } else {
          const line = new cc.Node('err' + lineId)
          const gl = line.addComponent(cc.Graphics)
          gl.getComponent(cc.Graphics).clear()
          gl.getComponent(cc.Graphics).moveTo(m.x, m.y)
          gl.getComponent(cc.Graphics).strokeColor = cc.color(255, 0, 0)
          gl.getComponent(cc.Graphics).lineTo(relTouchPos.x, relTouchPos.y)
          gl.getComponent(cc.Graphics).stroke()
        }
      }
    } else if (!r) {
      var isInRect
      r = true
      eventId = event.getID()
      touchPos = event.getLocation()
      relTouchPos = this.node.convertToNodeSpaceAR(touchPos)
      m = relTouchPos
      v = touchPos

      isInRect = this.testrect(touchPos.x, touchPos.y)
      if (!isInRect) {
        r = false
        return
      }
      h = true
      u = false
      lineId++

      const line = new cc.Node('line' + lineId)
      this.node.addChild(line)

      const rigidBody = line.addComponent(cc.RigidBody)
      rigidBody.gravityScale = 0
      rigidBody.type = cc.RigidBodyType.Static

      const gl = line.addComponent(cc.Graphics)
      gl.strokeColor = userType.penColor[LocalStorageData.get('selectPen')]
      gl.lineCap = cc.Graphics.LineCap.ROUND
      gl.lineWidth = 9
      gl.moveTo(relTouchPos.x, relTouchPos.y)

      const penNode = this.node.getComponent('drawlines').penNode
      penNode.getComponent(cc.Sprite).spriteFrame = this.node.getComponent('drawlines').penSprite[LocalStorageData.get('selectPen')]
      penNode.position = relTouchPos
      penNode.active = true
      penNode.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(0.2, 15), cc.rotateTo(0.2, -15))))

      cc.find('Canvas/UILayer/btnLayer/tishiBtn').getComponent(cc.Button).interactable = false
      cc.find('Canvas/UILayer/btnLayer/drawAdd').getComponent(cc.Button).interactable = false
      cc.find('Canvas/UILayer/btnLayer/tryItem').getComponent(cc.Button).interactable = false
    }
  },

  stopDraw (event) {
    if (h && eventId === event.getID()) {
      if (s > 0 && i > 0) {
        const line = this.node.getChildByName('line' + lineId)
        line.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic
        line.getComponent(cc.RigidBody).gravityScale = 3.5
        line.group = 'line'

        if (!WorldController.waterIsSpawn) {
          WorldController.waterIsSpawn = true
          this.getWaterNode().getComponent('water').spawnWater()
        }

        this.node.parent.children.forEach((node) => {
          for (let i = 0; i < rigids.length; i++) {
            if (node.name == rigids[4]) {
              node.children[0].getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic
              return
            }

            if (node.name == rigids[i]) {
              node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic
            }
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
  },

  cancelDraw (event) {
    if (h && eventId === event.getID()) {
      if (s > 0 && i > 0) {
        const line = this.node.getChildByName('line' + lineId)
        line.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic
        line.getComponent(cc.RigidBody).gravityScale = 3.5
        line.group = 'line'

        if (!WorldController.waterIsSpawn) {
          WorldController.waterIsSpawn = true
          this.getWaterNode().getComponent('water').spawnWater()
        }

        this.node.parent.children.forEach((node) => {
          for (let i = 0; i < rigids.length; i++) {
            if (node.name == rigids[4]) {
              node.children[0].getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic
              return
            }

            if (node.name == rigids[i]) {
              node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic
            }
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
  },

  getWaterNode () {
    const path = [
      'Canvas/level/out/waterNode',
      'Canvas/level/outTop/waterNode',
      'Canvas/level/outRight/waterNode'
    ]

    for (const p of path) {
      const water = cc.find(p)
      if (water) return water
    }

    return null
  },

  testrect (e, t) {
    const n = cc.director.getPhysicsManager()
    const a = n.testPoint(cc.v2(e - 4.5, t - 4.5))
    if (a == null || a.node.name == 'line' + lineId) {
      const o = n.testPoint(cc.v2(e - 4.5, t + 4.5))
      if (o == null || o.node.name == 'line' + lineId) {
        const c = n.testPoint(cc.v2(e + 4.5, t - 4.5))
        if (c == null || c.node.name == 'line' + lineId) {
          const i = n.testPoint(cc.v2(e + 4.5, t + 4.5))
          if (i == null || i.node.name == 'line' + lineId) {
            const s = n.testPoint(cc.v2(e, t))
            if (s == null || s.node.name == 'line' + lineId) return true
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
        if (r[d].collider.node.name != 'line' + lineId) {
          u = true
          break
        }
        u = false
      }
    }
    const l = o.rayCast(cc.v2(e + i, t + s), cc.v2(n + i, a + s), cc.RayCastType.All)
    if (l.length > 0) {
      for (d = 0; d < l.length; d++) {
        if (l[d].collider.node.name != 'line' + lineId) {
          u = true
          break
        }
        u = false
      }
    }
  },

  addCanDrawTotalLength () {
    this.percentShow.string = (3000 / WorldController.totalLength * 200).toFixed(0) + '%'
  },

  onDestroy () {
    this.unscheduleAllCallbacks()
  },

  update (e) {
    if (WorldController.begin && cc.director.getTotalFrames() - WorldController.frames > 480) {
      if (WorldController.win) return

      cc.find('Canvas/gameOver').active = true
      cc.find('Canvas/music').getComponent('musicManager').loseAudio()
    }
  }
})
