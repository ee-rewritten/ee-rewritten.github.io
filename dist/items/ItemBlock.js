class ItemBlock {
  id;
  layer;
  _frames = [];
  speed = 1;
  requiresUpdate;
  draw;

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

    if(draw == null)
      draw = anim ? ItemBlock.drawDefaultAnim : ItemBlock.drawDefaultAnim;
    this.draw = draw;

    if(update == null)
      update = anim ? ItemBlock.updateDefaultAnim : ItemBlock.updateDefault;
    this.requiresUpdate = update;
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
}
