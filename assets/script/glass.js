const WorldController = require('WorldController')
const LocalStorageData = require('LocalStorageData')

cc.Class({
  extends: cc.Component,
  properties: {
    complete: cc.ParticleSystem,
    glass1Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    glass2Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    glass3Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    glass4Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    glass5Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    glass6Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    glass7Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    glass8Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    glass9999Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    glass8888Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    glass9Atlas: {
      default: [],
      type: cc.SpriteFrame
    },
    glass10Atlas: {
      default: [],
      type: cc.SpriteFrame
    }
  },

  onLoad () {
    this.waterNum = 0
    this.glass = []
    let num = LocalStorageData.get('selectGlass')
    WorldController.tryItem && (num = WorldController.tryNum)
    switch (num) {
      case 0:
        this.glass = this.glass1Atlas
        break
      case 1:
        this.glass = this.glass2Atlas
        break
      case 2:
        this.glass = this.glass3Atlas
        break
      case 3:
        this.glass = this.glass4Atlas
        break
      case 4:
        this.glass = this.glass5Atlas
        break
      case 5:
        this.glass = this.glass6Atlas
        break
      case 6:
        this.glass = this.glass7Atlas
        break
      case 7:
        this.glass = this.glass8Atlas
        break
      case 9:
        this.glass = this.glass9999Atlas
        break
      case 8:
        this.glass = this.glass8888Atlas
        break
      case 10:
        this.glass = this.glass9Atlas
        break
      case 11:
        this.glass = this.glass10Atlas
        break
      default:
        this.glass = this.glass1Atlas
    }
    this.node.parent.getComponent(cc.Sprite).spriteFrame = this.glass[0]
  },

  onBeginContact (e, t, n) {
    if (!(n.tag == 111 && t.tag == 666)) {
      return
    }

    t.node.getComponent('glass').waterNum++
    e.disabled = true
    n.tag = 0

    this.waterNum >= WorldController.winWaterNum / 2 && this.waterNum < WorldController.winWaterNum && (t.node.parent.getComponent(cc.Sprite).spriteFrame = this.glass[1])

    if (!(this.waterNum >= WorldController.winWaterNum && !WorldController.win)) {
      return
    }

    t.node.parent.getComponent(cc.Sprite).spriteFrame = this.glass[2]
    WorldController.win = true
    console.log('success')

    const gameover = cc.find('Canvas/gameOver')
    if (gameover && !gameover.active) {
      cc.find('Canvas/music').getComponent('musicManager').completeAudio()
      t.node.getComponent('glass').complete.resetSystem()

      this.timeout = setTimeout(() => {
        if (WorldController.completeCount % 3 == 0) {
          cc.find('Canvas/rollLayer').active = true
        } else {
          cc.find('Canvas/tryItem').active = true
          WorldController.completeCount++
        }
      }, 1e3)
    }
  },

  onDestroy () {
    this.unscheduleAllCallbacks()
    clearTimeout(this.timeout)
  }
})
