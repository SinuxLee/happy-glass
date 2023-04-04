const WorldController = require('WorldController')
const LocalStorageData = require('LocalStorageData')
const GameDataManager = require('GameDataManager')
const userType = require('userType')

cc.Class({
  extends: cc.Component,
  properties: {
    star1: cc.Node,
    star2: cc.Node,
    line: cc.Node,
    starsNode: cc.Node,
    goldLabel: cc.Label,
    levelShow: cc.Label,
    hand: cc.Node,
    wenzi: cc.Node,
    light: cc.Node,
    tryWaterNode: cc.Node,
    tishiNode: cc.Node,
    videoTishi: cc.SpriteFrame
  },

  onLoad () {
    const gold = LocalStorageData.get('gold')
    if (gold == null) {
      this.goldLabel.string = 0
      LocalStorageData.set('gold', 0)
    } else {
      this.goldLabel.string = gold
    }

    const level = WorldController.currentLevel + 1
    this.levelShow.string = `第${level}关`
    WorldController.getLevelData(this.showStarLine, this)
    this.lineLengthResume()

    const node = cc.find('Canvas/UILayer/pen/lineLength')
    this.schedule(() => {
      if (node.width < this.star1.x + 120) {
        this.starsNode.children[1].active = false
        this.starsNode.children[2].active = false
      } else if (node.width < this.star2.x + 120) {
        this.starsNode.children[2].active = false
      }
    }, 0.5)

    if (WorldController.currentLevel < 5) {
      this.tryWaterNode.active = false
      this.tishiNode.getComponent(cc.Sprite).spriteFrame = this.videoTishi
    }
  },

  start () {
    if (WorldController.currentLevel == 0) {
      WorldController.getLevelData(this.getAnswer, this)
      let e = cc.v2(0, 0)
      let t = cc.v2(0, 0)
      WorldController.levelData[0].forEach((n) => {
        if (!n.name) {
          const a = n.answer
          e = cc.v2(a[0].x, a[0].y)
          t = cc.v2(a[1].x, a[1].y)
        }
      })

      this.wenzi.active = true
      this.hand.active = true
      this.hand.runAction(cc.repeatForever(cc.sequence(
        cc.moveTo(1, t),
        cc.delayTime(0.5),
        cc.callFunc(() => {
          this.hand.position = e
        })
      )))

      LocalStorageData.set('first', 1)
    }

    setTimeout(() => {
      WorldController.repeat && this.light && (this.light.active = true)
    }, 1e3)

    WorldController.tryWaterNum = Math.floor(6 * Math.random(0, 0.99))
    this.tryWaterNode.children[0].color = userType.tryWaterColor[WorldController.tryWaterNum]
  },

  onRewardAdClose () {
    const e = cc.find('Canvas/UILayer/tishi').getComponent('tishi')
    console.log(e.rewardType)
    switch (e.rewardType) {
      case 1:
        var t = LocalStorageData.get('gold')
        LocalStorageData.set('gold', t + 50)
        e.goldLabel.string = LocalStorageData.get('gold')
        break
      case 2:
        e.light.active = false
        WorldController.repeat = false
        WorldController.getLevelData(e.getAnswer, e)
        break
      case 3:
        WorldController.totalLength = 3e3
        cc.find('Canvas/level/drawLine').getComponent('drawlines').addCanDrawTotalLength()
        break
      case 4:
        WorldController.tryWater = true
        wx.showToast({
          title: '试用成功！',
          icon: 'none',
          duration: 2e3
        })
    }
  },

  onRewardAdStop () {
    cc.find('Canvas/UILayer/tishi').getComponent('tishi').tishi == 1 || WorldController.currentLevel < 5
      ? wx.showToast({
        title: '只有观看完整视频才能获得奖励哦',
        icon: 'none',
        duration: 2500
      })
      : wx.showToast({
        title: WorldController.shareError[Math.floor(3 * Math.random(0, 0.99))],
        icon: 'none',
        duration: 2500
      })
  },

  goldAddBtn () {
    this.rewardType = 1
    wx.showModal({
      title: '提示',
      content: '是否观看视频获取金币？',
      success: (t) => {
        t.confirm ? (console.log('用户点击确定'), GameDataManager.setRewardCloseClass(this.onRewardAdClose), GameDataManager.setRewardStopClass(this.onRewardAdStop)) : t.cancel && console.log('用户点击取消')
      }
    })
  },

  restartBtn () {
    WorldController.waterIsSpawn = false
    WorldController.begin = false
    WorldController.win = false
    WorldController.repeat = true
    cc.director.loadScene('GameScene')
  },

  backBtn () {
    WorldController.waterIsSpawn = false
    WorldController.begin = false
    cc.director.loadScene('MenuScene')
  },

  showTishi () {
    this.rewardType = 2
    this.tishi = 1
    GameDataManager.setRewardCloseClass(this.onRewardAdClose)
    GameDataManager.setRewardStopClass(this.onRewardAdStop)
  },

  shareTishi () {
    this.rewardType = 2
    this.tishi = 2
    this.onRewardAdClose()
  },

  lineLengthAdd () {
    this.rewardType = 3
    this.tishi = 1
    GameDataManager.setRewardCloseClass(this.onRewardAdClose)
    GameDataManager.setRewardStopClass(this.onRewardAdStop)
  },

  lineLengthResume () {
    WorldController.totalLength = 1500
  },

  tryWater () {
    this.rewardType = 4
    this.tishi = 1
    GameDataManager.setRewardCloseClass(this.onRewardAdClose)
    GameDataManager.setRewardStopClass(this.onRewardAdStop)
  },

  showStarLine (e, t) {
    WorldController.levelData[e].forEach((e) => {
      if (!e.name) {
        for (var n = e.answer, o = 0, c = 1; c < n.length; c++) o += Math.sqrt(Math.pow(n[c].x - n[c - 1].x, 2) + Math.pow(n[c].y - n[c - 1].y, 2))
        const i = o / WorldController.totalLength
        t.star2.x = 1.5 * i > 0.5 ? 0 : t.line.width / 2 - t.line.width * i * 1.5, 2 * i > 0.8 ? t.star1.x = 0.3 * -t.line.width : (t.star1.x = t.line.width / 2 - t.line.width * i * 2, (t.star1.x - t.star2.x) / 240 < 0.2 && (t.star1.x = t.star2.x - 48))
      }
    })
  },

  getAnswer (e, t) {
    WorldController.levelData[e].forEach((e) => {
      if (!e.name) {
        const n = e.answer
        const gl = t.node.getComponent(cc.Graphics)
        gl.moveTo(n[0].x, n[0].y - 30)
        n.forEach((e) => {
          gl.lineTo(e.x, e.y - 30)
          gl.stroke()
          gl.moveTo(e.x, e.y - 30)
        })
      }
    })
  },

  onDestroy () {
    this.lineLengthResume()
  }
})
