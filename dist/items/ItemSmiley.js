class ItemSmiley {
  id; name; payvaultId; minimapColour;
  frames = []; speed = 1; isAnimated = false;
  constructor(id, name, payvaultId, minimapColour, speed, frames) {
    this.name = name; this.payvaultId = payvaultId; this.minimapColour = minimapColour; this.id = id;
    this.speed = speed;

    if(frames > 1) {
      this.isAnimated = true;
      for (var i = 0; i < frames; i++) {
        this._frames.push(this.generateFrame(ItemManager.smileysBMD, i));
      }
    }
    else this._frames = [this.generateFrame(ItemManager.smileysBMD)];
  }

  generateFrame(image, offset = 0) {
    let frame = [];
    for(let row = 0; row < Config.smileyRows; row++) {
      let x = (this.id+offset) * Config.smileySize;
      let y = row * Config.smileySize;

      // phones can only load images with sizes less than 4096px
      // thus the smiley image is 4082px
      if(x >= image.width) {
        let wraps = Math.floor(x/image.width);
        for(let i = 0; i < wraps; i++) {
          x -= image.width;
          y += Config.smileyRows*Config.smileySize;
        }
      }
      frame.push(new Rectangle(x, y, Config.smileySize, Config.smileySize));
    }
    return frame;
  }
  frame(row) {
    return this._frames[0][row];
  }
  animationFrame(offset, row) {
    return this._frames[(offset*this.speed >> 0)%this._frames.length][row];
  }
}