module.exports = {
  GAMEMODE: cc.Enum({
    CLASSIC: 0,
    PUZZLE: 1
  }),

  bSound: true,
  bMusic: true,

  init () {
    this.nCoins = cc.sys.localStorage.getItem('coins'),
    this.bSound = cc.sys.localStorage.getItem('sound'),
    this.bMusic = cc.sys.localStorage.getItem('music'),
    this.nCoins = this.nCoins || this.nCoins == '0' ? this.nCoins : 10,
    this.bSound = this.bSound != '0' ? '1' : '0',
    this.bMusic = this.bMusic ? this.bMusic : 'true'
  },

  set sound (e) {
    this.bSound = e ? 1 : 0
    cc.sys.localStorage.setItem('sound', this.bSound)
  },

  get sound () {
    return this.bSound == 1
  },

  set music (e) {
    this.bMusic = e + ''
    cc.sys.localStorage.setItem('music', this.bMusic)
  },

  get music () {
    return this.bMusic == 'true'
  },

  set coins (e) {
    this.nCoins = e
    cc.sys.localStorage.setItem('coins', this.nCoins)
  },

  get coins () {
    return this.nCoins
  },

  updateInviteData (e) {
    cc.sys.localStorage.setItem('invitedata', e)
  },

  getInviteData () {
    return cc.sys.localStorage.getItem('invitedata')
  },

  setRewardInvited (e) {
    const b = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1]
    cc.sys.localStorage.setItem('invited' + e, b)
  },

  isRewardInvited (e) {
    return cc.sys.localStorage.getItem('invited' + e) == 1
  },

  onRewardAdClose () {
    this.CClass()
  },

  onRewardAdStop () {
    this.CStopClass()
  },

  setRewardCloseClass (e) {
    this.CClass = e
  },

  setRewardStopClass (e) {
    this.CStopClass = e
  }
}
