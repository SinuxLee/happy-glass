cc.Class({
  extends: cc.Component,

  // 呼吸特效
  onEnable () {
    this.node.runAction(cc.repeatForever(cc.sequence(
      cc.scaleTo(1, 1.2),
      cc.scaleTo(1, 1)
    )))
  }
})
