class ItemBlock {
  id;
  layer;
  _frames = [];
  speed = 1;
  draw; getFrame;
  requiresUpdate;
  physics; returnPhysics;
  minimapColour;
  mightCollide; collides;

  vars = {};

  static default = {
    getFrame: function (offset, x, y) {
      return offset*this.speed + x + y;
    },

    draw: function(block) {
      block.texture.frame = this.frame;
    },
    drawAnim: function(block, offset, x, y) {
      block.texture.frame = this._frames[(this.getFrame(offset, x, y) >> 0)%this._frames.length];
    },

    requiresUpdate: function(offset, x, y) { return false; },
    requiresUpdateAnim: function(offset, x, y) {
      return (this.getFrame(offset, x, y) >> 0) !== (this.getFrame(offset - 0.3, x, y));
    },

    returnPhysics: {
      modX: 0,
      modY: Config.physics.gravity,
    },
    physics: function(info) {
      return this.returnPhysics;
    },

    collides: function(player, x, y) {
      return true;
    }
  }

  constructor(id, layer, artOffset, yOffset, mightCollide = true, frames = 1, speed = 1, displayFrame = 0) {
    this.id = id;
    this.layer = layer;
    this.speed = speed;

    if(displayFrame != 0) Object.defineProperty(this, 'frame', {get: function() {return this._frames[displayFrame]}})

    let anim = false;
    if(Array.isArray(frames)) {
      anim = true;
      for (var i = 0; i < frames.length; i++)
        this._frames.push(this.generateFrame(artOffset+frames[i], yOffset));
    }

    else if(frames > 1) {
      anim = true;
      for (var i = 0; i < frames; i++)
        this._frames.push(this.generateFrame(artOffset+i, yOffset));
    }

    else this._frames = [this.generateFrame(artOffset, yOffset)];

    this.minimapColour = this.generateMapColour();

    this.draw = anim ? ItemBlock.default.drawAnim : ItemBlock.default.draw;
    this.requiresUpdate = anim ? ItemBlock.default.requiresUpdateAnim : ItemBlock.default.requiresUpdate;
    this.getFrame = ItemBlock.default.getFrame;

    this.returnPhysics = ItemBlock.default.returnPhysics;
    this.physics = ItemBlock.default.physics;

    this.mightCollide = mightCollide;
    this.collides = ItemBlock.default.collides;
  }

  generateFrame(artOffset, yOffset) {
    return new Rectangle(
      artOffset*(Config.blockSize + 2*Config.blockPadding) + Config.blockPadding,
      yOffset*(Config.blockSize + 2*Config.blockPadding) + Config.blockPadding,
      Config.blockSize, Config.blockSize)
  }

  get frame() {
    return this._frames[0];
  }

  get sprite() {
    return new Sprite(new Texture(ItemManager.blocksBMD, this.frame));
  }

  generateMapColour() {
    let pixelData = Global.app.renderer.plugins.extract.pixels(this.sprite);
    let r = 0, g = 0, b = 0;
    let pixels = Config.blockSize**2;

    for(let i = 0; i < pixels * 4; i+=4) {
      r += pixelData[i];
      g += pixelData[i+1];
      b += pixelData[i+2];
    }
    r /= pixels; g /= pixels; b /= pixels;

    return  (r<<16) | (g<<8) | b;
  }
}
