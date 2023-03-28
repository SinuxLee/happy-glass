const WorldController = require('WorldController')
const LocalStorageData = require('LocalStorageData')
const GameDataManager = require('GameDataManager')

cc.Class({
  extends: cc.Component,
  properties: {
    closeBtn: cc.Node,
    glassIcon: cc.Node,
    shareNode: cc.Node,
    videoNode: cc.Node,
    useBtn: cc.Node,
    glass1Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    glass2Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    glass3Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    glass4Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    glass5Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    glass6Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    glass7Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    glass8Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    rewardGlass: {
      default: [],
      type: cc.SpriteFrame
    },
    glass9Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    glass10Atlas: {
      default: [],
      type: cc.SpriteFrame
    }
  },

  onLoad () {
    this.showItem = false
  },

  onEnable () {
    setTimeout(() => this.closeBtn.active = true, 2e3)

    this.glass = []
    this.scheduleOnce(() => {
      this.tryNum = this.getGlassNum()
      if (this.showItem) {
        this.glass = this.rewardGlass
        this.videoNode.active = false
        this.shareNode.active = false
        this.useBtn.active = true
      } else {
        if (WorldController.currentLevel < 5) {
          this.videoNode.active = true
          this.shareNode.active = false
        } else if (WorldController.currentLevel % 2 == 1) {
          this.videoNode.active = false
          this.shareNode.active = true
        } else {
          this.videoNode.active = true
          this.shareNode.active = false
        }
        switch (this.tryNum) {
          case 0:
            this.glass = this.glass1Atlas
            break
          case 1:
            this.glass = this.glass2Atlas
            break
          case 2:
            this.glass = this.glass3Atlas
            break
          case 3:
            this.glass = this.glass4Atlas
            break
          case 4:
            this.glass = this.glass5Atlas
            break
          case 5:
            this.glass = this.glass6Atlas
            break
          case 6:
            this.glass = this.glass7Atlas
            break
          case 7:
            this.glass = this.glass8Atlas
            break
          default:
            this.glass = this.glass1Atlas
        }
      }
      this.glassIcon.getComponent(cc.Sprite).spriteFrame = this.glass[0]
    }, 0.02)

    let t = 0
    this.schedule(() => {
      t == 3 && (t = 0)
      this.glassIcon.getComponent(cc.Sprite).spriteFrame = this.glass[t]
      t++
    }, 1)

    WorldController.tryItem = false
    WorldController.tryWater = false
  },

  onRewardAdClose () {
    const e = cc.find('Canvas/tryItem').getComponent('tryItem')
    switch (e.rewardType) {
      case 1:
        WorldController.tryItem = true
        WorldController.tryNum = e.tryNum
        e.close()
        break
    }
  },

  onRewardAdStop () {
    cc.find('Canvas/tryItem').getComponent('tryItem').tishi == 1
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

  getGlassNum () {
    for (var e = [], t = 0; t < 8; t++) isNaN(LocalStorageData.get('glass' + t)) && (this.tryType = 1, e.push(t))
    return e.length > 0 ? e[Math.floor(Math.random(0, 0.99) * e.length)] : this.showItem ? void 0 : this.close()
  },

  getWaterNum () {
    for (let e = 0; e < 12; e++) {
      if (isNaN(LocalStorageData.get('water' + e))) return this.tryType = 2, e
    }
    return this.getPenNum()
  },

  getPenNum () {
    for (let e = 0; e < 6; e++) {
      if (isNaN(LocalStorageData.get('pen' + e))) return this.tryType = 3, e
    }
    return this.close()
  },

  tryBtn () {
    this.rewardType = 1
    this.tishi = 1
    GameDataManager.setRewardCloseClass(this.onRewardAdClose)
    GameDataManager.setRewardStopClass(this.onRewardAdStop)
  },

  shareBtn () {
    this.rewardType = 1
    this.tishi = 2
    GameDataManager.setRewardCloseClass(this.onRewardAdClose)
    GameDataManager.setRewardStopClass(this.onRewardAdStop)
    WorldController.share = true
  },

  useEvent () {
    LocalStorageData.set('glass9', 1)
    const e = LocalStorageData.get('selectGlass')
    LocalStorageData.set('glass' + e, 0)
    LocalStorageData.set('selectGlass', 9)
    this.close()
  },

  close () {
    this.node.active = false
    cc.find('Canvas/complete').active = true
    cc.find('Canvas/complete').getComponent('complete').init()
    cc.find('Canvas/music').getComponent('musicManager').winAudio()
  }
})
