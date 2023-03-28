const LocalStorageData = require('LocalStorageData')
const GameDataManager = require('GameDataManager')

cc.Class({
  extends: cc.Component,

  onLoad () {
    const singleDay = this.changeToDate(Date.now()) % 2 == 1
    cc.find('Canvas/checkIn/矩形3@2x/体力拷贝7@2x').active = singleDay
    cc.find('Canvas/checkIn/矩形3@2x/金币@2x').active = !singleDay
  },

  onRewardAdClose () {
    const checkIn = cc.find('Canvas/checkIn').getComponent('checkIn')
    switch (checkIn.rewardType) {
      case 1:
        LocalStorageData.updateGold(150)
        wx.showToast({
          title: '成功领取150金币',
          icon: 'none',
          duration: 2e3
        })
        cc.find('Canvas/ui/gold/goldNum').getComponent(cc.Label).string = LocalStorageData.get('gold')
        checkIn.close()
        break
      case 2:
        LocalStorageData.updateGold(300)
        wx.showToast({
          title: '成功领取300金币',
          icon: 'none',
          duration: 2e3
        })
        cc.find('Canvas/ui/gold/goldNum').getComponent(cc.Label).string = LocalStorageData.get('gold')
        checkIn.close()
        break
    }
    cc.find('Canvas/checkIn/矩形3@2x/视频双倍领取@2x').getComponent(cc.Button).interactable = false,
    cc.find('Canvas/checkIn/矩形3@2x/领取@2x').getComponent(cc.Button).interactable = false,
    LocalStorageData.set('checkInDate', checkIn.changeToDate(Date.now()))
  },

  changeToDate (ts) {
    return Math.floor(ts / 864e5)
  },

  onRewardAdStop () {
    cc.find('Canvas/checkIn').getComponent('checkIn')
    wx.showToast({
      title: '只有观看完整视频才能获得奖励哦',
      icon: 'none',
      duration: 2500
    })
  },

  checkIn () {
    cc.find('Canvas/checkIn/矩形3@2x/体力拷贝7@2x').active ? this.rewardType = 3 : this.rewardType = 1
    this.onRewardAdClose()
  },

  doubleCheckIn () {
    cc.find('Canvas/checkIn/矩形3@2x/体力拷贝7@2x').active ? this.rewardType = 4 : this.rewardType = 2

    GameDataManager.setRewardCloseClass(this.onRewardAdClose)
    GameDataManager.setRewardStopClass(this.onRewardAdStop)
  },

  close () {
    cc.find('Canvas/checkIn/矩形3@2x').runAction(
      cc.sequence(
        cc.scaleTo(0.5, 0),
        cc.callFunc(() => this.node.active = false, this)
      )
    )
  }
})
