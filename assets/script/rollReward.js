const LocalStorageData = require('LocalStorageData')
const WorldController = require('WorldController')
const GameDataManager = require('GameDataManager')

cc.Class({
  extends: cc.Component,
  properties: {
    zhuanpan: cc.Node,
    beginBtn: cc.Node,
    itemNum: 8,
    showLayer: cc.Node,
    shareBtn: cc.Node,
    videoBtn: cc.Node,
    closeBtn: cc.Node,
    reward2: cc.SpriteFrame
  },

  onLoad() {
    this.rewardNum = 0
  },

  onEnable() {
    if (isNaN(LocalStorageData.get('glass9'))) return

    this.zhuanpan.getComponent(cc.Sprite).spriteFrame = this.reward2
  },

  onRewardAdClose() {
    const reward = cc.find('Canvas/rollLayer').getComponent('rollReward')
    switch (reward.rewardType) {
      case 1:
        reward.zhuanpan.angle = 0
        reward.rewardNum++
        reward.reward()
    }
  },

  onRewardAdStop() {
    const reward = cc.find('Canvas/rollLayer').getComponent('rollReward')
    if (reward.tishi == 1) {
      wx.showToast({
        title: '只有观看完整视频才能获得奖励哦',
        icon: 'none',
        duration: 2500
      })
      reward.videoBtn.getComponent('cc.Button').interactable = true
    } else {
      wx.showToast({
        title: WorldController.shareError[Math.floor(3 * Math.random(0, 0.99))],
        icon: 'none',
        duration: 2500
      })
      reward.shareBtn.getComponent('cc.Button').interactable = true
    }
  },

  getRandom(min, max) {
    return Math.floor(Math.random(0, 0.99) * (max - min)) + min
  },

  getEnd(rnd) {
    if(rnd < 2) return this.getRandom(0, 360 / this.itemNum - 1)
    else if (rnd < 17) return 360 / this.itemNum + this.getRandom(0, 360 / this.itemNum - 1)
    else if(rnd < 27) return 360 / this.itemNum * 2 + this.getRandom(0, 360 / this.itemNum - 1)
    else if(rnd < 47) return 360 / this.itemNum * 3 + this.getRandom(0, 360 / this.itemNum - 1)
    else if(rnd < 55) return 360 / this.itemNum * 4 + this.getRandom(0, 360 / this.itemNum - 1)
    else if(rnd < 70) return 360 / this.itemNum * 5 + this.getRandom(0, 360 / this.itemNum - 1)
    else if(rnd < 80) return 360 / this.itemNum * 6 + this.getRandom(0, 360 / this.itemNum - 1) 
    else return 360 / this.itemNum * 7 + this.getRandom(0, 360 / this.itemNum - 1)
  },

  beginBtnEvent() {
    this.reward()
    this.beginBtn.getComponent('cc.Button').interactable = false
  },

  reward() {
    const rnd = this.getRandom(0, 100)
    const angle = this.getEnd(rnd)

    this.zhuanpan.runAction(cc.sequence(
      cc.rotateBy(2, 2160).easing(cc.easeQuarticActionIn()),
      cc.rotateBy(3, angle + 1080).easing(cc.easeQuarticActionOut()),
      cc.callFunc(() => {
        this.getReward(angle)
        this.beginBtn.active = false
        this.rewardNum
        if (WorldController.currentLevel < 5) {
          this.videoBtn.active = true
          this.videoBtn.getComponent(cc.Button).interactable = true
        } else if (this.shareBtn.active) {
          this.videoBtn.active = true
          this.shareBtn.active = false
          this.videoBtn.getComponent(cc.Button).interactable = true
        } else {
          this.shareBtn.active = true
          this.videoBtn.active = false
          this.shareBtn.getComponent(cc.Button).interactable = true
        }
        this.closeBtn.active = true
      })
    ))
  },

  getReward(angle) {
    switch (Math.floor((360 - angle) / (360 / this.itemNum))) {
      case 0:
        LocalStorageData.updateGold(20)
        wx.showToast({
          title: '金币+20',
          icon: 'none',
          duration: 2e3
        })
        break
      case 1:
        LocalStorageData.updateGold(80)
        wx.showToast({
          title: '金币+80',
          icon: 'none',
          duration: 2e3
        })
        break
      case 2:
        LocalStorageData.updateGold(50)
        wx.showToast({
          title: '金币+50',
          icon: 'none',
          duration: 2e3
        })
        break
      case 3:
        LocalStorageData.updateGold(100)
        wx.showToast({
          title: '金币+100',
          icon: 'none',
          duration: 2e3
        })
        break
      case 4:
        LocalStorageData.updateGold(20)
        wx.showToast({
          title: '金币+20',
          icon: 'none',
          duration: 2e3
        })
        break
      case 5:
        LocalStorageData.updateGold(80)
        wx.showToast({
          title: '金币+80',
          icon: 'none',
          duration: 2e3
        })
        break
      case 6:
        LocalStorageData.updateGold(50)
        wx.showToast({
          title: '金币+50',
          icon: 'none',
          duration: 2e3
        })
        break
      case 7:
        if(isNaN(LocalStorageData.get('glass9'))){
          LocalStorageData.set('glass9', 0)
          this.showLayer.active = true
          this.showLayer.getComponent('tryItem').showItem = true
          this.node.active = false
        }else {
          LocalStorageData.updateGold(100)
          wx.showToast({
            title: '金币+100',
            icon: 'none',
            duration: 2e3
          })
        }
    }
  },

  tryBtn() {
    this.rewardType = 1
    this.tishi = 1
    GameDataManager.setRewardCloseClass(this.onRewardAdClose)
    GameDataManager.setRewardStopClass(this.onRewardAdStop)
    this.videoBtn.getComponent('cc.Button').interactable = false
  },

  shareEvent() {
    this.rewardType = 1
    this.tishi = 2
    GameDataManager.setRewardCloseClass(this.onRewardAdClose)
    GameDataManager.setRewardStopClass(this.onRewardAdStop)
    WorldController.share = true
    this.shareBtn.getComponent('cc.Button').interactable = false
  },

  close() {
    this.node.active = false
    cc.find('Canvas/complete').active = true
    cc.find('Canvas/complete').getComponent('complete').init()
    cc.find('Canvas/music').getComponent('musicManager').winAudio()
  }
})
