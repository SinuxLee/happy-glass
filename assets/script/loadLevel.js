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

  getLevelData (e, t) {
    WorldController.levelData[e].forEach((e) => {
      if (e.name && e.name != 'drawline') {
        const n = t.getPrefab(e.name)
        const i = cc.instantiate(t.prefabAtlas[n])
        i.x = e.x
        i.y = e.y
        i.parent = t.itemNode
        e.name != 'out' && e.name != 'outTop' && e.name != 'outRight' || i.setSiblingIndex(0)
      }
    })
  },

  getPrefab (e) {
    for (let t = 0; t < this.prefabAtlas.length; t++) {
      if (this.prefabAtlas[t].name == e) return t
    }
  }
})
