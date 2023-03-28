const a = require('LocalStorageData')
const o = require('shopItemData')
cc.Class({
  extends: cc.Component,
  properties: {},
  init: function (e, t, n, c) {
    let i
    t == 1 && ((i = a.get('water' + e)) == 0 ? (this.node.children[0].getComponent(cc.Sprite).spriteFrame = c, this.node.children[1].active = !1, this.node.children[2].active = !1) : i == 1 ? (this.node.children[0].getComponent(cc.Sprite).spriteFrame = n, this.node.children[1].active = !0, this.node.children[2].active = !1) : (this.node.children[0].active = !1, this.node.children[1].active = !1, this.node.children[2].active = !0, this.node.children[2].children[0].getComponent(cc.Label).string = o.waterGold[e])), t == 2 && ((i = a.get('glass' + e)) == 0 ? (this.node.children[0].getComponent(cc.Sprite).spriteFrame = c, this.node.children[3].active = !1, this.node.children[1].active = !1) : i == 1 ? (this.node.children[0].getComponent(cc.Sprite).spriteFrame = n, this.node.children[3].active = !0, this.node.children[1].active = !1) : (this.node.children[0].active = !1, this.node.children[3].active = !1, this.node.children[1].active = !0, e == 8 || e == 9 || e == 10 || e == 11 || (this.node.children[1].children[0].getComponent(cc.Label).string = o.glassGold[e]))), t == 3 && ((i = a.get('pen' + e)) == 0 ? (this.node.children[0].getComponent(cc.Sprite).spriteFrame = c, this.node.children[1].active = !1, this.node.children[2].active = !1) : i == 1 ? (this.node.children[0].getComponent(cc.Sprite).spriteFrame = n, this.node.children[1].active = !0, this.node.children[2].active = !1) : (this.node.children[0].active = !1, this.node.children[1].active = !1, this.node.children[2].active = !0, this.node.children[2].children[0].getComponent(cc.Label).string = o.penGold[e])), this.node.on(cc.Node.EventType.TOUCH_END, function () {
      let i
      if (t == 1) {
        if ((i = a.get('water' + e)) == 0) {
          a.set('water' + e, 1)
          var s = a.get('selectWater')
          a.set('water' + s, 0), a.set('selectWater', e), this.children[1].active = !0, this.children[0].getComponent(cc.Sprite).spriteFrame = n, this.parent.children[s].children[1].active = !1, this.parent.children[s].children[0].getComponent(cc.Sprite).spriteFrame = c
        } else {
          i == 1 || (a.get('gold') >= o.waterGold[e]
            ? (console.log('购买'), a.updateGold(-o.waterGold[e]), cc.find('Canvas').getComponent('Game').updateShopGold(), a.set('water' + e, 0), this.children[0].active = !0, this.children[0].getComponent(cc.Sprite).spriteFrame = c, this.children[2].active = !1)
            : (console.log('金币不足'), wx.showToast && wx.showToast({
                title: '金币不足',
                icon: 'none',
                duration: 2e3
              })))
        }
      }
      t == 2 && ((i = a.get('glass' + e)) == 0
        ? (a.set('glass' + e, 1), s = a.get('selectGlass'), a.set('glass' + s, 0), a.set('selectGlass', e), this.children[3].active = !0, this.children[0].getComponent(cc.Sprite).spriteFrame = n, this.parent.children[s].children[3].active = !1, this.parent.children[s].children[0].getComponent(cc.Sprite).spriteFrame = c)
        : i == 1 || (e == 8 || e == 9 || e == 10 || e == 11
          ? wx.showToast && wx.showToast({
            title: '奖励专属皮肤，不可购买',
            icon: 'none',
            duration: 2e3
          })
          : a.get('gold') >= o.glassGold[e]
            ? (console.log('购买'), a.updateGold(-o.glassGold[e]), cc.find('Canvas').getComponent('Game').updateShopGold(), a.set('glass' + e, 0), this.children[0].active = !0, this.children[0].getComponent(cc.Sprite).spriteFrame = c, this.children[1].active = !1)
            : (console.log('金币不足'), wx.showToast && wx.showToast({
                title: '金币不足',
                icon: 'none',
                duration: 2e3
              })))), t == 3 && ((i = a.get('pen' + e)) == 0
        ? (a.set('pen' + e, 1), s = a.get('selectPen'), a.set('pen' + s, 0), a.set('selectPen', e), this.children[1].active = !0, this.children[0].getComponent(cc.Sprite).spriteFrame = n, this.parent.children[s].children[1].active = !1, this.parent.children[s].children[0].getComponent(cc.Sprite).spriteFrame = c)
        : i == 1 || (a.get('gold') >= o.penGold[e]
          ? (console.log('购买'), a.updateGold(-o.penGold[e]), cc.find('Canvas').getComponent('Game').updateShopGold(), a.set('pen' + e, 0), this.children[0].active = !0, this.children[0].getComponent(cc.Sprite).spriteFrame = c, this.children[2].active = !1)
          : (console.log('金币不足'), wx.showToast && wx.showToast({
              title: '金币不足',
              icon: 'none',
              duration: 2e3
            }))))
    }, this.node)
  }
})
