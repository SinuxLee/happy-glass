const i = require('WorldController')
const o = ['出水口@2x', '出水口@2x', '出水口@2x', '正常@2x', '1@2x', '2@2x', '3@2x',
  '4@2x', '5@2x', '6@2x', '7@2x', '8@2x', '9@2x', '10@2x', '8@2x', '4@2x', '4@2x',
  '形状5@2x', '形状5@2x', '矩形12@2x', '19@2x', '椭圆4@2x', '椭圆4@2x', '椭圆4@2x', '十字架@2x']
const c = ['moveBox1', 'moveBox2', 'moveBox3', 'moveBox4', 'moveBox5', 'glass']
let a = []
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
  onLoad: function () {
    cc.director.getPhysicsManager().enabled = !0
    for (var e = this, t = 0; t < o.length; t++) {
      !(function (t) {
        cc.loader.loadRes('box/' + o[t], cc.SpriteFrame, function (n, i) {
          const o = new cc.Node()
          o.addComponent(cc.Sprite), o.getComponent(cc.Sprite).spriteFrame = i
          const c = o.addComponent('click')
          t == 1 && (o.rotation = 90),
          t == 2 && (o.rotation = 180),
          t == 14 && (o.width = 130, o.height = 130),
          t == 15 && (o.rotation = -90),
          t == 16 && (o.rotation = 90, o.scaleX = -1),
          t == 18 && (o.scaleX = -1),
          t == 22 && (o.scaleX = 0.5, o.scaleY = 0.5),
          t == 23 && (o.scaleX = 2, o.scaleY = 2)
          const a = o.width
          const l = o.height
          a > l ? (o.width = 130, o.height = 130 / a * l) : a == l ? (o.width = 130, o.height = 130) : (o.height = 130, o.width = 130 / l * a), a < l && o.rotation != 0 && (o.width = 130), o.parent = e.itemNode, c.init(e.prefabAtlas[t], e.node)
        })
      }(t))
    }
  },
  over: function () {
    const e = new cc.Node('drawline')
    e.parent = this.node, e.addComponent('drawlinesTest').waterNode = this.getWaterNode()
    const t = e.addComponent(cc.Widget)
    t.isAlignTop = !0, t.top = 0, t.isAlignBottom = !0, t.bottom = 0, t.isAlignLeft = !0, t.left = 0, t.isAlignRight = !0, t.right = 0, console.log('over!!!'), this.clearBtn.active = !0, this.testBtn.active = !0, this.bianjiBtn.active = !0, this.completeBtn.active = !1, this.recoverBtn.active = !0
  },
  bianji: function () {
    this.clearLines()
    const e = cc.find('Canvas/level/drawline')
    e && e.destroy(), this.node.children.forEach(function (e) {
      for (let t = 0; t < c.length; t++) e.name == c[t] && (e.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static)
    }), this.clearBtn.active = !1, this.testBtn.active = !1, this.toFileBtn.active = !1, this.bianjiBtn.active = !1, this.recoverBtn.active = !1, this.completeBtn.active = !0
  },
  getWaterNode: function () {
    return cc.find('Canvas/level/out/waterNode') ? cc.find('Canvas/level/out/waterNode') : cc.find('Canvas/level/outTop/waterNode') ? cc.find('Canvas/level/outTop/waterNode') : cc.find('Canvas/level/outRight/waterNode') ? cc.find('Canvas/level/outRight/waterNode') : void 0
  },
  getLevelData: function (e) {
    for (var t = [], n = 0; n < this.node.children.length; n++) {
      this.node.children[n].y < -this.node.height / 2
        ? this.node.children[n].destroy()
        : t.push({
          name: this.node.children[n].name,
          x: this.node.children[n].x,
          y: this.node.children[n].y
        })
    }

    const i = cc.find('Canvas/level/drawline').getComponent('drawlinesTest').getLinesData()
    t.push({
      levelID: e,
      answer: i
    }),
    console.log(t),
    console.log(JSON.stringify(t))
    return t
  },
  clearLines: function () {
    cc.find('Canvas/level/drawline') && cc.find('Canvas/level/drawline').getComponent('drawlinesTest').clearLines()
  },
  startTest: function () {
    a = this.getLevelData('test'), this.node.children.forEach(function (e) {
      console.log(e)
      for (let t = 0; t < c.length; t++) {
        if (e.name == c[4]) return void (e.children[0].getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic)
        e.name == c[t] && (e.getComponent(cc.RigidBody).type = cc.RigidBodyType.Dynamic)
      }
    }), cc.find('Canvas/level/drawline').getComponent('drawlinesTest').startTest(), this.toFileBtn.active = !0
  },
  recover: function () {
    const e = this
    e.clearLines(), e.node.removeAllChildren(), a.forEach(function (t) {
      if (t.name && t.name != 'drawline') {
        const n = e.getPrefab(t.name)
        const i = cc.instantiate(e.prefabAtlas[n])
        i.addComponent('moveItem'),
        i.x = t.x,
        i.y = t.y,
        i.parent = e.node,
        t.name != 'out' && t.name != 'outTop' && t.name != 'outRight' || i.setSiblingIndex(0)
      }
    }), this.clearBtn.active = !1, this.testBtn.active = !1, this.toFileBtn.active = !1, this.bianjiBtn.active = !1, this.recoverBtn.active = !1, this.completeBtn.active = !0
  },
  getPrefab: function (e) {
    for (let t = 0; t < this.prefabAtlas.length; t++) { if (this.prefabAtlas[t].name == e) return t }
  },
  toFile: function () {
    const e = this
    if (wx.getFileSystemManager) {
      const t = wx.getFileSystemManager()
      t.readFile({
        filePath: wx.env.USER_DATA_PATH + '/level.json',
        encoding: 'utf8',
        success: function (n) {
          if (i.changeLevel) {
            o = JSON.parse(n.data), c = e.changeNum + 1, a[a.length - 1].levelID = c, console.log('levelID:', c), o[c - 1] = a, t.writeFile({
              filePath: wx.env.USER_DATA_PATH + '/level.json',
              data: JSON.stringify(o),
              success: function (t) {
                console.log('write file success' + t), e.clearLines(), cc.find('Canvas/tishi').getComponent(cc.Graphics).clear(), e.node.removeAllChildren(), e.toFileBtn.active = !1, e.clearBtn.active = !1, e.testBtn.active = !1, e.bianjiBtn.active = !1, e.completeBtn.active = !0
              },
              fail: function (e) {
                console.log('write file error' + e)
              }
            })
          } else {
            var o; var c = (o = JSON.parse(n.data)).length + 1
            a[a.length - 1].levelID = c, console.log('levelID:', c), o.push(a), t.writeFile({
              filePath: wx.env.USER_DATA_PATH + '/level.json',
              data: JSON.stringify(o),
              success: function (t) {
                console.log('write file success' + t), e.clearLines(), e.node.removeAllChildren(), e.toFileBtn.active = !1, e.clearBtn.active = !1, e.testBtn.active = !1, e.bianjiBtn.active = !1, e.completeBtn.active = !0
              },
              fail: function (e) {
                console.log('write file error' + e)
              }
            })
          }
        },
        fail: function (n) {
          console.log('read file null')
          const i = []
          i.push(e.getLevelData(1)), t.writeFile({
            filePath: wx.env.USER_DATA_PATH + '/level.json',
            data: JSON.stringify(i),
            success: function (t) {
              console.log('write file success' + t), e.clearLines(), e.node.removeAllChildren()
            },
            fail: function (e) {
              console.log('write file error' + e.errMsg)
            }
          })
        }
      })
    }
  },
  levelChange: function (e) {
    const t = this
    wx.getFileSystemManager().readFile({
      filePath: wx.env.USER_DATA_PATH + '/level.json',
      encoding: 'utf8',
      success: function (n) {
        const o = JSON.parse(n.data)
        a = o[e], i.changeLevel = !0, t.changeNum = e, t.clearLines(), t.node.removeAllChildren(), a.forEach(function (e) {
          if (e.name && e.name != 'drawline') {
            const n = t.getPrefab(e.name)
            const i = cc.instantiate(t.prefabAtlas[n])
            i.addComponent('moveItem'), i.x = e.x, i.y = e.y, i.parent = t.node, e.name != 'out' && e.name != 'outTop' && e.name != 'outRight' || i.setSiblingIndex(0)
          }
          if (!e.name) {
            const o = e.answer
            const c = cc.find('Canvas/tishi').getComponent(cc.Graphics)
            c.clear(), c.moveTo(o[0].x, o[0].y - 30), o.forEach(function (e) {
              c.lineTo(e.x, e.y - 30), c.stroke(), c.moveTo(e.x, e.y - 30)
            })
          }
        }), t.clearBtn.active = !1, t.testBtn.active = !1, t.toFileBtn.active = !1, t.bianjiBtn.active = !1, t.recoverBtn.active = !1, t.completeBtn.active = !0
      },
      fail: function (e) {
        console.log('read file null')
      }
    })
  }
})
