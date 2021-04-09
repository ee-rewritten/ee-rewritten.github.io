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
        const texture = new Texture(ItemManager.blocksBMD, ItemManager.greyBasicRect);

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
        if(x == 0 || y == 0 || x == width-1 || y == height-1) map[0][x][y] = 2;
        else map[0][x][y] = 1;
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
    ) return 0;
    return this.realmap[layer][x][y]
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

      if(offscreen || force) {
        if(offscreen) {
          if(pos.x <= -Config.blockSize) block.x += Config.gameWidthCeil + Config.blockSize;
          if(pos.x > Config.gameWidthCeil) block.x -= Config.gameWidthCeil + Config.blockSize;
          if(pos.y <= -Config.blockSize) block.y += Config.gameHeightCeil + Config.blockSize;
          if(pos.y > Config.gameHeightCeil) block.y -= Config.gameHeightCeil + Config.blockSize;
        }
        let id = this.getTile(0, block.x/Config.blockSize, block.y/Config.blockSize);
        // block.texture.frame = ItemManager.blackBasicRect;
        if(id == 0) block.texture.frame = ItemManager.blackRect;
        if(id == 1) block.texture.frame = ItemManager.blackBasicRect;
        if(id == 2) block.texture.frame = ItemManager.greyBasicRect;
      }
    }
  }
}
