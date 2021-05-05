class ItemBlockPack extends PIXI.Container {
  name = '';
  payvaultId = '';
  tab = 0;
  blocks = [];
  yOffset = 0;

  displayOnly = false;

  usedFrames = 0;

  nameText;
  blockContainer;
  blockSelector;

  constructor(name, payvaultId, tab, packId, yOffset, displayOnly = false) {
    super();
    this.name = name;
    this.payvaultId = payvaultId;
    this.tab = tab;
    this.packId = packId;
    this.yOffset = yOffset;

    this.displayOnly = displayOnly;

    this.nameText = UI.createText(name, 'Visitor');
    this.addChild(this.nameText);

    let parentContainer = new Container();
    parentContainer.y = this.nameText.height-2;
    this.addChild(parentContainer);

    this.blockContainer = new Container();
    parentContainer.addChild(this.blockContainer);

    this.blockSelector = new Sprite(loader.resources['selector'].texture);
    this.blockSelector.visible = false;
    parentContainer.addChild(this.blockSelector);
  }

  pushBlock(block) {
    let blockSprite = ItemManager.blockEmpty[1] ? ItemManager.blockEmpty[1].sprite : block.sprite;
    blockSprite.x = this.blocks.length * Config.blockSize;
    blockSprite.setAttr('blockid', block.id);

    blockSprite.interactive = true;
    blockSprite.on('pointerdown', e => {
      Global.base?.UI?.selectBlock(e.target.getAttr('blockid'));
    });
    blockSprite.on('pointerover', e=>document.body.style.cursor = 'pointer');
    blockSprite.on('pointerout', e=>document.body.style.cursor = '');

    if(ItemManager.blockEmpty[1]) {
      let actualBlockSprite = block.sprite;
      blockSprite.addChild(actualBlockSprite);
    }
    this.blockContainer.addChild(blockSprite);

    this.blocks.push(block);

    this.blockContainer.x = 0;
    if(this.nameText.width > this.blockContainer.width)
      this.blockContainer.x = Math.floor((this.nameText.width-this.blockContainer.width)/2);

    if(this.displayOnly) return;
    ItemManager.blocks[block.id] = block;
  }
  selectBlock(id) {
    for(let i = 0; i < this.blockContainer.children.length; i++) {
      let block = this.blockContainer.children[i];
      if(block.getAttr('blockid') == id) {
        this.blockSelector.visible = true;
        this.blockSelector.x = block.x;
        return;
      }
    }
    this.blockSelector.visible = false;
  }

  addStaticBlock(layer, artOffset = null) {
    //limit of 2^6 blocks per pack because ID system
    if(this.blocks.length == 64)
      throw new Error(`Maximum blocks reached in pack ${this.name}`);

    if(artOffset == null) artOffset = this.usedFrames;

    //adding a regular block to the pack
    let id = ItemManager.calculateId(this.tab, this.packId, this.blocks.length);

    this.pushBlock(new ItemBlock(id, layer, artOffset, this.yOffset));

    this.usedFrames++;
  }

  addStaticBlocks(amount, layer, artOffset = null) {
    for(let i = 0; i < amount; i++) {
      if(artOffset == null) this.addStaticBlock(layer);
      else this.addStaticBlock(layer, i+artOffset);
    }
  }

  addAnimatedBlock(frames, layer, speed = 1, artOffset = null) {
    if(!artOffset) artOffset = this.usedFrames;
    let id = ItemManager.calculateId(this.tab, this.packId, this.blocks.length);

    this.pushBlock(new ItemBlock(id, layer, artOffset, this.yOffset, frames, speed));

    this.usedFrames += frames;
  }

  //class ItemBlockMorphs extends ItemBlockPack?
  addMorph() {
    //code for adding a morph
  }

  hasId(id) {
    for (let i = 0; i < this.blocks.length; i++) {
      if(this.blocks[i].id == id) return true;
    }
    return false;
  }
}
