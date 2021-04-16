class ItemBlock {
  id;
  layer;
  _frames = [];
  speed = 1;
  isAnimated = false;
  constructor(id, layer, artOffset, yOffset, frames = 1, speed = 1) {
    this.id = id;
    this.layer = layer;
    this.speed = speed;

    if(frames > 1) {
      this.isAnimated = true;
      for (var i = 0; i < frames; i++) {
        this._frames.push(this.generateFrame(artOffset+i, yOffset));
      }
    }
    else this._frames = [this.generateFrame(artOffset, yOffset)];
  }

  generateFrame(artOffset, yOffset) {
    return new Rectangle(artOffset*Config.blockSize, yOffset*Config.blockSize,
    Config.blockSize, Config.blockSize)
  }

  get frame() {
    return this._frames[0];
  }

  get sprite() {
    return new Sprite(new Texture(ItemManager.blocksBMD, this.frame));
  }

  animationFrame(offset, x, y) {
    return this._frames[((offset*this.speed >> 0)+x+y)%this._frames.length];
  }
}
