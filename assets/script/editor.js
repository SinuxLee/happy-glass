const WorldController = require('WorldController')
const o = ['出水口@2x', '出水口@2x', '出水口@2x', '正常@2x', '1@2x', '2@2x', '3@2x',
  '4@2x', '5@2x', '6@2x', '7@2x', '8@2x', '9@2x', '10@2x', '8@2x', '4@2x', '4@2x',
  '形状5@2x', '形状5@2x', '矩形12@2x', '19@2x', '椭圆4@2x', '椭圆4@2x', '椭圆4@2x', '十字架@2x']
const c = ['moveBox1', 'moveBox2', 'moveBox3', 'moveBox4', 'moveBox5', 'glass']
let levelItems = []

cc.Class({
  extends: cc.Component,
  properties: {
    prefabAtlas: {
      default: [],
      type: cc.Prefab
    },
    itemNode: cc.Node,
    toFileBtn: cc.Node,
    clearBtn: cc.Node,
    testBtn: cc.Node,
    bianjiBtn: cc.Node,
    completeBtn: cc.Node,
    recoverBtn: cc.Node
  },

  onLoad () {
    cc.director.getPhysicsManager().enabled = true
    for (let t = 0; t < o.length; t++) {
      cc.loader.loadRes('box/' + o[t], cc.SpriteFrame, (n, i) => {
        const o = new cc.Node()
        o.addComponent(cc.Sprite)
        o.getComponent(cc.Sprite).spriteFrame = i
        const c = o.addComponent('click')
        t == 1 && (o.angle = -90),
        t == 2 && (o.angle = -180),
        t == 14 && (o.width = 130, o.height = 130),
        t == 15 && (o.angle = 90),
        t == 16 && (o.angle = -90, o.scaleX = -1),
        t == 18 && (o.scaleX = -1),
        t == 22 && (o.scaleX = 0.5, o.scaleY = 0.5),
        t == 23 && (o.scaleX = 2, o.scaleY = 2)
        const a = o.width
        const l = o.height
        a > l ? (o.width = 130, o.height = 130 / a * l) : a == l ? (o.width = 130, o.height = 130) : (o.height = 130, o.width = 130 / l * a), a < l && o.angle != 0 && (o.width = 130), o.parent = this.itemNode, c.init(this.prefabAtlas[t], this.node)
      })
    }
  },

  over () {
    const e = new cc.Node('drawline')
    e.parent = this.node
    e.addComponent('drawlinesTest').waterNode = this.getWaterNode()
    const t = e.addComponent(cc.Widget)
    t.isAlignTop = true
    t.top = 0
    t.isAlignBottom = true
    t.bottom = 0
    t.isAlignLeft = true
    t.left = 0
    t.isAlignRight = true
    t.right = 0
    console.log('over!!!')

    this.clearBtn.active = true
    this.testBtn.active = true
    this.bianjiBtn.active = true
    this.completeBtn.active = false
    this.recoverBtn.active = true
  },

  bianji () {
    this.clearLines()
    const e = cc.find('Canvas/level/drawline')
    e && e.destroy()
    this.node.children.forEach((e) => {
      for (let t = 0; t < c.length; t++) e.name == c[t] && (e.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static)
    })

    this.clearBtn.active = false
    this.testBtn.active = false
    this.toFileBtn.active = false
    this.bianjiBtn.active = false
    this.recoverBtn.active = false
    this.completeBtn.active = true
  },

  getWaterNode () {
    return cc.find('Canvas/level/out/waterNode') ? cc.find('Canvas/level/out/waterNode') : cc.find('Canvas/level/outTop/waterNode') ? cc.find('Canvas/level/outTop/waterNode') : cc.find('Canvas/level/outRight/waterNode') ? cc.find('Canvas/level/outRight/waterNode') : void 0
  },

  getLevelData (levelId) {
    const t = []
    for (let n = 0; n < this.node.children.length; n++) {
      this.node.children[n].y < -this.node.height / 2
        ? this.node.children[n].destroy()
        : t.push({
          name: this.node.children[n].name,
          x: this.node.children[n].x,
          y: this.node.children[n].y
        })
    }

    const i = cc.find('Canvas/level/drawline').getComponent('drawlinesTest').getLinesData()
    t.push({ levelID: levelId, answer: i })
    console.log(t)
    console.log(JSON.stringify(t))
    return t
  },

  clearLines () {
    cc.find('Canvas/level/drawline') && cc.find('Canvas/level/drawline').getComponent('drawlinesTest').clearLines()
  },

  startTest () {
    levelItems = this.getLevelData('test')
    this.node.children.forEach((e) => {
      console.log(e)
      for (let t = 0; t < c.length; t++) {
        if (e.name == c[4]) return void (e.children[0].getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic)
        e.name == c[t] && (e.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic)
      }
    })
    cc.find('Canvas/level/drawline').getComponent('drawlinesTest').startTest()
    this.toFileBtn.active = true
  },

  recover () {
    this.clearLines()
    this.node.removeAllChildren()
    levelItems.forEach((t) => {
      if (t.name && t.name != 'drawline') {
        const n = this.getPrefab(t.name)
        const i = cc.instantiate(this.prefabAtlas[n])
        i.addComponent('moveItem')
        i.x = t.x
        i.y = t.y
        i.parent = this.node
        t.name != 'out' && t.name != 'outTop' && t.name != 'outRight' || i.setSiblingIndex(0)
      }
    })

    this.clearBtn.active = false
    this.testBtn.active = false
    this.toFileBtn.active = false
    this.bianjiBtn.active = false
    this.recoverBtn.active = false
    this.completeBtn.active = true
  },

  getPrefab (name) {
    for (let t = 0; t < this.prefabAtlas.length; t++) {
      if (this.prefabAtlas[t].name == name) return t
    }
  },

  toFile () {
    if (wx.getFileSystemManager) {
      const t = wx.getFileSystemManager()
      t.readFile({
        filePath: wx.env.USER_DATA_PATH + '/level.json',
        encoding: 'utf8',
        success: (n) => {
          if (WorldController.changeLevel) {
            o = JSON.parse(n.data)
            c = this.changeNum + 1
            levelItems[levelItems.length - 1].levelID = c
            console.log('levelID:', c)
            o[c - 1] = levelItems
            t.writeFile({
              filePath: wx.env.USER_DATA_PATH + '/level.json',
              data: JSON.stringify(o),
              success: (t) => {
                console.log('write file success' + t)
                this.clearLines()
                cc.find('Canvas/tishi').getComponent(cc.Graphics).clear()
                this.node.removeAllChildren()
                this.toFileBtn.active = false
                this.clearBtn.active = false
                this.testBtn.active = false
                this.bianjiBtn.active = false
                this.completeBtn.active = true
              },
              fail: (e) => {
                console.log('write file error' + e)
              }
            })
          } else {
            var o = JSON.parse(n.data)
            var c = o.length + 1
            levelItems[levelItems.length - 1].levelID = c
            console.log('levelID:', c)
            o.push(levelItems)
            t.writeFile({
              filePath: wx.env.USER_DATA_PATH + '/level.json',
              data: JSON.stringify(o),
              success: (t) => {
                console.log('write file success' + t)
                this.clearLines()
                this.node.removeAllChildren()
                this.toFileBtn.active = false
                this.clearBtn.active = false
                this.testBtn.active = false
                this.bianjiBtn.active = false
                this.completeBtn.active = true
              },
              fail: (e) => {
                console.log('write file error' + e)
              }
            })
          }
        },

        fail: (n) => {
          console.log('read file null')
          const i = []
          i.push(this.getLevelData(1))
          t.writeFile({
            filePath: wx.env.USER_DATA_PATH + '/level.json',
            data: JSON.stringify(i),
            success: (t) => {
              console.log('write file success' + t)
              this.clearLines()
              this.node.removeAllChildren()
            },
            fail: (e) => {
              console.log('write file error' + e.errMsg)
            }
          })
        }
      })
    }
  },

  levelChange (e) {
    wx.getFileSystemManager().readFile({
      filePath: wx.env.USER_DATA_PATH + '/level.json',
      encoding: 'utf8',
      success: (n) => {
        const o = JSON.parse(n.data)
        levelItems = o[e]
        WorldController.changeLevel = true
        this.changeNum = e
        this.clearLines()
        this.node.removeAllChildren()
        levelItems.forEach((e) => {
          if (e.name && e.name != 'drawline') {
            const n = this.getPrefab(e.name)
            const i = cc.instantiate(this.prefabAtlas[n])
            i.addComponent('moveItem')
            i.x = e.x
            i.y = e.y
            i.parent = this.node
            e.name != 'out' && e.name != 'outTop' && e.name != 'outRight' || i.setSiblingIndex(0)
          }
          if (!e.name) {
            const o = e.answer
            const gl = cc.find('Canvas/tishi').getComponent(cc.Graphics)
            gl.clear()
            gl.moveTo(o[0].x, o[0].y - 30)
            o.forEach((e) => {
              gl.lineTo(e.x, e.y - 30)
              gl.stroke()
              gl.moveTo(e.x, e.y - 30)
            })
          }
        })
        this.clearBtn.active = false
        this.testBtn.active = false
        this.toFileBtn.active = false
        this.bianjiBtn.active = false
        this.recoverBtn.active = false
        this.completeBtn.active = true
      },
      fail: (e) => {
        console.log('read file null')
      }
    })
  }
})
