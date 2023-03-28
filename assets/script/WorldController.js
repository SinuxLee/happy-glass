const LocalStorageData = require('LocalStorageData')

module.exports = {
  totalLength: 1500,
  waterIsSpawn: false,
  share: false,
  winWaterNum: 24,
  win: false,
  levelNum: 0,
  levelData: [],
  changeLevel: false,
  currentLevel: 0,
  begin: false,
  frames: 0,
  repeat: false,
  tryItem: false,
  playNum: 0,
  tryNum: 0,
  tryWater: false,
  tryWaterNum: 0,
  completeCount: 0,
  shareError: ['分享失败，请分享到不同群！', '分享失败，请换个群分享试试！', '分享失败，请不要分享到同一个群！'],

  setLevelData (data) {
    this.levelData = data
    this.levelNum = data.length
  },

  getLevelData (callback, b) {
    callback(this.currentLevel, b)
  },

  getcurrentLevel () {
    if (isNaN(LocalStorageData.get('levelNum')) || void 0 === LocalStorageData.get('levelNum')) {
      LocalStorageData.set('levelNum', 0)
      this.currentLevel = 0
    } else {
      this.currentLevel = LocalStorageData.get('levelNum')
    }
  }
}
