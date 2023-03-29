const LocalStorageData = require('LocalStorageData')
const shopItemData = require('shopItemData')

cc.Class({
  extends: cc.Component,

  init (idx, type, n, c) {
    let i
    if (type == 1) {
      i = LocalStorageData.get('water' + idx)
      if (i == 0) {
        this.node.children[0].getComponent(cc.Sprite).spriteFrame = c
        this.node.children[1].active = false
        this.node.children[2].active = false
      } else if (i == 1) {
        this.node.children[0].getComponent(cc.Sprite).spriteFrame = n
        this.node.children[1].active = true
        this.node.children[2].active = false
      } else {
        this.node.children[0].active = false
        this.node.children[1].active = false
        this.node.children[2].active = true
        this.node.children[2].children[0].getComponent(cc.Label).string = shopItemData.waterGold[idx]
      }
    } else if (type == 2) {
      i = LocalStorageData.get('glass' + idx)
      if (i == 0) {
        this.node.children[0].getComponent(cc.Sprite).spriteFrame = c
        this.node.children[3].active = false
        this.node.children[1].active = false
      } else if (i == 1) {
        this.node.children[0].getComponent(cc.Sprite).spriteFrame = n
        this.node.children[3].active = true
        this.node.children[1].active = false
      } else {
        this.node.children[0].active = false
        this.node.children[3].active = false
        this.node.children[1].active = true
        idx == 8 || idx == 9 || idx == 10 || idx == 11 || (this.node.children[1].children[0].getComponent(cc.Label).string = shopItemData.glassGold[idx])
      }
    } else if (type == 3) {
      i = LocalStorageData.get('pen' + idx)
      if (i == 0) {
        this.node.children[0].getComponent(cc.Sprite).spriteFrame = c
        this.node.children[1].active = false
        this.node.children[2].active = false
      } else if (i == 1) {
        this.node.children[0].getComponent(cc.Sprite).spriteFrame = n
        this.node.children[1].active = true
        this.node.children[2].active = false
      } else {
        this.node.children[0].active = false
        this.node.children[1].active = false
        this.node.children[2].active = true
        this.node.children[2].children[0].getComponent(cc.Label).string = shopItemData.penGold[idx]
      }
    }

    this.node.on(cc.Node.EventType.TOUCH_END, this.clickItem.bind(this.node, idx, type), this.node)
  },

  clickItem (idx, type) {
    let i
    if (type == 1) {
      i = LocalStorageData.get('water' + idx)
      if (i == 0) {
        LocalStorageData.set('water' + idx, 1)
        var s = LocalStorageData.get('selectWater')
        LocalStorageData.set('water' + s, 0)
        LocalStorageData.set('selectWater', idx)
        this.children[1].active = true
        this.children[0].getComponent(cc.Sprite).spriteFrame = n
        this.parent.children[s].children[1].active = false
        this.parent.children[s].children[0].getComponent(cc.Sprite).spriteFrame = c
      } else if (i == 1 || (LocalStorageData.get('gold') >= shopItemData.waterGold[idx])) {
        console.log('购买')
        LocalStorageData.updateGold(-shopItemData.waterGold[idx])
        cc.find('Canvas').getComponent('Game').updateShopGold()
        LocalStorageData.set('water' + idx, 0)
        this.children[0].active = true
        this.children[0].getComponent(cc.Sprite).spriteFrame = c
        this.children[2].active = false
      } else {
        console.log('金币不足')
        wx.showToast && wx.showToast({
          title: '金币不足',
          icon: 'none',
          duration: 2e3
        })
      }
    } else if (type == 2) {
      i = LocalStorageData.get('glass' + idx)
      if (i == 0) {
        LocalStorageData.set('glass' + idx, 1)
        s = LocalStorageData.get('selectGlass')
        LocalStorageData.set('glass' + s, 0)
        LocalStorageData.set('selectGlass', idx)
        this.children[3].active = true
        this.children[0].getComponent(cc.Sprite).spriteFrame = n
        this.parent.children[s].children[3].active = false
        this.parent.children[s].children[0].getComponent(cc.Sprite).spriteFrame = c
      } else if (i == 1 || (idx == 8 || idx == 9 || idx == 10 || idx == 11)) {
        wx.showToast && wx.showToast({
          title: '奖励专属皮肤，不可购买',
          icon: 'none',
          duration: 2e3
        })
      } else if (LocalStorageData.get('gold') >= shopItemData.glassGold[idx]) {
        console.log('购买')
        LocalStorageData.updateGold(-shopItemData.glassGold[idx])
        cc.find('Canvas').getComponent('Game').updateShopGold()
        LocalStorageData.set('glass' + idx, 0)
        this.children[0].active = true
        this.children[0].getComponent(cc.Sprite).spriteFrame = c
        this.children[1].active = false
      } else {
        console.log('金币不足')
        wx.showToast && wx.showToast({
          title: '金币不足',
          icon: 'none',
          duration: 2e3
        })
      }
    } else if (type == 3) {
      i = LocalStorageData.get('pen' + idx)
      if (i == 0) {
        LocalStorageData.set('pen' + idx, 1)
        s = LocalStorageData.get('selectPen')
        LocalStorageData.set('pen' + s, 0)
        LocalStorageData.set('selectPen', idx)
        this.children[1].active = true
        this.children[0].getComponent(cc.Sprite).spriteFrame = n
        this.parent.children[s].children[1].active = false
        this.parent.children[s].children[0].getComponent(cc.Sprite).spriteFrame = c
      } else if (i == 1 || (LocalStorageData.get('gold') >= shopItemData.penGold[idx])) {
        console.log('购买')
        LocalStorageData.updateGold(-shopItemData.penGold[idx])
        cc.find('Canvas').getComponent('Game').updateShopGold()
        LocalStorageData.set('pen' + idx, 0)
        this.children[0].active = true
        this.children[0].getComponent(cc.Sprite).spriteFrame = c
        this.children[2].active = false
      } else {
        console.log('金币不足')
        wx.showToast && wx.showToast({
          title: '金币不足',
          icon: 'none',
          duration: 2e3
        })
      }
    }
  }
})
