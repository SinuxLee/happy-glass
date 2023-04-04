cc.Class({
  extends: cc.Component,

  onBeginContact (contact, selfCollider, otherCollider) {
    otherCollider.tag == 111 && otherCollider.node.destroy()

    if (otherCollider.tag == 999 && selfCollider.tag == 888) {
      selfCollider.tag = 0
      if (cc.find('Canvas/complete').active) return

      this.timeout = setTimeout(() => {
        cc.find('Canvas/gameOver').active = true
        cc.find('Canvas/music').getComponent('musicManager').loseAudio()
      }, 1000)

      otherCollider.node.destroy()
    }
  },

  onDestroy () {
    this.unscheduleAllCallbacks()
    clearTimeout(this.timeout)
  }
})
