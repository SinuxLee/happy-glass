const WorldController = require('WorldController')
cc.Class({
  extends: cc.Component,
  properties: {
    itemNode: cc.Node,
    prefabAtlas: {
      default: [],
      type: cc.Prefab
    }
  },

  onLoad () {
    cc.director.getPhysicsManager().enabled = true
    WorldController.getLevelData(this.getLevelData, this)
  },

  getLevelData (level, t) {
    WorldController.levelData[level].forEach((obj) => {
      if (obj.name && obj.name != 'drawline') {
        const idx = t.getPrefab(obj.name)
        const node = cc.instantiate(t.prefabAtlas[idx])
        node.x = obj.x
        node.y = obj.y
        node.parent = t.itemNode
        if (obj.name != 'out' && obj.name != 'outTop' && obj.name != 'outRight') return

        node.setSiblingIndex(0)
      }
    })
  },

  getPrefab (name) {
    for (let i = 0; i < this.prefabAtlas.length; i++) {
      if (this.prefabAtlas[i].name == name) return i
    }
  }
})
