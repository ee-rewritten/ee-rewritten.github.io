class PlayState extends State {
  target;
  world; worldName; worldInfo;
  player;
  players; names;

  layerlock = 0;

  camera = {
    x: 0,
    y: 0
  }
  constructor(width, height, depth, worldName, worldInfo) {
    super();

    this.players = new Array(ItemLayer.PLAYER_LAYERS.length);
    this.names = new Array(ItemLayer.NAME_LAYERS.length);
    for (let i = 0; i < this.players.length; i++) {
      this.players[i] = new Container();
      this.names[i] = new Container();
    }

    this.world = new World(this, width, height, depth);
    this.worldName = worldName;
    this.worldInfo = worldInfo;

    this.player = new Player(this, true, 'seb135', Config.blockSize, Config.blockSize);
    this.player.godmodeSprite.tint = 0xAAFF00;
    this.target = this.player;

    this.camera.x = this.target.x - Config.gameWidthCeil/2;
    this.camera.y = this.target.y - Config.gameHeightCeil/2;
    this.enterFrame();
  }

  movePlayer(p) {
    if(p.layer != null) {
      this.players[p.layer].removeChild(p);
      this.names[p.layer].removeChild(p.nameText);
    }
    p.layer = p.isInGodMode ? 1 : 0;
    this.players[p.layer].addChild(p);
    this.names[p.layer].addChild(p.nameText);
  }

  enterFrame() {
    this.world.x = -Math.round(this.camera.x);
    this.world.y = -Math.round(this.camera.y);
    this.world.redraw();

    for(let i = 0; i < this.players.length; i++) {
      this.players[i].children.forEach(p => {
        p.enterFrame();
      });
    }
  }

  tick() {
    if(Input.isKeyJustPressed(122)) {
      Global.fullscreen = !Global.isFullscreen;
    }

    if(Input.isKeyDown(Key.lookLeft)) {
      this.camera.x -= 15;
    }
    if(Input.isKeyDown(Key.lookRight)) {
      this.camera.x += 15;
    }
    if(Input.isKeyDown(Key.lookUp)) {
      this.camera.y -= 15;
    }
    if(Input.isKeyDown(Key.lookDown)) {
      this.camera.y += 15;
    }
    if(Input.isKeyJustPressed(Key.lockCamera)) {
      this.target = this.target ? null : this.player;
    }
    if(Input.isKeyJustPressed(Key.hideUI)) {
      Global.base.UI.visible = !Global.base.UI.visible;
    }

    if(Input.isKeyJustPressed(Key.godmode)) {
      this.player.toggleGodMode();
    }

    if(Input.isKeyJustPressed(16)) {
      Global.base.UI.tempSelectDelete();
    }
    else if(Input.isKeyJustReleased(16)) {
      Global.base.UI.selectBlock(Global.base.UI._selectedBlock);
    }

    if(Input.isKeyJustPressed(66)) {
      Global.base.UI.showUI(Global.base.UI.blockMenu, true);
    }
    if(Input.isKeyJustReleased(66)) {
      Global.base.UI.showUI(Global.base.UI.blockMenu, false);
    }

    if(Input.isMouseDown && Global.base.UI.isMouseInGame) {
      let id = Global.base.UI.selectedBlock;
      let pos = this.world.toLocal({x: Input.mouseX, y: Input.mouseY}, Global.stage);
      let x = Math.floor(pos.x/Config.blockSize), y = Math.floor(pos.y/Config.blockSize)

      if(ItemManager.isBlockEmpty(id)) {
        if(Input.isMouseJustPressed) {
          if(ItemManager.isBlockEmpty(this.world.getTile(0, x, y))) this.layerlock = 1;
          else this.layerlock = 0;
        }
        id = ItemManager.blockEmpty[this.layerlock].id;
      }

      this.world.setTile(id, x, y);
    }


    for(let i = 0; i < this.players.length; i++) {
      this.players[i].children.forEach(p => {
        p.tick();
      });
    }
    this.world.tick();
    if(this.target != null) {
      this.camera.x -= (this.camera.x - (this.target.x - Config.gameWidthCeil/2)) * Config.camera_lag;
      this.camera.y -= (this.camera.y - (this.target.y - Config.gameHeightCeil/2)) * Config.camera_lag;
    }
  }
}
