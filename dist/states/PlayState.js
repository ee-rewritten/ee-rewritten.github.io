class PlayState extends State {
  target;
  world;
  player;
  players;

  camera = {
    x: 0,
    y: 0
  }
  constructor() {
    super();
    this.players = new Container();
    let playerOffset = Math.round(-(Config.smileySize-Config.blockSize)/2);
    this.players.x = this.players.y = playerOffset;

    this.world = new World(this, 40, 30, 2);

    this.player = new Player(true, 20*Config.blockSize, 15*Config.blockSize);
    this.player.smiley = 0;
    this.players.addChild(this.player);
    this.target = this.player;

    this.camera.x = this.target.x - Config.gameWidthCeil/2;
    this.camera.y = this.target.y - Config.gameHeightCeil/2;
    this.enterFrame();
  }

  enterFrame() {
    this.world.gameContainer.x = -Math.round(this.camera.x);
    this.world.gameContainer.y = -Math.round(this.camera.y);
    this.world.redraw();
  }

  tick() {
    if(Input.isKeyDown(37)) {
      this.camera.x -= 15;
    }
    if(Input.isKeyDown(39)) {
      this.camera.x += 15;
    }
    if(Input.isKeyDown(38)) {
      this.camera.y -= 15;
    }
    if(Input.isKeyDown(40)) {
      this.camera.y += 15;
    }

    if(Input.isMouseDown && Input.mouseX <= Config.gameWidth && Input.mouseY <= Config.gameHeight) {
      let id = Input.isKeyDown(16) ? ItemManager.blockEmpty[1].id : ItemManager.packs['beta'].blocks[3].id;
      let pos = this.world.gameContainer.toLocal({x: Input.mouseX, y: Input.mouseY}, Global.stage);
      this.world.setTile(id, 0, Math.floor(pos.x/Config.blockSize), Math.floor(pos.y/Config.blockSize));
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
