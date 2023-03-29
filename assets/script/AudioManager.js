const GameDataManager = require('GameDataManager')

class AudioManager {
  bgm = null
  audioResArray = []

  preloadAudio (path) {
    cc.loader.loadResDir(path, cc.AudioClip, (err, res) => {
      if (err) return cc.error(err.message || err)
      this.audioResArray = res
    })

    cc.audioEngine.setMusicVolume(0.3)
  }

  getAudioClipByName (name) {
    for (let i = 0; i < this.audioResArray.length; i++) {
      if (this.audioResArray[i].name === name) return this.audioResArray[i]
    }
    return null
  }

  playEffect (name, isLoop = false) {
    if (!GameDataManager.sound) return

    const audioClip = this.getAudioClipByName(name)
    cc.audioEngine.playEffect(audioClip, isLoop)
  }

  stopAllEffect () {
    cc.audioEngine.stopAllEffects()
  }

  playButtonClickEffect () {
    this.playEffect('click')
  }

  stopAllAudios () {
    cc.audioEngine.stopAll()
  }

  pauseAllAudios () {
    cc.audioEngine.pauseAll()
  }

  resumeAllAudio () {
    cc.audioEngine.resumeAll()
  }

  playBGM (name, isLoop = true) {
    if (this.bgm === name && cc.audioEngine.isMusicPlaying()) return
    this.bgm = name
    if (!GameDataManager.music) return

    this.stopBGM()
    const audioClip = this.getAudioClipByName(name)
    cc.audioEngine.playMusic(audioClip, isLoop)
  }

  pauseBGM () {
    this.stopBGM()
  }

  resumeBGM () {
    this.bgm && this.playBGM(this.bgm)
  }

  stopBGM () {
    cc.audioEngine.stopMusic()
  }
}

module.exports = new AudioManager()
