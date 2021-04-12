class PlayState extends State {
  target;
  world;
  player;
  players;

  camera = {
    x: 0,
    y: 0
  }
  constructor(width, height, depth) {
    super();

    this.players = new Container();

    this.world = new World(this, width, height, depth);

    this.player = new Player(this, true, Config.blockSize, Config.blockSize);
    this.player.smiley = 20;
    this.player.godmodeSprite.tint = 0xAAFF00;
    this.players.addChild(this.player);
    this.target = this.player;

    this.camera.x = this.target.x - Config.gameWidthCeil/2;
    this.camera.y = this.target.y - Config.gameHeightCeil/2;
    this.enterFrame();
  }

  enterFrame() {
    this.world.x = -Math.round(this.camera.x);
    this.world.y = -Math.round(this.camera.y);
    this.world.redraw();

    this.players.children.forEach(p => {
      p.enterFrame();
    });
  }

  tick() {
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

    if(Input.isKeyJustPressed(Key.godmode)) {
      this.player.toggleGodMode();
    }

    if(Input.isMouseDown && Input.mouseX <= Config.gameWidth && Input.mouseY <= Config.gameHeight) {
      let id = Input.isKeyDown(16) ? ItemManager.blockEmpty[0].id : ItemManager.packs['beta'].blocks[3].id;
      let pos = this.world.toLocal({x: Input.mouseX, y: Input.mouseY}, Global.stage);
      this.world.setTile(id, Math.floor(pos.x/Config.blockSize), Math.floor(pos.y/Config.blockSize));
    }


    this.players.children.forEach(p => {
      p.tick();
    });
    this.world.tick();
    if(this.target != null) {
      this.camera.x -= (this.camera.x - (this.target.x - Config.gameWidthCeil/2)) * Config.camera_lag;
      this.camera.y -= (this.camera.y - (this.target.y - Config.gameHeightCeil/2)) * Config.camera_lag;
    }
  }
}
