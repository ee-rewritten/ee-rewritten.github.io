class Player extends PIXI.Sprite {
  isme;
  x = 0;
  y = 0;
  texture;

  constructor(isme) {
    let texture = new Texture(ItemManager.smileysBMD, new Rectangle(0,0,Config.smileySize,Config.smileySize));
    super(texture);
    this.texture = texture;
    this.isme = isme;
  }

  set frame(id) {
    this.texture.frame = new Rectangle(id*Config.smileySize, 0,
      Config.smileySize, Config.smileySize);
  }
  get frame() {
    return this.texture.frame.x/Config.smileySize;
  }

  tick() {

  }
}
