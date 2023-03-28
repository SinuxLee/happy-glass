
const x = require('GameDataManager')
module.exports = {
  bgm: null,
  audioResArray: [],
  preloadAudio: function (e) {
    const b = this
    cc.loader.loadResDir(e, cc.AudioClip, function (e, _) {
      e ? console.error('资源加载错误') : b.audioResArray = _
    }), cc.audioEngine.setMusicVolume(0.3)
  },
  getAudioClipByName: function (e) {
    for (let b = 0; b < this.audioResArray.length; b++) { if (this.audioResArray[b]._name == e) return this.audioResArray[b] }
    return null
  },
  playEffect: function (e) {
    const b = arguments.length > 1 && void 0 !== arguments[1] && arguments[1]
    if (x.sound) {
      const _ = this.getAudioClipByName(e)
      cc.audioEngine.playEffect(_, b)
    }
  },
  stopAllEffect: function () {
    cc.audioEngine.stopAllEffects()
  },
  playButtonClickEffect: function () {
    this.playEffect('click')
  },
  stopAllAudios: function () {
    cc.audioEngine.stopAll()
  },
  pauseAllAudios: function () {
    cc.audioEngine.pauseAll()
  },
  resumeAllAudio: function () {
    cc.audioEngine.resumeAll()
  },
  playBGM: function (e) {
    const b = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]
    if ((this.bgm != e || !cc.audioEngine.isMusicPlaying()) && (this.bgm = e,
    x.music)) {
      this.stopBGM()
      const _ = this.getAudioClipByName(e)
      cc.audioEngine.playMusic(_, b)
    }
  },
  pauseBGM: function () {
    this.stopBGM()
  },
  resumeBGM: function () {
    this.bgm && this.playBGM(this.bgm)
  },
  stopBGM: function () {
    cc.audioEngine.stopMusic()
  }
}
