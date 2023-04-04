cc.Class({
  extends: cc.Component,
  properties: {
    water: {
      type: cc.AudioClip,
      default: null
    },
    win: {
      type: cc.AudioClip,
      default: null
    },
    lose: {
      type: cc.AudioClip,
      default: null
    },
    complete: {
      type: cc.AudioClip,
      default: null
    },
    pen: {
      type: cc.AudioClip,
      default: null
    },
    button: {
      type: cc.AudioClip,
      default: null
    }
  },

  waterAudio () {
    cc.audioEngine.play(this.water, false, 0.5)
  },

  winAudio () {
    cc.audioEngine.play(this.win, false, 0.5)
  },

  loseAudio () {
    cc.audioEngine.play(this.lose, false, 0.5)
  },

  completeAudio () {
    cc.audioEngine.play(this.complete, false, 0.5)
  },

  buttonAudio () {
    cc.audioEngine.play(this.button, false, 0.5)
  },

  penAudio () {
    if (this.penEffect && cc.audioEngine.getState(this.penEffect) != -1) return
    this.penEffect = cc.audioEngine.play(this.pen, false, 0.5)
  },

  stopPenAudio () {
    cc.audioEngine.stop(this.penEffect)
  }
})
