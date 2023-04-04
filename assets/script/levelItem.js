const LocalStorageData = require('LocalStorageData')
const WorldController = require('WorldController')

cc.Class({
  extends: cc.Component,
  properties: {
    levelNum: cc.Label,
    star: cc.SpriteFrame,
    starNo: cc.SpriteFrame,
    starNode: cc.Node,
    lock: cc.Node
  },

  init (level) {
    const levelNum = LocalStorageData.get('levelNum')
    if (level <= levelNum) {
      this.lock.active = false
      this.levelNum.string = level + 1
      const star = LocalStorageData.get('level' + level)
      let frame = this.star
      for (let i = 0; i < 3; i++) {
        if (i < star) frame = this.star
        else frame = this.starNo

        this.starNode.children[i].getComponent(cc.Sprite).spriteFrame = frame
      }
    } else {
      this.lock.active = true
    }

    this.node.on(cc.Node.EventType.TOUCH_END, () => {
      if (this.lock.active) {
        wx.showToast && wx.showToast({
          title: '关卡未解锁',
          icon: 'none',
          duration: 2000
        })
      } else {
        WorldController.currentLevel = level
        cc.director.loadScene('GameScene')
      }
    })
  }
})
