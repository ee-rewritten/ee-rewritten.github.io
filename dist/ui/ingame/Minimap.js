class Minimap {
  ctx;
  mapData; mapSprite;
  pctx;
  playerTrails;
  world;

  constructor() {
    this.world = Global.base.state.world;

    let canvas = document.createElement('canvas');
    canvas.width = this.world.width;
    canvas.height = this.world.height;

    this.ctx = canvas.getContext('2d');
    this.mapData = this.ctx.createImageData(this.world.width, this.world.height);


    let pcanvas = document.createElement('canvas');
    pcanvas.width = this.world.width;
    pcanvas.height = this.world.height;

    this.pctx = pcanvas.getContext('2d');
    this.playerTrails = this.pctx.createImageData(this.world.width, this.world.height);


    this.mapSprite = Sprite.from(canvas);
    this.mapSprite.x = -2; this.mapSprite.y = -6;
    this.updateAll();
  }

  update(x, y, redraw = true) {
    let pixelindex = (y * this.world.width + x) * 4;
    let id, block;
    for(let i = this.world.realmap.length-1; i >= 0; i--) {
       id = this.world.realmap[i][x][y];
       if(!ItemManager.isBlockEmpty(id)) block = ItemManager.blocks[id];
    }
    this.setColour(this.mapData, pixelindex, block ? block.minimapColour : 0x000000);

    if(redraw) this.redraw();
  }
  updateAll() {
    for(let x = 0; x < this.world.width; x++)
      for(let y = 0; y < this.world.height; y++)
        this.update(x, y, false);

    this.redraw();
  }

  updatePlayerTrails() {
    // fade
    for(let x = 0; x < this.world.width; x++)
      for(let y = 0; y < this.world.height; y++)
        this.playerTrails.data[(x+y*this.world.width)*4 + 3] -= 3;

    Global.base.state.players.forEach(p => {
      let index = (Math.round(p.x/Config.blockSize) + Math.round(p.y/Config.blockSize) * this.world.width) * 4;
      this.setColour(this.playerTrails, index, p.isme ? 0x00FF00 : 0xFFFFFF);
    });

    this.pctx.putImageData(this.playerTrails, 0, 0);
    this.redraw();
  }

  redraw() {
    this.ctx.putImageData(this.mapData, 0, 0);
    this.ctx.drawImage(this.pctx.canvas, 0, 0);
    this.mapSprite.texture.baseTexture.update();
  }

  setColour(data, index, colour, alpha = 255) {
    data.data[index]   = (colour & 0xFF0000) >> 16; // red
    data.data[index+1] = (colour & 0x00FF00) >> 8; // green
    data.data[index+2] = (colour & 0x0000FF); // blue
    data.data[index+3] = alpha;
  }
}
