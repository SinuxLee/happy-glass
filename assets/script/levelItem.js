const a = require('LocalStorageData')
const o = require('WorldController')
cc.Class({
  extends: cc.Component,
  properties: {
    levelNum: cc.Label,
    star: cc.SpriteFrame,
    starNo: cc.SpriteFrame,
    starNode: cc.Node,
    lock: cc.Node
  },
  init: function (e) {
    const t = a.get('levelNum')
    if (e <= t) {
      this.lock.active = !1, this.levelNum.string = e + 1
      const n = a.get('level' + e)
      n == 3 ? (this.starNode.children[0].getComponent(cc.Sprite).spriteFrame = this.star, this.starNode.children[1].getComponent(cc.Sprite).spriteFrame = this.star, this.starNode.children[2].getComponent(cc.Sprite).spriteFrame = this.star) : n == 2 ? (this.starNode.children[0].getComponent(cc.Sprite).spriteFrame = this.star, this.starNode.children[1].getComponent(cc.Sprite).spriteFrame = this.star, this.starNode.children[2].getComponent(cc.Sprite).spriteFrame = this.starNo) : n == 1 ? (this.starNode.children[0].getComponent(cc.Sprite).spriteFrame = this.star, this.starNode.children[1].getComponent(cc.Sprite).spriteFrame = this.starNo, this.starNode.children[2].getComponent(cc.Sprite).spriteFrame = this.starNo) : (this.starNode.children[0].getComponent(cc.Sprite).spriteFrame = this.starNo, this.starNode.children[1].getComponent(cc.Sprite).spriteFrame = this.starNo, this.starNode.children[2].getComponent(cc.Sprite).spriteFrame = this.starNo)
    } else this.lock.active = !0
    this.node.on(cc.Node.EventType.TOUCH_END, function () {
      this.lock.active
        ? wx.showToast && wx.showToast({
          title: '关卡未解锁',
          icon: 'none',
          duration: 2e3
        })
        : o.currentLevel = e, cc.director.loadScene('GameScene')
    }, this)
  }
})
