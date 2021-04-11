class ItemManager {
  static blocksBMD;

  static blockEmpty = [];
  static blockVoid;

  static blockTabs = [];
  static blocks = {};
  static packs = {};

  static _addingToTab = 0;

  static baseTexture(id) {
    return loader.resources[id].texture.baseTexture;
  }

  static loadImages(callback) {
    //load images and run the callback when it's done
    loader
      .add('blocks', './Assets/blocks.png')
      .add('smileys', './Assets/smileys.png')
      .load(callback);
  }

  static init() {
    this.blocksBMD = this.baseTexture('blocks');
    this.smileysBMD = this.baseTexture('smileys');

    let pack;

    this._addingToTab = ItemTab.BLOCKS;

    pack = this.createBlockPack('game', 'unobtainable');
    pack.addStaticBlock(ItemLayer.BACKGROUND);
    pack.addStaticBlocks(2, ItemLayer.BELOW);
    this.blockEmpty = [pack.blocks[2], pack.blocks[0]];
    this.blockVoid = pack.blocks[1];

    pack = this.createBlockPack('basic');
    pack.addStaticBlocks(10, ItemLayer.BELOW);

    pack = this.createBlockPack('beta');
    pack.addStaticBlocks(3, ItemLayer.ABOVE);
    pack.addAnimatedBlock(7, ItemLayer.BELOW, 0.5);
  }

  static lastYOffset = 0;
  static createBlockPack(name, payvaultId = '') {
    let tab = this._addingToTab;
    if(!this.blockTabs[tab]) this.blockTabs[tab] = [];

    //limit of 2^7 packs per tab because of ID system
    if(this.blockTabs[tab].length == 128)
      throw new Error(`Maximum packs in tab ${tab} reached while adding pack '${name}'`);

    let bp = new ItemBlockPack(name, payvaultId, tab, this.blockTabs[tab].length, this.lastYOffset++);

    this.blockTabs[tab].push(bp);

    this.packs[name] = bp;
    return bp;
  }

  static calculateId(tab, packId, blockIndex) {
    return tab << 13 | packId << 6 | blockIndex;
  }
}
