cc.Class({
  extends: cc.Component,

  onLoad () {
    const levelNode = cc.find('Canvas/level')

    this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
      this.node.position = levelNode.convertToNodeSpaceAR(event.getLocation())

      if (this.node.children[0]) this.node.children[0].position = cc.v2(0, 0)
    })

    this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event) => this.node.destroy())
  }
})
