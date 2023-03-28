cc.Class({
  extends: cc.Component,

  onLoad () {
    const node = this.node
    const t = cc.find('Canvas/level')
    this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
      node.position = t.convertToNodeSpaceAR(event.getLocation())
      node.children[0] && (node.children[0].position = cc.v2(0, 0))
    })

    this.node.on(cc.Node.EventType.TOUCH_CANCEL, (t) => {
      node.destroy()
    })
  }
})
