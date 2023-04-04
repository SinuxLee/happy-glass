const WorldController = require('WorldController')

cc.Class({
  extends: cc.Component,

  onEnable () {
    WorldController.begin = false
    WorldController.tryItem = false
    WorldController.tryWater = false
    WorldController.playNum++
    WorldController.playNum % 3 == 0
  },

  onRewardAdClose () {
  },

  onRewardAdStop () {
    wx.showToast({
      title: '只有观看完整视频才能获得奖励哦',
      icon: 'none',
      duration: 2500
    })
  },

  restartBtn () {
    WorldController.waterIsSpawn = false
    WorldController.win = false
    this.restart()
  },

  restart () {
    cc.director.loadScene('GameScene')
  },

  backBtn () {
    WorldController.waterIsSpawn = false
    WorldController.win = false
    cc.director.loadScene('MenuScene')
  },

  changeTime (e) {
    let t = ''
    const n = Math.floor(e / 60)
    t = n < 10 ? '0' + n : n
    const a = e % 60
    return t = a < 10 ? t + ':0' + a : t + ':' + a
  }
})
