class PlayState extends State {
  target;
  world; worldName; worldInfo;
  player;
  players;

  selectedBlock = ItemManager.blockEmpty[0].id;
  layerlock = 0;

  camera = {
    x: 0,
    y: 0
  }
  constructor(width, height, depth, worldName, worldInfo) {
    super();

    this.players = new Array(ItemLayer.PLAYER_LAYERS.length);
    for (let i = 0; i < this.players.length; i++) {
      this.players[i] = new Container();
    }

    this.world = new World(this, width, height, depth);
    this.worldName = worldName;
    this.worldInfo = worldInfo;

    this.player = new Player(this, true, 'seb135', Config.blockSize, Config.blockSize);
    this.player.smiley = 20;
    this.player.godmodeSprite.tint = 0xAAFF00;
    this.target = this.player;

    this.camera.x = this.target.x - Config.gameWidthCeil/2;
    this.camera.y = this.target.y - Config.gameHeightCeil/2;
    this.enterFrame();
  }

  movePlayer(p) {
    if(p.layer != null) this.players[p.layer].removeChild(p);
    p.layer = p.isInGodMode ? 1 : 0;
    this.players[p.layer].addChild(p);
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

    if(Input.isMouseDown && Input.mouseX <= Config.gameWidth && Input.mouseY <= Config.gameHeight) {
      let id = this.selectedBlock;
      let pos = this.world.toLocal({x: Input.mouseX, y: Input.mouseY}, Global.stage);
      let x = Math.floor(pos.x/Config.blockSize), y = Math.floor(pos.y/Config.blockSize)

      if((Input.isKeyDown(16) || ItemManager.isBlockEmpty(id))) {
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
