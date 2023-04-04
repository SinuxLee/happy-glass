const WorldController = require('WorldController')
let lineLenSum = 0
let isDrawing = false
let lineId = 0
let globalRelPos = cc.v2(0, 0)
let globalTouchPos = cc.v2(0, 0)
let curLineIsEnd = false
let lineData = []
let totalLen = WorldController.totalLength

cc.Class({
  extends: cc.Component,

  onLoad () {
    cc.PhysicsAABBQueryCallback.prototype.ReportFixture = function (e) {
      if (this._isPoint) {
        if (e.TestPoint(this._point)) return this._fixtures.push(e), false
      } else this._fixtures.push(e)
      return true
    }

    this._physics = cc.director.getPhysicsManager()
    this._physics.enabled = true

    this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
      if (totalLen <= 0) return

      const touchPos = event.getLocation()
      const relPos = this.node.convertToNodeSpaceAR(touchPos)

      if (isDrawing || lineId != 0) {
        const inRect = this.testrect(touchPos.x, touchPos.y)
        lineData.push(relPos)

        this.wideRaycast(globalTouchPos.x, globalTouchPos.y, touchPos.x, touchPos.y)
        if (inRect && !curLineIsEnd) {
          const distance = Math.sqrt(Math.pow(relPos.x - globalRelPos.x, 2) + Math.pow(relPos.y - globalRelPos.y, 2))
          const lineNode = this.node.getChildByName('line' + lineId)
          lineNode.getComponent(cc.Graphics).lineTo(relPos.x, relPos.y)
          lineNode.getComponent(cc.Graphics).stroke() // 先闭合上一条线
          lineNode.getComponent(cc.Graphics).moveTo(relPos.x, relPos.y) // 开启新线

          for (let i = 0; i < distance / 10; i++) {
            const collider = lineNode.addComponent(cc.PhysicsCircleCollider)
            const distanceX = globalRelPos.x + 10 * i * (relPos.x - globalRelPos.x) / distance
            const distanceY = globalRelPos.y + 10 * i * (relPos.y - globalRelPos.y) / distance
            collider.offset = cc.v2(distanceX, distanceY)
            collider.radius = 4.5
            collider.density = 1
            collider.apply()
          }

          globalRelPos = relPos
          globalTouchPos = touchPos
          lineLenSum += distance
          totalLen -= distance
          cc.find('Canvas/lineLength').width = totalLen / WorldController.totalLength * 240
        }
      } else {
        isDrawing = true
        globalRelPos = relPos
        globalTouchPos = touchPos
        if (this._physics.testAABB(cc.rect(relPos.x, relPos.y, 4.5, 4.5)).length != 0) {
          isDrawing = false
          return
        }

        curLineIsEnd = false
        lineId++

        const line = new cc.Node('line' + lineId)
        this.node.addChild(line)

        const rigidBody = line.addComponent(cc.RigidBody)
        rigidBody.gravityScale = 0
        rigidBody.type = cc.RigidBodyType.Static

        const gl = line.addComponent(cc.Graphics)
        gl.lineCap = cc.Graphics.LineCap.ROUND
        gl.lineWidth = 9
        gl.moveTo(relPos.x, relPos.y)

        lineData.push(relPos)
      }
    })
  },

  clearLines () {
    lineData = []
    const line = this.node.getChildByName('line1')
    if (line) line.destroy()

    cc.find('Canvas/lineLength').width = 240
    totalLen = WorldController.totalLength
    lineLenSum = 0
    lineId = 0
    isDrawing = false
    this.getWaterNode() && this.getWaterNode().removeAllChildren()
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

  getLinesData () {
    return lineData
  },

  startTest () {
    if (totalLen > 0 && lineLenSum > 0) {
      const line = this.node.getChildByName('line1')
      line.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic
      line.getComponent(cc.RigidBody).gravityScale = 3.5
      line.group = 'line'
      this.getWaterNode().getComponent('water').spawnWater()
    }
  },

  testrect (x, y) {
    const range = 4.5
    const target = 'line' + lineId
    const pins = [
      { x: 1, y: 1 },
      { x: -1, y: 1 },
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: 0, y: 0 }
    ].map(pin => {
      pin.x *= range
      pin.y *= range
      return pin
    })

    for (const pin of pins) {
      const pos = cc.v2(x + pin.x * range, y + pin.y * range)
      const collider = this._physics.testPoint(pos)
      if (collider != null && collider.node.name != target) return false
    }

    return true
  },

  wideRaycast (globalTouchX, globalTouchY, touchX, touchY) {
    const distance = Math.sqrt(Math.pow(touchX - globalTouchX, 2) + Math.pow(touchY - globalTouchY, 2))
    const distanceX = 4.5 * (touchX - globalTouchX) / distance
    const distanceY = 4.5 * -(touchY - globalTouchY) / distance
    const target = 'line' + lineId

    let point1 = cc.v2(globalTouchX - distanceY, globalTouchY - distanceX)
    let point2 = cc.v2(touchX - distanceY, touchY - distanceX)
    const result = this._physics.rayCast(point1, point2, cc.RayCastType.Any)
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        if (result[i].collider.node.name != target) {
          curLineIsEnd = true
          break
        }
        curLineIsEnd = false
      }
    }

    point1 = cc.v2(globalTouchX + distanceY, globalTouchY + distanceX)
    point2 = cc.v2(touchX + distanceY, touchY + distanceX)
    result = this._physics.rayCast(point1, point2, cc.RayCastType.Any)
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        if (result[i].collider.node.name != target) {
          curLineIsEnd = true
          break
        }
        curLineIsEnd = false
      }
    }
  }
})
