class Player extends PIXI.Sprite {
  isme;

  constructor(isme, x, y) {
    let texture = new Texture(ItemManager.smileysBMD, new Rectangle(0,0,Config.smileySize,Config.smileySize));
    super(texture);
    this.isme = isme;
    this.x = x;
    this.y = y;
  }

  set smiley(id) {
    this.texture.frame = new Rectangle(id*Config.smileySize, 0,
      Config.smileySize, Config.smileySize);
  }
  get smiley() {
    return this.texture.frame.x/Config.smileySize;
  }

  tick() {

  }
}
