const WorldController = require('WorldController')
const images = ['出水口@2x', '出水口@2x', '出水口@2x', '正常@2x', '1@2x', '2@2x', '3@2x',
  '4@2x', '5@2x', '6@2x', '7@2x', '8@2x', '9@2x', '10@2x', '8@2x', '4@2x', '4@2x',
  '形状5@2x', '形状5@2x', '矩形12@2x', '19@2x', '椭圆4@2x', '椭圆4@2x', '椭圆4@2x', '十字架@2x']
const rigids = ['moveBox1', 'moveBox2', 'moveBox3', 'moveBox4', 'moveBox5', 'glass']
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

    for (let i = 0; i < images.length; i++) {
      cc.loader.loadRes('box/' + images[i], cc.SpriteFrame, (err, frame) => {
        const node = new cc.Node()
        node.addComponent(cc.Sprite)
        node.getComponent(cc.Sprite).spriteFrame = frame

        const c = node.addComponent('click')
        switch (i) {
          case 1: node.angle = -90; break
          case 2: node.angle = -180; break
          case 14:
            node.width = 130
            node.height = 130
            break
          case 15: node.angle = 90; break
          case 16:
            node.angle = -90
            node.scaleX = -1
            break
          case 18: node.scaleX = -1; break
          case 22:
            node.scaleX = 0.5
            node.scaleY = 0.5
            break
          case 23:
            node.scaleX = 2
            node.scaleY = 2
            break
        }

        const { width, height } = node
        if (width > height) {
          node.width = 130
          node.height = 130 / width * height
        } else if (width == height) {
          node.width = 130
          node.height = 130
        } else {
          node.height = 130
          node.width = 130 / height * width
        }

        if (width < height && node.angle != 0) {
          node.width = 130
          node.parent = this.itemNode
          c.init(this.prefabAtlas[i], this.node)
        }
      })
    }
  },

  over () {
    const node = new cc.Node('drawline')
    node.parent = this.node
    node.addComponent('drawlinesTest').waterNode = this.getWaterNode()

    const widget = node.addComponent(cc.Widget)
    widget.isAlignTop = true
    widget.top = 0
    widget.isAlignBottom = true
    widget.bottom = 0
    widget.isAlignLeft = true
    widget.left = 0
    widget.isAlignRight = true
    widget.right = 0
    console.log('over!!!')

    this.clearBtn.active = true
    this.testBtn.active = true
    this.bianjiBtn.active = true
    this.completeBtn.active = false
    this.recoverBtn.active = true
  },

  bianji () {
    this.clearLines()
    const node = cc.find('Canvas/level/drawline')
    node && node.destroy()

    this.node.children.forEach((node) => {
      for (let i = 0; i < rigids.length; i++) {
        if (node.name == rigids[i]) {
          node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static
        }
      }
    })

    this.clearBtn.active = false
    this.testBtn.active = false
    this.toFileBtn.active = false
    this.bianjiBtn.active = false
    this.recoverBtn.active = false
    this.completeBtn.active = true
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

  getLevelData (levelId) {
    const arr = []
    node.children.forEach(node => {
      if (node.y < -this.node.height / 2) return node.destroy()

      arr.push({
        name: node.name,
        x: node.x,
        y: node.y
      })
    })

    const data = cc.find('Canvas/level/drawline').getComponent('drawlinesTest').getLinesData()
    arr.push({ levelID: levelId, answer: data })
    console.log(JSON.stringify(arr))
    return arr
  },

  clearLines () {
    const drawLine = cc.find('Canvas/level/drawline')
    if (drawLine) drawLine.getComponent('drawlinesTest').clearLines()
  },

  startTest () {
    levelItems = this.getLevelData('test')
    this.node.children.forEach((node) => {
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

    cc.find('Canvas/level/drawline').getComponent('drawlinesTest').startTest()
    this.toFileBtn.active = true
  },

  recover () {
    this.clearLines()
    this.node.removeAllChildren()
    levelItems.forEach((item) => {
      if (item.name !== 'drawline') return

      const idx = this.getPrefab(item.name)
      const node = cc.instantiate(this.prefabAtlas[idx])
      node.addComponent('moveItem')
      node.x = item.x
      node.y = item.y
      node.parent = this.node

      if (item.name != 'out' && item.name != 'outTop' && item.name != 'outRight') return

      // 出水口放到0号位置
      node.setSiblingIndex(0)
    })

    this.clearBtn.active = false
    this.testBtn.active = false
    this.toFileBtn.active = false
    this.bianjiBtn.active = false
    this.recoverBtn.active = false
    this.completeBtn.active = true
  },

  getPrefab (name) {
    for (let i = 0; i < this.prefabAtlas.length; i++) {
      if (this.prefabAtlas[i].name == name) return i
    }
  },

  toFile () {
    if (wx.getFileSystemManager) {
      const fs = wx.getFileSystemManager()
      fs.readFile({
        filePath: wx.env.USER_DATA_PATH + '/level.json',
        encoding: 'utf8',
        success: (res) => {
          if (WorldController.changeLevel) {
            const levelData = JSON.parse(res.data)
            const levelId = this.changeNum + 1
            levelItems[levelItems.length - 1].levelID = levelId
            levelData[levelId - 1] = levelItems

            console.log('levelID:', levelId)

            fs.writeFile({
              filePath: wx.env.USER_DATA_PATH + '/level.json',
              data: JSON.stringify(levelData),
              success: (res) => {
                console.log('write file success' + res)
                this.clearLines()
                cc.find('Canvas/tishi').getComponent(cc.Graphics).clear()
                this.node.removeAllChildren()
                this.toFileBtn.active = false
                this.clearBtn.active = false
                this.testBtn.active = false
                this.bianjiBtn.active = false
                this.completeBtn.active = true
              },
              fail: (err) => {
                console.log('write file error' + err)
              }
            })
          } else {
            const levelData = JSON.parse(res.data)
            const levelId = levelData.length + 1
            levelItems[levelItems.length - 1].levelID = levelId
            console.log('levelID:', levelId)
            levelData.push(levelItems)

            fs.writeFile({
              filePath: wx.env.USER_DATA_PATH + '/level.json',
              data: JSON.stringify(levelData),
              success: (res) => {
                console.log('write file success' + res)
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

        fail: (err) => {
          console.log('read file null')
          const arr = []
          arr.push(this.getLevelData(1))
          fs.writeFile({
            filePath: wx.env.USER_DATA_PATH + '/level.json',
            data: JSON.stringify(arr),
            success: (res) => {
              console.log('write file success' + res)
              this.clearLines()
              this.node.removeAllChildren()
            },
            fail: (err) => {
              console.log('write file error' + err.errMsg)
            }
          })
        }
      })
    }
  },

  levelChange (level) {
    wx.getFileSystemManager().readFile({
      filePath: wx.env.USER_DATA_PATH + '/level.json',
      encoding: 'utf8',
      success: (res) => {
        const levelData = JSON.parse(res.data)
        levelItems = levelData[level]
        WorldController.changeLevel = true
        this.changeNum = level
        this.clearLines()
        this.node.removeAllChildren()

        levelItems.forEach((item) => {
          if (item.name !== 'drawline') {
            const idx = this.getPrefab(item.name)
            const node = cc.instantiate(this.prefabAtlas[idx])
            node.addComponent('moveItem')
            node.x = item.x
            node.y = item.y
            node.parent = this.node

            if (item.name != 'out' && item.name != 'outTop' && item.name != 'outRight') return

            node.setSiblingIndex(0)
          }

          if (!item.name) {
            const arr = item.answer
            const gl = cc.find('Canvas/tishi').getComponent(cc.Graphics)
            gl.clear()
            gl.moveTo(arr[0].x, arr[0].y - 30)
            arr.forEach((pos) => {
              gl.lineTo(pos.x, pos.y - 30)
              gl.stroke()
              gl.moveTo(pos.x, pos.y - 30)
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

      fail: (err) => {
        console.log('read file null')
      }
    })
  }
})
