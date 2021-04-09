class ItemManager {
  static blocksBMD;

  static greyBasicRect;
  static blackBasicRect;
  static blackRect;

  static invisible;

  static baseTexture(id) {
    return loader.resources[id].texture.baseTexture;
  }
  static init() {
    this.blocksBMD = this.baseTexture('blocks');
    this.smileysBMD = this.baseTexture('smileys');

    this.greyBasicRect = new Rectangle(16, 0, 16, 16);
    this.blackBasicRect = new Rectangle(32, 0, 16, 16);
    this.blackRect = new Rectangle(0, 7*16, 16, 16);

    this.invisible = new Array(ItemLayer.LAYERS);
    this.invisible[ItemLayer.BACKGROUND] = new Rectangle(10*Config.blockSize, 0, Config.blockSize, Config.blockSize);
    this.invisible[ItemLayer.BELOW] = this.invisible[ItemLayer.BACKGROUND];
    this.invisible[ItemLayer.ABOVE] = this.invisible[ItemLayer.BACKGROUND];
  }
}
