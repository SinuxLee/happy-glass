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

  onLoad () {
    this.rewardNum = 0
  },

  onEnable () {
    isNaN(LocalStorageData.get('glass9')) || (this.zhuanpan.getComponent(cc.Sprite).spriteFrame = this.reward2)
  },

  onRewardAdClose () {
    const e = cc.find('Canvas/rollLayer').getComponent('rollReward')
    switch (e.rewardType) {
      case 1:
        e.zhuanpan.rotation = 0
        e.rewardNum++
        e.reward()
    }
  },

  onRewardAdStop () {
    const e = cc.find('Canvas/rollLayer').getComponent('rollReward')
    e.tishi == 1
      ? (wx.showToast({
          title: '只有观看完整视频才能获得奖励哦',
          icon: 'none',
          duration: 2500
        }), e.videoBtn.getComponent('cc.Button').interactable = true)
      : (wx.showToast({
          title: WorldController.shareError[Math.floor(3 * Math.random(0, 0.99))],
          icon: 'none',
          duration: 2500
        }), e.shareBtn.getComponent('cc.Button').interactable = true)
  },

  getRandom (e, t) {
    return Math.floor(Math.random(0, 0.99) * (t - e)) + e
  },

  getEnd (e) {
    console.log(e)
    return e < 2 ? this.getRandom(0, 360 / this.itemNum - 1) : e < 17 ? 360 / this.itemNum + this.getRandom(0, 360 / this.itemNum - 1) : e < 27 ? 360 / this.itemNum * 2 + this.getRandom(0, 360 / this.itemNum - 1) : e < 47 ? 360 / this.itemNum * 3 + this.getRandom(0, 360 / this.itemNum - 1) : e < 55 ? 360 / this.itemNum * 4 + this.getRandom(0, 360 / this.itemNum - 1) : e < 70 ? 360 / this.itemNum * 5 + this.getRandom(0, 360 / this.itemNum - 1) : e < 80 ? 360 / this.itemNum * 6 + this.getRandom(0, 360 / this.itemNum - 1) : 360 / this.itemNum * 7 + this.getRandom(0, 360 / this.itemNum - 1)
  },

  beginBtnEvent () {
    this.reward()
    this.beginBtn.getComponent('cc.Button').interactable = false
  },

  reward () {
    const t = this.getRandom(0, 100)
    const n = this.getEnd(t)

    this.zhuanpan.runAction(cc.sequence(
      cc.rotateBy(2, 2160).easing(cc.easeQuarticActionIn()),
      cc.rotateBy(3, n + 1080).easing(cc.easeQuarticActionOut()),
      cc.callFunc(() => {
        this.getReward(n)
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

  getReward (e) {
    switch (Math.floor((360 - e) / (360 / this.itemNum))) {
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
        isNaN(LocalStorageData.get('glass9'))
          ? (LocalStorageData.set('glass9', 0), this.showLayer.active = true, this.showLayer.getComponent('tryItem').showItem = true, this.node.active = false)
          : (LocalStorageData.updateGold(100), wx.showToast({
              title: '金币+100',
              icon: 'none',
              duration: 2e3
            }))
    }
  },

  tryBtn () {
    this.rewardType = 1
    this.tishi = 1
    GameDataManager.setRewardCloseClass(this.onRewardAdClose)
    GameDataManager.setRewardStopClass(this.onRewardAdStop)
    this.videoBtn.getComponent('cc.Button').interactable = false
  },

  shareEvent () {
    this.rewardType = 1
    this.tishi = 2
    GameDataManager.setRewardCloseClass(this.onRewardAdClose)
    GameDataManager.setRewardStopClass(this.onRewardAdStop)
    WorldController.share = true
    this.shareBtn.getComponent('cc.Button').interactable = false
  },

  close () {
    this.node.active = false
    cc.find('Canvas/complete').active = true
    cc.find('Canvas/complete').getComponent('complete').init()
    cc.find('Canvas/music').getComponent('musicManager').winAudio()
  }
})
