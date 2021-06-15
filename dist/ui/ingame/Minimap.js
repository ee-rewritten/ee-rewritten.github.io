class Minimap {
  ctx;
  mapData; mapSprite;
  world;

  constructor() {
    let canvas = document.createElement('canvas');
    this.world = Global.base.state.world;
    canvas.width = this.world.width;
    canvas.height = this.world.height;

    this.ctx = canvas.getContext('2d');
    this.mapData = this.ctx.createImageData(this.world.width, this.world.height);

    this.mapSprite = Sprite.from(canvas);
    this.mapSprite.x = -2; this.mapSprite.y = -6;
    this.update();
  }

  update() {
    for(let x = 0; x < this.world.width; x++) {
      for(let y = 0; y < this.world.width; y++) {
        let pixelindex = (y * this.world.width + x) * 4;
        let id = this.world.realmap[0][x][y];
        if(ItemManager.blocks[id]) this.setColour(pixelindex, ItemManager.blocks[id].minimapColour)
      }
    }

    this.ctx.putImageData(this.mapData, 0, 0);

    this.mapSprite.texture.baseTexture.update();
  }

  setColour(index, colour, visible = true) {
    this.mapData.data[index]   = (colour & 0xFF0000) >> 16; // red
    this.mapData.data[index+1] = (colour & 0x00FF00) >> 8; // green
    this.mapData.data[index+2] = (colour & 0x0000FF); // blue
    this.mapData.data[index+3] = visible ? 255 : 0; // alpha
  }
}
