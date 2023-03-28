const AudioManager = require('AudioManager')
const GameDataManager = require('GameDataManager')
const LocalStorageData = require('LocalStorageData')
const WorldController = require('WorldController')

cc.Class({
  extends: cc.Component,
  properties: {
    maskLayer: cc.Node,
    shopLayer: cc.Node,
    goldLabel: cc.Label,
    shopGoldLabel: cc.Label,
    levelNum: cc.Label,
    levelSelect: cc.Node,
    shopBtn: cc.Node,
    levelData: cc.JsonAsset
  },

  onLoad () {
    WorldController.setLevelData(this.levelData.json)
  },

  onRewardAdClose () {
    const e = cc.find('Canvas').getComponent('Game')
    const _ = LocalStorageData.get('gold')
    LocalStorageData.set('gold', _ + 50),
    e.goldLabel.string = LocalStorageData.get('gold'),
    e.shopGoldLabel.string = LocalStorageData.get('gold')
  },

  onRewardAdStop () {
    wx.showToast({
      title: '只有观看完整视频才能获得奖励哦',
      icon: 'none',
      duration: 2500
    })
  },

  start () {
    cc.director.preloadScene('GameScene')
    if (isNaN(LocalStorageData.get('gold')) ? (this.goldLabel.string = 0, LocalStorageData.set('gold', 0)) : this.goldLabel.string = LocalStorageData.get('gold'),
    isNaN(LocalStorageData.get('gold'))
      ? (this.shopGoldLabel.string = 0,
        LocalStorageData.set('gold', 0))
      : this.shopGoldLabel.string = LocalStorageData.get('gold'),
    isNaN(LocalStorageData.get('levelNum'))) {
      this.levelNum.string = '第1关',
      LocalStorageData.set('levelNum', 0)
    } else {
      const e = LocalStorageData.get('levelNum') + 1
      this.levelNum.string = '第' + e + '关'
    }
    console.log('date', this.changeToDate(Date.now()) > LocalStorageData.get('checkInDate')),
    isNaN(LocalStorageData.get('checkInDate')) ? cc.find('Canvas/checkIn').active = true : this.changeToDate(Date.now()) > LocalStorageData.get('checkInDate') && (cc.find('Canvas/checkIn').active = true)
  },

  changeToDate (e) {
    return Math.floor(e / 864e5)
  },

  showGameBox (e) {},

  setBlockInputEvents (e) {
    this.maskLayer.active = e
  },

  inviteClicked (e) {
    this.inviteDialog.active = true
    this.setBlockInputEvents(true)
    AudioManager.playButtonClickEffect()
  },
  closeClicked (e) {
    e.currentTarget.parent.active = false
    this.setBlockInputEvents(false)
  },

  cleanInviteData () {

  },

  startBtn () {
    if (!this.click) {
      this.click = true
      WorldController.getcurrentLevel()
      if (WorldController.currentLevel >= WorldController.levelNum) {
        return wx.showToast({
          title: '敬请期待后续关卡！',
          icon: 'none',
          duration: 2e3
        })
      }

      this.click = false
      this.startGame()
    }
  },

  startGame () {
    this.click = false
    cc.director.loadScene('GameScene')
  },

  goldAddBtn () {
    this.rewardType = 0
    wx.showModal({
      title: '提示',
      content: '是否观看视频获取金币？',
      success: (b) => {
        b.confirm
          ? (console.log('用户点击确定'), GameDataManager.setRewardCloseClass(this.onRewardAdClose),
            GameDataManager.setRewardStopClass(this.onRewardAdStop))
          : b.cancel && console.log('用户点击取消')
      }
    })
  },

  openRank () {
  },

  closeRank () {
  },

  openShop () {
    this.shopLayer.active = true
  },

  closeShop () {
    this.shopLayer.active = false
  },

  selectBtn () {
    this.levelSelect.active = true
  },

  shareBtn () {
  },

  shareEvent () {
  },

  updateShopGold () {
    isNaN(LocalStorageData.get('gold'))
      ? (this.shopGoldLabel.string = 0, this.goldLabel.string = LocalStorageData.get('gold'),
        LocalStorageData.set('gold', 0))
      : (this.shopGoldLabel.string = LocalStorageData.get('gold'),
        this.goldLabel.string = LocalStorageData.get('gold'))
  },

  changeTime (e) {
    let b = ''
    const _ = Math.floor(e / 60)
    b = _ < 10 ? '0' + _ : _
    const x = e % 60
    return x < 10 ? b + ':0' + x : b + ':' + x
  }
})
