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
    const t = LocalStorageData.get('levelNum')
    if (level <= t) {
      this.lock.active = false
      this.levelNum.string = level + 1
      const n = LocalStorageData.get('level' + level)
      if (n == 3) {
        this.starNode.children[0].getComponent(cc.Sprite).spriteFrame = this.star
        this.starNode.children[1].getComponent(cc.Sprite).spriteFrame = this.star
        this.starNode.children[2].getComponent(cc.Sprite).spriteFrame = this.star
      } else if (n == 2) {
        this.starNode.children[0].getComponent(cc.Sprite).spriteFrame = this.star
        this.starNode.children[1].getComponent(cc.Sprite).spriteFrame = this.star
        this.starNode.children[2].getComponent(cc.Sprite).spriteFrame = this.starNo
      } else if (n == 1) {
        this.starNode.children[0].getComponent(cc.Sprite).spriteFrame = this.star
        this.starNode.children[1].getComponent(cc.Sprite).spriteFrame = this.starNo
        this.starNode.children[2].getComponent(cc.Sprite).spriteFrame = this.starNo
      } else {
        this.starNode.children[0].getComponent(cc.Sprite).spriteFrame = this.starNo
        this.starNode.children[1].getComponent(cc.Sprite).spriteFrame = this.starNo
        this.starNode.children[2].getComponent(cc.Sprite).spriteFrame = this.starNo
      }
    } else {
      this.lock.active = true
    }

    this.node.on(cc.Node.EventType.TOUCH_END, () => {
      if (this.lock.active) {
        wx.showToast && wx.showToast({
          title: '关卡未解锁',
          icon: 'none',
          duration: 2e3
        })
      } else {
        WorldController.currentLevel = level
        cc.director.loadScene('GameScene')
      }
    })
  }
})
