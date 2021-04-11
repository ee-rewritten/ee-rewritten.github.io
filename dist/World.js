class World {
  gameContainer;

  depth;
  width;
  height;

  //full map array
  realmap;
  //array of render maps
  rendermaps;
  //and the array of containers to display them
  rendermapContainers;

  constructor(playstate, width, height, depth) {
    this.width = width;
    this.height = height;
    this.depth = depth;

    this.gameContainer = new Container();
    this.gameContainer.sortableChildren = true;

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
      this.gameContainer.addChild(blockContainer);
    }
    playstate.players.zIndex = ItemLayer.PLAYER_LAYER;
    this.gameContainer.addChild(playstate.players);

    this.gameContainer.sortChildren();

    //init realmap
    let map = new Array(depth);
    for(let layer = 0; layer < depth; layer++) {
      map[layer] = new Array(width);
      for (let x = 0; x < width; x++) {
        map[layer][x] = new Array(height);
        for (let y = 0; y < height; y++) {
          map[layer][x][y] = ItemManager.blockEmpty[1].id;
          if(layer == 0 && (x == 0 || y == 0 || x == width-1 || y == height-1))
            map[layer][x][y] = ItemManager.packs['basic'].blocks[1].id;
        }
      }
    }
    map[1][20][16] = 5;
    this.setMapArray(map);

    Global.stage.addChild(this.gameContainer);
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
    ) return ItemManager.blockVoid.id;
    return this.realmap[layer][x][y];
  }
  getRenderTile(renderLayer, x, y) {
    if(
      renderLayer < 0 || renderLayer >= ItemLayer.LAYERS ||
      x < 0 || x >= this.width ||
      y < 0 || y >= this.height
    ) return ItemManager.blockVoid.id;
    return this.rendermaps[renderLayer][x][y];
  }


  setTile(id, layer, x, y) {
    if(!this.realmap[layer] || !this.realmap[layer][x]) return;
    this.realmap[layer][x][y] = id;
    this.sortIntoRenderLayer(layer, x, y, id);
    this.redraw(true);
  }

  sortIntoRenderLayer(layer, x, y, id) {
    let blockRenderLayer = ItemManager.blocks[id].layer;
    ItemLayer.BLAYER_TO_RLAYER[layer].forEach(renderLayer => {
      if(id == ItemManager.blockEmpty[1].id) id = ItemManager.blockEmpty[layer].id;
      this.rendermaps[renderLayer][x][y] =
        //if this is the correct render layer, set the ID at this pos to the block ID
        blockRenderLayer == renderLayer ? id :
        //otherwise, reset to the empty block for that layer
        ItemManager.blockEmpty[layer].id;
    });
  }

  redraw(force) {
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

        if(offscreen || force || ItemManager.blocks[id] && ItemManager.blocks[id].isAnimated) {
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
            block.texture.frame = ItemManager.blockError.frame;
            return;
          }

          if(blockData.isAnimated) {
            block.texture.frame = blockData.animationFrame(this.offset, block.x/Config.blockSize, block.y/Config.blockSize);
          }
          else
            block.texture.frame = blockData.frame;
        }
      }
    }
  }

  offset = 0;
  tick() {
    this.offset += 0.3;
  }
}
