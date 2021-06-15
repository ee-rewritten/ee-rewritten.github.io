class World extends Container {
  depth;
  width;
  height;

  placeQueue = {};

  //full map array
  realmap;
  //array of render maps
  rendermaps;
  //and the array of containers to display them
  rendermapContainers;

  constructor(playstate, width, height, depth) {
    super();
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.sortableChildren = true;

    //init render containers
    const maxBlocks = (Math.ceil(Global.gameWidth/16) + 1) * (Math.ceil(Global.gameHeight/16) + 1);
    this.rendermapContainers = new Array(ItemLayer.NUM_LAYERS);

    for (let i = 0; i < ItemLayer.NUM_LAYERS; i++) {
      let blockContainer = new ParticleContainer(maxBlocks, {uvs:true});
      this.rendermapContainers[i] = blockContainer;

      for (let x = 0; x < Config.gameWidth+Config.blockSize; x+=Config.blockSize) {
        for (let y = 0; y < Config.gameHeight+Config.blockSize; y+=Config.blockSize) {
          const texture = new Texture(ItemManager.blocksBMD);

          let block = new Sprite(texture);
          block.position.set(x, y);

          blockContainer.addChild(block);
        }
      }
      blockContainer.zIndex = i;
      this.addChild(blockContainer);
    }
    for (let i = 0; i < playstate.playerContainers.length; i++) {
      this.addChild(playstate.playerContainers[i]);
      this.addChild(playstate.nameContainers[i]);
      playstate.playerContainers[i].zIndex = ItemLayer.PLAYER_LAYERS[i];
      playstate.nameContainers[i].zIndex = ItemLayer.NAME_LAYERS[i];
    }

    //init realmap
    let map = new Array(depth);
    for(let layer = 0; layer < depth; layer++) {
      map[layer] = new Array(width);
      for (let x = 0; x < width; x++) {
        map[layer][x] = new Array(height);
        for (let y = 0; y < height; y++) {
          map[layer][x][y] = ItemManager.blockEmpty[0].id;
          if(layer == 0 && (x == 0 || y == 0 || x == width-1 || y == height-1))
            map[layer][x][y] = ItemManager.packs[0]['basic'].blocks[1].id;
        }
      }
    }
    this.setMapArray(map);

    playstate.addChild(this);
  }

  setMapArray(map) {
    let depth = map.length;
    let width = map[0].length;
    let height = map[0][0].length;
    this.depth = depth;
    this.width = width;
    this.height = height;

    //resets and initialises empty rendermaps
    this.rendermaps = new Array(ItemLayer.NUM_LAYERS);
    for (let itemlayer = 0; itemlayer < ItemLayer.NUM_LAYERS; itemlayer++) {
      this.rendermaps[itemlayer] = new Array(width);
      for(let x = 0; x < width; x++) {
        this.rendermaps[itemlayer][x] = new Array(height);
      }
    }

    //resets the realmap, fills it with given data, sorts data into rendermaps
    this.realmap = new Array(depth);
    for(let layer = 0; layer < depth; layer++) {
      this.realmap[layer] = new Array(width);
      for(let x = 0; x < width; x++) {
        this.realmap[layer][x] = new Array(height);
        for(let y = 0; y < height; y++) {
          let id = map[layer][x][y];
          id = ItemManager.blocks[id] ? id : ItemManager.blockError[layer].id
          this.realmap[layer][x][y] = id;
          this.sortIntoRenderLayer(layer, x, y, id);
        }
      }
    }
    this.redraw(true);
  }

  getTile(layer, x, y) {
    if(
      layer < 0 || layer >= this.depth ||
      x < 0 || x >= this.width ||
      y < 0 || y >= this.height
    ) return ItemManager.blockVoid[ItemLayer.BELOW].id;
    return this.realmap[layer][x][y];
  }
  getRenderTile(renderLayer, x, y) {
    if(
      renderLayer < 0 || renderLayer >= ItemLayer.LAYERS ||
      x < 0 || x >= this.width ||
      y < 0 || y >= this.height
    ) return ItemManager.blockVoid[renderLayer].id;
    return this.rendermaps[renderLayer][x][y];
  }

  setTile(id, x, y) {
    if(!ItemManager.blocks[id]) {
      let errLayer = ItemManager.getTabFromId(id) == ItemTab.BACKGROUND ? 1 : 0;
      id = ItemManager.blockError[errLayer].id;
    }
    let layer = ItemLayer.RLAYER_TO_BLAYER[ItemManager.blocks[id].layer];
    if(!this.realmap[layer] || !this.realmap[layer][x]) return;

    if(this.realmap[layer][x][y] == id) return;

    let wasOverlapping = this.overlaps(Global.base.state.player);
    let oldId = this.realmap[layer][x][y];
    this.realmap[layer][x][y] = id;
    if(!wasOverlapping && this.overlaps(Global.base.state.player)) {
      this.realmap[layer][x][y] = oldId;
      this.placeQueue[`${x},${y}`] = (() => this.setTile(id, x, y));
      return true;
    }
    if(layer == 0) delete this.placeQueue[`${x},${y}`];

    this.sortIntoRenderLayer(layer, x, y, id);
    this.redraw(true, x, y);

    Global.base.UI.minimap.update(x, y);
  }

  sortIntoRenderLayer(layer, x, y, id) {
    let blockRenderLayer = ItemManager.blocks[id].layer;
    ItemLayer.BLAYER_TO_RLAYER[layer].forEach(renderLayer => {
      if(id == ItemManager.blockEmpty[0].id) id = ItemManager.blockEmpty[layer].id;
      this.rendermaps[renderLayer][x][y] =
        //if this is the correct render layer, set the ID at this pos to the block ID
        blockRenderLayer == renderLayer ? id :
        //otherwise, reset to the empty block for that layer
        ItemManager.blockEmpty[layer].id;
    });
  }

  redraw(force, x = null, y = null) {
    for (let renderLayer = 0; renderLayer < this.rendermapContainers.length; renderLayer++) {
      let blockContainer = this.rendermapContainers[renderLayer];

      for (let i = 0; i < blockContainer.children.length; i++) {
        let block = blockContainer.children[i];
        let pos = block.getGlobalPosition();

        let offscreen = pos.x <= -Config.blockSize || pos.x > Config.gameWidthCeil
                     || pos.y <= -Config.blockSize || pos.y > Config.gameHeightCeil;

        let id;
        if(!offscreen) {
          id = this.getRenderTile(renderLayer, block.x/Config.blockSize, block.y/Config.blockSize);
        }

        if(offscreen || force && (x == null && y == null || x == block.x/Config.blockSize && y == block.y/Config.blockSize)
          || ItemManager.blocks[id] && ItemManager.blocks[id].requiresUpdate(block, this)) {
          if(offscreen) {
            if(pos.x <= -Config.blockSize) block.x += Config.gameWidthCeil + Config.blockSize;
            if(pos.x > Config.gameWidthCeil) block.x -= Config.gameWidthCeil + Config.blockSize;
            if(pos.y <= -Config.blockSize) block.y += Config.gameHeightCeil + Config.blockSize;
            if(pos.y > Config.gameHeightCeil) block.y -= Config.gameHeightCeil + Config.blockSize;
          }

          if(offscreen && !id && id !== 0) {
            id = this.getRenderTile(renderLayer, block.x/Config.blockSize, block.y/Config.blockSize);
          }

          let blockData = ItemManager.blocks[id];
          if(!blockData) {
            block.texture.frame = ItemManager.blockError[0].frame;
            continue;
          }

          blockData.draw(block, this);
        }
      }
    }
  }

  // only checks collisions in foreground (0) layer
  overlaps(player) {
    if(player.x < 0 || player.y < 0 ||
      player.x > (this.width-1) * Config.blockSize || player.y > (this.height-1) * Config.blockSize) return true;


    //top left of player, in block coords
    let startX = Math.floor(player.x/Config.blockSize);
    let startY = Math.floor(player.y/Config.blockSize);
    //bottom right of player, in block coords
    let endX = player.x/Config.blockSize + 1;
    let endY = player.y/Config.blockSize + 1;

    for(let blockX = startX; blockX < endX; blockX++) {
      for(let blockY = startY; blockY < endY; blockY++) {
        let id = this.getTile(0, blockX, blockY);

        if(player.isInGodMode && id != ItemManager.blockVoid[ItemLayer.BELOW].id) continue;
        if(id == 0) continue;
        // if(!this.intersects(player.x*Config.blockSize, player.y*Config.blockSize, blockX, blockY)) continue;

        return true;
      }
    }
    return false;
  }
  intersects(x1, y1, x2, y2) {
    return (x1 > x2 + Config.blockSize
         || x2 > x1 + Config.blockSize
         || y1 > y2 + Config.blockSize
         || y2 > y1 + Config.blockSize);
  }

  offset = 0;
  tick() {
    this.offset += 0.3;

    let coords = Object.keys(this.placeQueue);
    while(coords.length) {
      let coord = coords.shift();
      if(!this.placeQueue[coord]())
        delete this.placeQueue[coord];
    }
  }
}
