const WorldController = require('WorldController')
cc.Class({
  extends: cc.Component,
  properties: {
    itemPrefab: cc.Prefab,
    content: cc.Node
  },

  start () {
    WorldController.getLevelData(this.showItem, this)
  },

  showItem (curLV, t) {
    for (let n = 0; n < WorldController.levelNum; n++) {
      const o = cc.instantiate(t.itemPrefab)
      o.getComponent('levelItem').init(n)
      o.parent = t.content
    }
  },

  close () {
    this.node.active = false
  },

  show () {
    this.node.active = true
  }
})
