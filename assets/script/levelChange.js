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
    this.lock.active = false
    this.levelNum.string = level + 1
    this.node.on(cc.Node.EventType.TOUCH_END, () => {
      if (this.lock.active) {
        wx.showToast && wx.showToast({
          title: '关卡未解锁',
          icon: 'none',
          duration: 2000
        })
      } else {
        cc.find('Canvas/level').getComponent('test').levelChange(level)
        cc.find('Canvas/levelSelect').getComponent('levelSelect').close()
      }
    })
  }
})
