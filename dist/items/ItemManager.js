class ItemManager {
  static blocksBMD;
  static smileysBMD;
  static godmodeBMD;

  static blockEmpty = [];
  static blockVoid;
  static blockError = [];

  static blockTabs = [];
  static blocks = {};
  static packs = [];

  static _addingToTab = 0;

  static smileys = [];
  static auraColours = [];

  static baseTexture(id) {
    return loader.resources[id].texture.baseTexture;
  }

  static loadAssets() {
    loader
      .add('blocks', './Assets/blocks.png')
      .add('smileys', './Assets/smileys.png')
      .add('godmode', './Assets/godmode.png')

      .add('aurabutton', './Assets/aurabutton.png')
      .add('aurabutton_overlay', './Assets/aurabutton_overlay.png')
  }

  static init() {
    this.blocksBMD = this.baseTexture('blocks');
    this.smileysBMD = this.baseTexture('smileys');
    this.godmodeBMD = this.baseTexture('godmode');

    for(let i = 0; i < 40; i++) {
      this.createSmiley(`smiley${i}`)
    }
    // this.smileys[20] = new ItemSmiley(20, 'New Years 2010', '', 0xFFFFFF, 1, 1);

    for(let key in ItemAuraColour.colours)
      this.createAuraColour(key);

    let pack, block;

    this._addingToTab = ItemTab.BLOCKS;

    pack = this.createBlockPack('game', 'unobtainable');
    pack.addStaticBlock(ItemLayer.BELOW);
    pack.addStaticBlock(ItemLayer.BACKGROUND);
    pack.addStaticBlocks(2, ItemLayer.BELOW);
    pack.addStaticBlock(ItemLayer.BACKGROUND);
    this.blockEmpty = [pack.blocks[0], pack.blocks[1]];
    this.blockVoid = [pack.blocks[0], pack.blocks[2], pack.blocks[0]];
    this.blockError = [pack.blocks[3], pack.blocks[4]];

    this.createBlockPack('basic').addStaticBlocks(10, ItemLayer.BELOW);

    this.createBlockPack('beta').addStaticBlocks(10, ItemLayer.BELOW);
    // pack = this.createBlockPack('beta');
    // pack.addStaticBlocks(3, ItemLayer.ABOVE);
    // pack.addAnimatedBlock(7, ItemLayer.ABOVE, 0.5);

    this.createBlockPack('brick').addStaticBlocks(10, ItemLayer.BELOW);
    this.createBlockPack('metal').addStaticBlocks(3, ItemLayer.BELOW);
    this.createBlockPack('grass').addStaticBlocks(3, ItemLayer.BELOW);
    this.createBlockPack('generic').addStaticBlocks(5, ItemLayer.BELOW);
    this.createBlockPack('factory').addStaticBlocks(5, ItemLayer.BELOW);
    this.createBlockPack('secrets').addStaticBlocks(1, ItemLayer.BELOW);
    this.createBlockPack('glass').addStaticBlocks(8, ItemLayer.BELOW);
    this.createBlockPack('minerals').addStaticBlocks(7, ItemLayer.BELOW);
    this.createBlockPack('christmas 2011').addStaticBlocks(5, ItemLayer.BELOW);

    pack = this.createBlockPack('candy');
    pack.addStaticBlocks(2, ItemLayer.BELOW);
    pack.addStaticBlocks(3, ItemLayer.BELOW, 6);

    this.createBlockPack('summer 2011').addStaticBlocks(1, ItemLayer.BELOW);
    this.createBlockPack('halloween 2011').addStaticBlocks(2, ItemLayer.BELOW);

    // this.lastYOffset = 15;
    this.createBlockPack('sci-fi').addStaticBlocks(9, ItemLayer.BELOW);
    // pack = this.createBlockPack('sci-fi');
    // pack.addGenericBlock(ItemLayer.BELOW, 0, 9, 1/10, function(block, world) {
    //   block.texture.frame = this._frames[Global.randomInt(0, this._frames.length-1)];
    // });

    this._addingToTab = ItemTab.ACTION;
    this.lastYOffset = 54;
    pack = this.createBlockPack('gravity');
    pack.addGenericBlock(ItemLayer.BELOW, 0, false).returnPhysics = {modX: -Config.physics.gravity, modY: 0};
    pack.addGenericBlock(ItemLayer.BELOW, 1, false).returnPhysics = {modX: 0, modY: -Config.physics.gravity};
    pack.addGenericBlock(ItemLayer.BELOW, 2, false).returnPhysics = {modX: Config.physics.gravity, modY: 0};
    pack.addGenericBlock(ItemLayer.BELOW, 3, false).returnPhysics = {modX: 0, modY: Config.physics.gravity};
    pack.addGenericBlock(ItemLayer.BELOW, 4, false).returnPhysics = {modX: 0, modY: 0, queue: 2};
    pack.addGenericBlock(ItemLayer.BELOW, 5, false).returnPhysics = {modX: 0, modY: 0, queue: 2, drag: Config.physics.climbable_drag};

    this.lastYOffset = 67;
    pack = this.createBlockPack('timedoor');

    block = pack.addGenericBlock(ItemLayer.BELOW, 0, true, 10);
    block.getFrame = function(offset) { return offset/0.3 / 100 }
    block.collides = function(player, x, y, offset) { return (offset/0.3 / 100)%10 >= 5 }

    block = pack.addGenericBlock(ItemLayer.BELOW, 0, true, 10, null, 5);
    block.getFrame = function(offset) { return offset/0.3 / 100 + 5 }
    block.collides = function(player, x, y, offset) { return (offset/0.3 / 100)%10 < 5 }
    // block.displayFrame = 5;


    this._addingToTab = ItemTab.BACKGROUND;
    this.lastYOffset = 135;
    this.createBlockPack('basic').addStaticBlocks(10, ItemLayer.BACKGROUND);
    this.createBlockPack('beta').addStaticBlocks(10, ItemLayer.BACKGROUND);
    this.createBlockPack('brick').addStaticBlocks(10, ItemLayer.BACKGROUND);
  }

  static createAuraColour(name, payvaultId) {
    let colour = ItemAuraColour.colours[name] || 0x000000;
    let pid = payvaultId || `aura${name}`;

    let auraColour = new ItemAuraColour(this.auraColours.length, colour, pid);
    this.auraColours.push(auraColour);
    return auraColour;
  }

  static getSmileyById(id) {
    return this.smileys[id];
  }

  static isBlockEmpty(id) {
    for(let i = 0; i < this.blockEmpty.length; i++) {
      if(id == this.blockEmpty[i].id) return true;
    }
    return false;
  }

  static createSmiley(name, payvaultId = '', minimapColour = 0xFFFFFF, speed = 1, frames = 1) {
    let smiley = new ItemSmiley(this.smileys.length, name, payvaultId, minimapColour, speed, frames);
    this.smileys.push(smiley);
    return smiley;
  }

  static lastYOffset = 0;
  static createBlockPack(name, payvaultId = '') {
    let tab = this._addingToTab;
    if(!this.blockTabs[tab]) this.blockTabs[tab] = [];
    if(!this.packs[tab]) this.packs[tab] = {};

    //limit of 2^7 packs per tab because of ID system
    if(this.blockTabs[tab].length == 128)
      throw new Error(`Maximum packs in tab ${tab} reached while adding pack '${name}'`);

    let bp = new ItemBlockPack(name, payvaultId, tab, this.blockTabs[tab].length, this.lastYOffset++);

    this.blockTabs[tab].push(bp);

    this.packs[tab][name] = bp;
    return bp;
  }

  static calculateId(tab, packId, blockIndex) {
    return tab << 13 | packId << 6 | blockIndex;
  }
  static getTabFromId(id) {
    return id >> 13;
  }
  static getPackFromId(id) {
    return this.blockTabs[this.getTabFromId(id)][(id >> 6) & 0b111111];
  }

  _hotbarBlocks;
  static get defaultHotbarBlocks() {
    if(!this._hotbarBlocks) {
      this._hotbarBlocks = [
        this.blockEmpty[0],
        ...this.packs[0]['basic'].blocks,
        this.packs[0]['secrets'].blocks[0],
      ];
    }
    return this._hotbarBlocks;
  }
}
