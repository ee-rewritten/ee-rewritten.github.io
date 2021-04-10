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

  //temp
  blockContainer;

  constructor(playstate, width, height) {
    this.width = width;
    this.height = height;

    this.gameContainer = new Container();



    //init render container/s
    const maxBlocks = (Math.ceil(Global.gameWidth/16) + 1) * (Math.ceil(Global.gameHeight/16) + 1)
    this.blockContainer = new ParticleContainer(maxBlocks, {uvs:true});

    for (let x = 0; x < Config.gameWidth+Config.blockSize; x+=Config.blockSize) {
      //temp
      debug[x/Config.blockSize] = [];
      for (let y = 0; y < Config.gameHeight+Config.blockSize; y+=Config.blockSize) {
        // const frame = new Rectangle(
        //   Global.randomInt(0,9)*Config.blockSize,
        //   Global.randomInt(0,9)*Config.blockSize,
        //   Config.blockSize, Config.blockSize);
        const texture = new Texture(ItemManager.blocksBMD);

        let block = new Sprite(texture);
        block.position.set(x, y);
        // temp
        debug[x/Config.blockSize][y/Config.blockSize] = texture;
        this.blockContainer.addChild(block);
      }
    }
    this.gameContainer.addChild(this.blockContainer);

    //init realmap
    let map = new Array(1);
    map[0] = new Array(width);
    for (let x = 0; x < width; x++) {
      map[0][x] = new Array(height);
      for (let y = 0; y < height; y++) {
        if(x == 0 || y == 0 || x == width-1 || y == height-1) map[0][x][y] = ItemManager.packs['basic'].blocks[1].id;
        else map[0][x][y] = ItemManager.blockEmpty.id;
      }
    }
    this.setMapArray(map);


    this.gameContainer.addChild(playstate.players);

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
    this.rendermaps = new Array(ItemLayer.LAYERS);
    this.rendermapContainers = new Array(ItemLayer.LAYERS);
    for (let itemlayer = 0; itemlayer < ItemLayer.LAYERS; itemlayer++) {
      this.rendermaps[itemlayer] = new Array(depth);
      for(let layer = 0; layer < depth; layer++) {
        this.rendermaps[itemlayer][layer] = new Array(width);
        for(let x = 0; x < width; x++) {
          this.rendermaps[itemlayer][layer][x] = new Array(height);
        }
      }
    }

    //resets the realmap, fills it with given data, sorts data into rendermaps
    this.realmap = new Array(depth);
    for(let layer = 0; layer < depth; layer++) {
      this.realmap[layer] = new Array(width);
      for(let x = 0; x < width; x++) {
        this.realmap[layer][x] = new Array(height);
        for(let y = 0; y < width; y++) {
          this.realmap[layer][x][y] = map[layer][x][y];
          this.sortIntoRenderLayer(layer, x, y, map[layer][x][y]);
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

  setTile(id, layer, x, y) {
    if(!this.realmap[layer] || !this.realmap[layer][x]) return;
    this.realmap[layer][x][y] = id;
    this.sortIntoRenderLayer(layer, x, y, id);
    this.redraw(true);
  }

  sortIntoRenderLayer(layer, x, y, id) {
    //temp put everything into one rendermap
    this.rendermaps[ItemLayer.BELOW][layer][x][y] = id;
  }

  redraw(force) {
    for (let i = 0; i < this.blockContainer.children.length; i++) {
      let block = this.blockContainer.children[i];
      let pos = block.getGlobalPosition();

      let offscreen = pos.x <= -Config.blockSize || pos.x > Config.gameWidthCeil
                   || pos.y <= -Config.blockSize || pos.y > Config.gameHeightCeil;

      let id;
      if(!offscreen) id = this.getTile(0, block.x/Config.blockSize, block.y/Config.blockSize);

      if(offscreen || force || ItemManager.blocks[id] && ItemManager.blocks[id].isAnimated) {
        if(offscreen) {
          if(pos.x <= -Config.blockSize) block.x += Config.gameWidthCeil + Config.blockSize;
          if(pos.x > Config.gameWidthCeil) block.x -= Config.gameWidthCeil + Config.blockSize;
          if(pos.y <= -Config.blockSize) block.y += Config.gameHeightCeil + Config.blockSize;
          if(pos.y > Config.gameHeightCeil) block.y -= Config.gameHeightCeil + Config.blockSize;
        }

        if(offscreen && !id && id !== 0) {
          id = this.getTile(0, block.x/Config.blockSize, block.y/Config.blockSize);
        }

        let blockData = ItemManager.blocks[id]
        if(!blockData) return;

        if(blockData.isAnimated) {
          block.texture.frame = blockData.animationFrame(this.offset, block.x/Config.blockSize, block.y/Config.blockSize);
        }
        else
          block.texture.frame = blockData.frame;
      }
    }
  }

  offset = 0;
  tick() {
    this.offset += 0.3;
  }
}
