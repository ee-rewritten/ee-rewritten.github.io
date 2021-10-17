class Minimap {
  mapCtx;
  mapData; mapSprite;
  trailCtx;
  playerTrails;
  clearedTrails = false;
  activePlayerTrails = [];
  world;
  popupCtx;

  constructor() {
    this.world = Global.base.state.world;

    let canvas = document.createElement('canvas');
    canvas.width = this.world.width; canvas.height = this.world.height;
    this.mapCtx = canvas.getContext('2d');
    this.mapData = this.mapCtx.createImageData(this.world.width, this.world.height);

    let trailCanvas = document.createElement('canvas');
    trailCanvas.width = this.world.width; trailCanvas.height = this.world.height;
    this.trailCtx = trailCanvas.getContext('2d');
    this.playerTrails = this.trailCtx.createImageData(this.world.width, this.world.height);

    let popupcanvas = document.createElement('canvas');
    popupcanvas.width = this.world.width; popupcanvas.height = this.world.height;
    this.popupCtx = popupcanvas.getContext('2d');

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
    for(const i in this.activePlayerTrails) {
      let index = this.activePlayerTrails[i] + 3;
      this.playerTrails.data[index] -= 3;
      if(this.playerTrails.data[index] == undefined || this.playerTrails.data[index] <= 0)
        delete this.activePlayerTrails[i];
    }

    Global.base.state.players.forEach(p => {
      let coords = bresenhamsLine(
        Math.round(p.lastFrameX/Config.blockSize), Math.round(p.lastFrameY/Config.blockSize),
        Math.round(p.thisFrameX/Config.blockSize), Math.round(p.thisFrameY/Config.blockSize));

      coords.forEach(coord => {
        let index = (coord[0] + coord[1] * this.world.width) * 4;
        this.setColour(this.playerTrails, index, p.isme ? 0x00FF00 : 0xFFFFFF);
        if(this.activePlayerTrails.indexOf(index) == -1) this.activePlayerTrails.push(index);
      });
    });

    this.trailCtx.putImageData(this.playerTrails, 0, 0);
    this.redraw();

    this.clearedTrails = false;
  }
  clearPlayerTrails() {
    if(this.clearedTrails) return;

    for(let index in this.activePlayerTrails)
      this.playerTrails.data[this.activePlayerTrails[index] + 3] = 0;
    this.activePlayerTrails = [];

    this.trailCtx.putImageData(this.playerTrails, 0, 0);

    this.redraw();

    this.clearedTrails = true;
  }

  redraw() {
    this.mapCtx.putImageData(this.mapData, 0, 0);
    this.mapCtx.drawImage(this.trailCtx.canvas, 0, 0);
    this.mapSprite.texture.baseTexture.update();

    this.popupCtx.putImageData(this.mapData, 0, 0);
  }

  setColour(data, index, colour, alpha = 255) {
    data.data[index]   = (colour & 0xFF0000) >> 16; // red
    data.data[index+1] = (colour & 0x00FF00) >> 8; // green
    data.data[index+2] = (colour & 0x0000FF); // blue
    data.data[index+3] = alpha;
  }

  openPopupMap() {
    window.open('./minimap.html', 'minimap', 'width=500,height=300');
  }
}
