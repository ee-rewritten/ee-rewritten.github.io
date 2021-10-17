class ItemBlock {
  id;
  layer;
  _frames = [];
  speed = 1;
  requiresUpdate;
  draw;
  minimapColour;

  vars = {};

  static drawDefault = function(block, world) {
    block.texture.frame = this.frame;
  }
  static drawDefaultAnim = function(block, world) {
    block.texture.frame = this._frames[
      ((world.offset*this.speed >> 0) + block.x/Config.blockSize + block.y/Config.blockSize)
      %this._frames.length
    ];
  }
  static updateDefault = function(block, world) { return false; }
  static updateDefaultAnim = function(block, world) {
    let newFrame = world.offset*this.speed >> 0, lastFrame = block.getAttr('lastFrame');
    block.setAttr('lastFrame', newFrame);
    return newFrame !== lastFrame;
  }

  constructor(id, layer, artOffset, yOffset, frames = 1, speed = 1, draw = null, update = null) {
    this.id = id;
    this.layer = layer;
    this.speed = speed;

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

    if(draw == null)
      draw = anim ? ItemBlock.drawDefaultAnim : ItemBlock.drawDefaultAnim;
    this.draw = draw;

    if(update == null)
      update = anim ? ItemBlock.updateDefaultAnim : ItemBlock.updateDefault;
    this.requiresUpdate = update;
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
