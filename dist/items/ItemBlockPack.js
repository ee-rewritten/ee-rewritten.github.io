class ItemBlockPack {
  name = '';
  payvaultId = '';
  tab = 0;
  blocks = [];
  yOffset = 0;
  usedFrames = 0;

  constructor(name, payvaultId, tab, packId, yOffset) {
    this.name = name;
    this.payvaultId = payvaultId;
    this.tab = tab;
    this.packId = packId;
    this.yOffset = yOffset;
  }

  addStaticBlock(artOffset) {
    //limit of 2^6 blocks per pack because ID system
    if(this.blocks.length == 64)
      throw new Error(`Maximum blocks reached in pack ${this.name}`);

    if(!artOffset) artOffset = this.usedFrames;

    //adding a regular block to the pack
    let id = ItemManager.calculateId(this.tab, this.packId, this.blocks.length);

    let block = new ItemBlock(id, artOffset, this.yOffset);

    ItemManager.blocks[id] = block;
    this.blocks.push(block);

    this.usedFrames++;
  }

  addStaticBlocks(amount) {
    for(let i = 0; i < amount; i++) this.addStaticBlock();
  }

  addAnimatedBlock(frames, speed, artOffset) {
    if(!artOffset) artOffset = this.usedFrames;
    let id = ItemManager.calculateId(this.tab, this.packId, this.blocks.length);

    let block = new ItemBlock(id, artOffset, this.yOffset, frames, speed);

    ItemManager.blocks[id] = block;
    this.blocks.push(block);

    this.usedFrames += frames;
  }

  //class ItemBlockMorphs extends ItemBlockPack?
  addMorph() {
    //checks if there are any blocks
    if(this.blocks.length) {
      //code for adding a morph
    }
  }

  hasId(id) {
    for (let i = 0; i < this.blocks.length; i++) {
      if(this.blocks[i].id == id) return true;
    }
    return false;
  }
}
