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
    const game = cc.find('Canvas').getComponent('Game')
    let gold = LocalStorageData.get('gold')
    gold += 50

    LocalStorageData.set('gold', gold)
    game.goldLabel.string = gold.toString()
    game.shopGoldLabel.string = gold.toString()
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

    if (isNaN(LocalStorageData.get('gold'))) {
      this.goldLabel.string = 0
      LocalStorageData.set('gold', 0)
    } else {
      this.goldLabel.string = LocalStorageData.get('gold')
    }

    if (isNaN(LocalStorageData.get('gold'))) {
      this.shopGoldLabel.string = 0
      LocalStorageData.set('gold', 0)
    } else {
      this.shopGoldLabel.string = LocalStorageData.get('gold')
    }

    const lv = LocalStorageData.get('levelNum')
    if (lv == null) {
      this.levelNum.string = '第1关',
      LocalStorageData.set('levelNum', 0)
    } else {
      this.levelNum.string = `第${lv + 1}关`
    }

    console.log('date', this.changeToDate(Date.now()) > LocalStorageData.get('checkInDate'))
    isNaN(LocalStorageData.get('checkInDate')) ? cc.find('Canvas/checkIn').active = true : this.changeToDate(Date.now()) > LocalStorageData.get('checkInDate') && (cc.find('Canvas/checkIn').active = true)
  },

  changeToDate (e) {
    return Math.floor(e / 864e5)
  },

  setBlockInputEvents (block) {
    this.maskLayer.active = block
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

  startBtn () {
    if (!this.click) {
      this.click = true
      WorldController.getcurrentLevel()
      if (WorldController.currentLevel >= WorldController.levelNum) {
        return wx.showToast({
          title: '敬请期待后续关卡！',
          icon: 'none',
          duration: 2000
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
        if (b.confirm) {
          console.log('用户点击确定')
          GameDataManager.setRewardCloseClass(this.onRewardAdClose)
          GameDataManager.setRewardStopClass(this.onRewardAdStop)
        } else {
          b.cancel && console.log('用户点击取消')
        }
      }
    })
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
