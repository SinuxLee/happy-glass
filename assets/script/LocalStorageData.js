module.exports = {
  timer: -1,

  initItem (data) {
    wx.getStorage({
      key: data.str,
      success: (ret) => {
        console.log(ret.data)
        const b = parseInt(ret.data)
        if (b != null && b.length != 0 && !isNaN(b)) return

        wx.setStorage({
          key: data.str,
          data: JSON.stringify(data.number)
        })
      },

      fail: (err) => {
        console.log(err)
        wx.setStorage({
          key: data.str,
          data: JSON.stringify(data.number)
        })
      }
    })
  },

  initData () {
    console.log('初始化用户本地数据')
    this.initItem({
      str: 'level0',
      number: 0
    })

    this.initItem({
      str: 'starSum',
      number: 0
    })

    this.initItem({
      str: 'first',
      number: 0
    })

    this.initItem({
      str: 'gold',
      number: 0
    })

    this.initItem({
      str: 'count',
      number: 0
    })

    this.initItem({
      str: 'checkinDate',
      number: 0
    })

    this.initItem({
      str: 'ADDate',
      number: 0
    })

    this.initItem({
      str: 'water0',
      number: 1
    })

    this.initItem({
      str: 'glass0',
      number: 1
    })

    this.initItem({
      str: 'pen0',
      number: 1
    })

    this.initItem({
      str: 'selectWater',
      number: 0
    })

    this.initItem({
      str: 'selectGlass',
      number: 0
    })

    this.initItem({
      str: 'selectPen',
      number: 0
    })

    this.initItem({
      str: 'finish',
      number: 0
    })

    this.initItem({
      str: 'firstWeek',
      number: 0
    })

    this.initItem({
      str: 'levelNum',
      number: 0
    })

    this.initItem({
      str: 'lastTime',
      number: Date.now()
    })
  },

  get (e) {
    const b = cc.sys.localStorage.getItem(e)
    return parseInt(b)
  },

  set (e, b) {
    cc.sys.localStorage.setItem(e, b)
  },

  updateStars (e) {
    const b = this.get('starSum')
    isNaN(b) && isNaN(e) || (this.set('starSum', e + b), console.log('update starSum'))
  },

  updateGold (e) {
    const b = this.get('gold')
    isNaN(b) || isNaN(e) || (this.set('gold', e + b), console.log('update gold' + e))
  },

  updateCount () {
    const e = this.get('count')
    console.log(e)
    this.set('count', e + 1)
  },

  updateLevelStar (key, val, node) {
    if (cc.sys.localStorage.getItem(key) >= val) {
      node.active = false
      return 0
    }

    if (isNaN(cc.sys.localStorage.getItem(key))) {
      this.updateStars(val)
      node.active = true
      node.children[0].getComponent(cc.Label).string = '+' + 10 * val
      this.updateGold(10 * val)
      cc.sys.localStorage.setItem(key, val)

      return 10 * val
    }

    this.updateStars(val - cc.sys.localStorage.getItem(key))
    node.active = true
    node.children[0].getComponent(cc.Label).string = '+' + 10 * (val - cc.sys.localStorage.getItem(key))
    this.updateGold(10 * (val - cc.sys.localStorage.getItem(key)))
    const x = cc.sys.localStorage.getItem(key)
    cc.sys.localStorage.setItem(key, val)
    return 10 * (val - x)
  }
}
