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

  onLoad() {
    this.showItem = false
  },

  onEnable() {
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

    this.schedule(() => {
      this.glassIcon.getComponent(cc.Sprite).spriteFrame = this.glass[0]
    }, 1)

    WorldController.tryItem = false
    WorldController.tryWater = false
  },

  onRewardAdClose() {
    const item = cc.find('Canvas/tryItem').getComponent('tryItem')
    switch (item.rewardType) {
      case 1:
        WorldController.tryItem = true
        WorldController.tryNum = item.tryNum
        item.close()
        break
    }
  },

  onRewardAdStop() {
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

  getGlassNum() {
    const arr = []
    for (let i = 0; i < 8; i++) {
      if (isNaN(LocalStorageData.get('glass' + i))) {
        this.tryType = 1
        arr.push(i)
      }
    }
    if (arr.length > 0) {
      return arr[Math.floor(Math.random(0, 0.99) * arr.length)]
    } else if (this.showItem) return 0 ; else this.close()
  },

  getWaterNum() {
    for (let i = 0; i < 12; i++) {
      if (isNaN(LocalStorageData.get('water' + i))) {
        this.tryType = 2
        return i
      }
    }
    return this.getPenNum()
  },

  getPenNum() {
    for (let i = 0; i < 6; i++) {
      if (isNaN(LocalStorageData.get('pen' + i))) {
        this.tryType = 3
        return i
      }
    }
    return this.close()
  },

  tryBtn() {
    this.rewardType = 1
    this.tishi = 1
    GameDataManager.setRewardCloseClass(this.onRewardAdClose)
    GameDataManager.setRewardStopClass(this.onRewardAdStop)
  },

  shareBtn() {
    this.rewardType = 1
    this.tishi = 2
    GameDataManager.setRewardCloseClass(this.onRewardAdClose)
    GameDataManager.setRewardStopClass(this.onRewardAdStop)
    WorldController.share = true
  },

  useEvent() {
    LocalStorageData.set('glass9', 1)
    const idx = LocalStorageData.get('selectGlass')
    LocalStorageData.set('glass' + idx, 0)
    LocalStorageData.set('selectGlass', 9)
    this.close()
  },

  close() {
    this.node.active = false
    cc.find('Canvas/complete').active = true
    cc.find('Canvas/complete').getComponent('complete').init()
    cc.find('Canvas/music').getComponent('musicManager').winAudio()
  }
})
