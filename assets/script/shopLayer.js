cc.Class({
  extends: cc.Component,
  properties: {
    waterLayer: cc.Node,
    glassLayer: cc.Node,
    penLayer: cc.Node,
    waterBtn: cc.Node,
    glassBtn: cc.Node,
    penBtn: cc.Node,
    waterSelect: cc.SpriteFrame,
    waterNo: cc.SpriteFrame,
    glassSelect: cc.SpriteFrame,
    glassNo: cc.SpriteFrame,
    penSelect: cc.SpriteFrame,
    penNo: cc.SpriteFrame,
    usingSprite: cc.SpriteFrame,
    havedSprite: cc.SpriteFrame
  },

  onLoad () {
    for (let e = 0; e < this.waterLayer.children[0].children.length; e++) {
      this.waterLayer.children[0].children[e].addComponent('shopItem').init(e, 1, this.usingSprite, this.havedSprite)
    }

    for (let t = 0; t < this.glassLayer.children[0].children.length; t++) {
      this.glassLayer.children[0].children[t].addComponent('shopItem').init(t, 2, this.usingSprite, this.havedSprite)
    }

    for (let n = 0; n < this.penLayer.children[0].children.length; n++) {
      this.penLayer.children[0].children[n].addComponent('shopItem').init(n, 3, this.usingSprite, this.havedSprite)
    }
  },

  waterBtnEvent () {
    this.waterLayer.active = true
    this.glassLayer.active = false
    this.penLayer.active = false
    this.waterBtn.getComponent(cc.Sprite).spriteFrame = this.waterSelect
    this.glassBtn.getComponent(cc.Sprite).spriteFrame = this.glassNo
    this.penBtn.getComponent(cc.Sprite).spriteFrame = this.penNo
  },

  glassBtnEvent () {
    this.waterLayer.active = false
    this.glassLayer.active = true
    this.penLayer.active = false
    this.waterBtn.getComponent(cc.Sprite).spriteFrame = this.waterNo
    this.glassBtn.getComponent(cc.Sprite).spriteFrame = this.glassSelect
    this.penBtn.getComponent(cc.Sprite).spriteFrame = this.penNo
  },

  penBtnEvent () {
    this.waterLayer.active = false
    this.glassLayer.active = false
    this.penLayer.active = true
    this.waterBtn.getComponent(cc.Sprite).spriteFrame = this.waterNo
    this.glassBtn.getComponent(cc.Sprite).spriteFrame = this.glassNo
    this.penBtn.getComponent(cc.Sprite).spriteFrame = this.penSelect
  }
})
