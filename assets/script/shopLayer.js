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
    for (let idx = 0; idx < this.waterLayer.children[0].children.length; idx++) {
      this.waterLayer.children[0].children[idx].addComponent('shopItem').init(idx, 1, this.usingSprite, this.havedSprite)
    }

    for (let idx = 0; idx < this.glassLayer.children[0].children.length; idx++) {
      this.glassLayer.children[0].children[idx].addComponent('shopItem').init(idx, 2, this.usingSprite, this.havedSprite)
    }

    for (let idx = 0; idx < this.penLayer.children[0].children.length; idx++) {
      this.penLayer.children[0].children[idx].addComponent('shopItem').init(idx, 3, this.usingSprite, this.havedSprite)
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
