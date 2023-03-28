const LocalStorageData = require('LocalStorageData')
const shopItemData = require('shopItemData')

cc.Class({
  extends: cc.Component,

  init (e, t, n, c) {
    let i
    t == 1 && ((i = LocalStorageData.get('water' + e)) == 0 ? (this.node.children[0].getComponent(cc.Sprite).spriteFrame = c, this.node.children[1].active = false, this.node.children[2].active = false) : i == 1 ? (this.node.children[0].getComponent(cc.Sprite).spriteFrame = n, this.node.children[1].active = true, this.node.children[2].active = false) : (this.node.children[0].active = false, this.node.children[1].active = false, this.node.children[2].active = true, this.node.children[2].children[0].getComponent(cc.Label).string = shopItemData.waterGold[e])), t == 2 && ((i = LocalStorageData.get('glass' + e)) == 0 ? (this.node.children[0].getComponent(cc.Sprite).spriteFrame = c, this.node.children[3].active = false, this.node.children[1].active = false) : i == 1 ? (this.node.children[0].getComponent(cc.Sprite).spriteFrame = n, this.node.children[3].active = true, this.node.children[1].active = false) : (this.node.children[0].active = false, this.node.children[3].active = false, this.node.children[1].active = true, e == 8 || e == 9 || e == 10 || e == 11 || (this.node.children[1].children[0].getComponent(cc.Label).string = shopItemData.glassGold[e]))), t == 3 && ((i = LocalStorageData.get('pen' + e)) == 0 ? (this.node.children[0].getComponent(cc.Sprite).spriteFrame = c, this.node.children[1].active = false, this.node.children[2].active = false) : i == 1 ? (this.node.children[0].getComponent(cc.Sprite).spriteFrame = n, this.node.children[1].active = true, this.node.children[2].active = false) : (this.node.children[0].active = false, this.node.children[1].active = false, this.node.children[2].active = true, this.node.children[2].children[0].getComponent(cc.Label).string = shopItemData.penGold[e])), this.node.on(cc.Node.EventType.TOUCH_END, function () {
      let i
      if (t == 1) {
        if ((i = LocalStorageData.get('water' + e)) == 0) {
          LocalStorageData.set('water' + e, 1)
          var s = LocalStorageData.get('selectWater')
          LocalStorageData.set('water' + s, 0)
          LocalStorageData.set('selectWater', e)
          this.children[1].active = true
          this.children[0].getComponent(cc.Sprite).spriteFrame = n
          this.parent.children[s].children[1].active = false
          this.parent.children[s].children[0].getComponent(cc.Sprite).spriteFrame = c
        } else {
          i == 1 || (LocalStorageData.get('gold') >= shopItemData.waterGold[e]
            ? (console.log('购买'), LocalStorageData.updateGold(-shopItemData.waterGold[e]), cc.find('Canvas').getComponent('Game').updateShopGold(), LocalStorageData.set('water' + e, 0), this.children[0].active = true, this.children[0].getComponent(cc.Sprite).spriteFrame = c, this.children[2].active = false)
            : (console.log('金币不足'), wx.showToast && wx.showToast({
                title: '金币不足',
                icon: 'none',
                duration: 2e3
              })))
        }
      }
      t == 2 && ((i = LocalStorageData.get('glass' + e)) == 0
        ? (LocalStorageData.set('glass' + e, 1), s = LocalStorageData.get('selectGlass'), LocalStorageData.set('glass' + s, 0), LocalStorageData.set('selectGlass', e), this.children[3].active = true, this.children[0].getComponent(cc.Sprite).spriteFrame = n, this.parent.children[s].children[3].active = false, this.parent.children[s].children[0].getComponent(cc.Sprite).spriteFrame = c)
        : i == 1 || (e == 8 || e == 9 || e == 10 || e == 11
          ? wx.showToast && wx.showToast({
            title: '奖励专属皮肤，不可购买',
            icon: 'none',
            duration: 2e3
          })
          : LocalStorageData.get('gold') >= shopItemData.glassGold[e]
            ? (console.log('购买'), LocalStorageData.updateGold(-shopItemData.glassGold[e]), cc.find('Canvas').getComponent('Game').updateShopGold(), LocalStorageData.set('glass' + e, 0), this.children[0].active = true, this.children[0].getComponent(cc.Sprite).spriteFrame = c, this.children[1].active = false)
            : (console.log('金币不足'), wx.showToast && wx.showToast({
                title: '金币不足',
                icon: 'none',
                duration: 2e3
              })))), t == 3 && ((i = LocalStorageData.get('pen' + e)) == 0
        ? (LocalStorageData.set('pen' + e, 1), s = LocalStorageData.get('selectPen'), LocalStorageData.set('pen' + s, 0), LocalStorageData.set('selectPen', e), this.children[1].active = true, this.children[0].getComponent(cc.Sprite).spriteFrame = n, this.parent.children[s].children[1].active = false, this.parent.children[s].children[0].getComponent(cc.Sprite).spriteFrame = c)
        : i == 1 || (LocalStorageData.get('gold') >= shopItemData.penGold[e]
          ? (console.log('购买'), LocalStorageData.updateGold(-shopItemData.penGold[e]), cc.find('Canvas').getComponent('Game').updateShopGold(), LocalStorageData.set('pen' + e, 0), this.children[0].active = true, this.children[0].getComponent(cc.Sprite).spriteFrame = c, this.children[2].active = false)
          : (console.log('金币不足'), wx.showToast && wx.showToast({
              title: '金币不足',
              icon: 'none',
              duration: 2e3
            }))))
    }, this.node)
  }
})
