const WorldController = require('WorldController')
const LocalStorageData = require('LocalStorageData')
const GameDataManager = require('GameDataManager')

cc.Class({
  extends: cc.Component,
  properties: {
    star1: cc.Node,
    star2: cc.Node,
    starsNode: cc.Node,
    starSprite: cc.SpriteFrame,
    goldShow: cc.Node,
    shareButton: cc.Node,
    rewardIcon: cc.SpriteFrame
  },

  onLoad () {
    this.goldReward = 0
  },

  onEnable () {
    WorldController.playNum++,
    WorldController.repeat = false
  },

  init () {
    const level = LocalStorageData.get('levelNum')
    WorldController.currentLevel == level && LocalStorageData.set('levelNum', level + 1)

    if (WorldController.currentLevel < 5) {
      cc.find('Canvas/complete/completeNode/btnNode/shareBtn2').active = false
      cc.find('Canvas/complete/completeNode/btnNode/vedioBtn2').active = true
      cc.find('Canvas/complete/completeNode/btnNode/shareBtn').active = false
      cc.find('Canvas/complete/completeNode/btnNode/vedioBtn').active = true
    } else if (WorldController.currentLevel % 2 == 1) {
      cc.find('Canvas/complete/completeNode/btnNode/shareBtn2').active = true,
      cc.find('Canvas/complete/completeNode/btnNode/vedioBtn2').active = false,
      cc.find('Canvas/complete/completeNode/btnNode/shareBtn').active = false,
      cc.find('Canvas/complete/completeNode/btnNode/vedioBtn').active = true
    } else {
      cc.find('Canvas/complete/completeNode/btnNode/shareBtn2').active = false
      cc.find('Canvas/complete/completeNode/btnNode/vedioBtn2').active = true
      cc.find('Canvas/complete/completeNode/btnNode/shareBtn').active = true
      cc.find('Canvas/complete/completeNode/btnNode/vedioBtn').active = false
    }

    const penWidth = cc.find('Canvas/UILayer/pen/lineLength').width
    const action = cc.callFunc(this.shake, this)

    if (penWidth > this.star2.x + 120) {
      this.starsNode.children[1].children[1].active = false
      this.starsNode.children[2].children[1].active = false
      setTimeout(() => {
        this.starsNode.children[0].children[1].runAction(cc.sequence(cc.scaleTo(0.3, 1).easing(cc.easeCubicActionIn()), action))

        setTimeout(() => {
          this.starsNode.children[0].children[0].getComponent(cc.ParticleSystem).resetSystem()
          this.starsNode.children[1].children[1].active = true
          this.starsNode.children[1].children[1].runAction(cc.sequence(cc.scaleTo(0.3, 1).easing(cc.easeCubicActionIn()), action))
        }, 300)

        setTimeout(() => {
          this.starsNode.children[1].children[0].getComponent(cc.ParticleSystem).resetSystem()
          this.starsNode.children[2].children[1].active = true
          this.starsNode.children[2].children[1].runAction(cc.sequence(cc.scaleTo(0.3, 1).easing(cc.easeCubicActionIn()), action))
        }, 600)

        setTimeout(() => {
          this.starsNode.children[2].children[0].getComponent(cc.ParticleSystem).resetSystem()
        }, 900)
      }, 500)

      this.goldReward = LocalStorageData.updateLevelStar('level' + WorldController.currentLevel, 3, this.goldShow)
    } else if (penWidth > this.star1.x + 120) {
      this.starsNode.children[2].children[1].active = false
      this.starsNode.children[2].children[0].active = false
      this.starsNode.children[1].children[1].active = false
      setTimeout(() => {
        this.starsNode.children[0].children[1].runAction(cc.sequence(cc.scaleTo(0.3, 1).easing(cc.easeCubicActionIn()), action))
        setTimeout(() => {
          this.starsNode.children[0].children[0].getComponent(cc.ParticleSystem).resetSystem()
          this.starsNode.children[1].children[1].active = true
          this.starsNode.children[1].children[1].runAction(cc.sequence(cc.scaleTo(0.3, 1).easing(cc.easeCubicActionIn()), action))
        }, 300)

        setTimeout(() => {
          this.starsNode.children[1].children[0].getComponent(cc.ParticleSystem).resetSystem()
        }, 600)
      }, 500)

      this.goldReward = LocalStorageData.updateLevelStar('level' + WorldController.currentLevel, 2, this.goldShow)
    } else {
      this.starsNode.children[1].children[1].active = false
      this.starsNode.children[2].children[1].active = false
      this.starsNode.children[1].children[0].active = false
      this.starsNode.children[2].children[0].active = false
      setTimeout(() => {
        this.starsNode.children[0].children[1].runAction(cc.sequence(cc.scaleTo(0.3, 1).easing(cc.easeCubicActionIn()), action))
        setTimeout(() => {
          this.starsNode.children[0].children[0].getComponent(cc.ParticleSystem).resetSystem()
        }, 300)
      }, 500)

      this.goldReward = LocalStorageData.updateLevelStar('level' + WorldController.currentLevel, 1, this.goldShow)
    }
  },

  shake () {
    const node = cc.find('Canvas/complete/completeNode')
    this.schedule(() => {
      node.position = cc.v2(5 * (Math.random(0, 1) - 0.5), 5 * (Math.random(0, 1) - 0.5))
    }, 0.05, 4)
  },

  onRewardAdClose () {
    const e = cc.find('Canvas/complete').getComponent('complete')
    switch (e.rewardType) {
      case 2:
        LocalStorageData.updateGold(30)
        wx.showToast({
          title: '成功领取30金币',
          icon: 'none',
          duration: 2e3
        })
        cc.find('Canvas/complete/completeNode/btnNode/shareBtn').active ? (cc.find('Canvas/complete/completeNode/btnNode/shareBtn').active = false, cc.find('Canvas/complete/completeNode/btnNode/vedioBtn').active = true) : (cc.find('Canvas/complete/completeNode/btnNode/shareBtn').active = true, cc.find('Canvas/complete/completeNode/btnNode/vedioBtn').active = false), WorldController.currentLevel < 5 && (cc.find('Canvas/complete/completeNode/btnNode/shareBtn2').active = false, cc.find('Canvas/complete/completeNode/btnNode/vedioBtn2').active = true, cc.find('Canvas/complete/completeNode/btnNode/shareBtn').active = false, cc.find('Canvas/complete/completeNode/btnNode/vedioBtn').active = true)
        break
      case 3:
        LocalStorageData.updateGold(2 * e.goldReward)
        wx.showToast({
          title: '成功领取3倍奖励',
          icon: 'none',
          duration: 2e3
        })
        cc.find('Canvas/complete/completeNode/btnNode/shareBtn2').active ? cc.find('Canvas/complete/completeNode/btnNode/shareBtn2').getComponent(cc.Button).interactable = false : cc.find('Canvas/complete/completeNode/btnNode/vedioBtn2').getComponent(cc.Button).interactable = false
    }
  },

  onRewardAdStop () {
    switch (cc.find('Canvas/complete').getComponent('complete').vedio) {
      case 1:
        wx.showToast({
          title: '只有观看完整视频才能获得奖励哦',
          icon: 'none',
          duration: 2500
        })
        break
      case 2:
        WorldController.currentLevel < 5
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
    }
  },

  nextLevelBtn () {
    WorldController.waterIsSpawn = WorldController.win = false

    if (WorldController.currentLevel + 1 >= WorldController.levelNum) {
      wx.showToast({
        title: '敬请期待后续关卡！',
        icon: 'none',
        duration: 2e3
      })
      this.click = false

      return
    }
    this.nextLevel()
  },

  nextLevel () {
    WorldController.currentLevel++
    cc.director.loadScene('GameScene')
  },

  shareBtn () {
    this.rewardType = 2
    this.vedio = 2
    GameDataManager.setRewardCloseClass(this.onRewardAdClose)
    GameDataManager.setRewardStopClass(this.onRewardAdStop)
    WorldController.share = true
  },

  vedioBtn () {
    this.rewardType = 2
    this.vedio = 1
    GameDataManager.setRewardCloseClass(this.onRewardAdClose)
    GameDataManager.setRewardStopClass(this.onRewardAdStop)
  },

  shareBtn2 () {
    this.rewardType = 3
    this.vedio = 2
    GameDataManager.setRewardCloseClass(this.onRewardAdClose)
    GameDataManager.setRewardStopClass(this.onRewardAdStop)
    WorldController.share = true
  },

  vedioBtn2 () {
    this.rewardType = 3
    this.vedio = 1
    GameDataManager.setRewardCloseClass(this.onRewardAdClose)
    GameDataManager.setRewardStopClass(this.onRewardAdStop)
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
    WorldController.waterIsSpawn = WorldController.win = false
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
