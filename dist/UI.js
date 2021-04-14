class UI extends PIXI.Container {
  debugText;
  showDebug = true;
  fps = new Array(10);
  report = {};

  chat; worldName; worldInfo;

  hotbar;

  infoBG; infoBox; info;

  static loadAssets() {
    loader
      .add('hotbar', './Assets/hotbar.png') //borders: 1
      .add('info', './Assets/info.png') //12
      .add('chat', './Assets/chat.png') //1
  }

  constructor() {
    super();
    Global.report = this.report;

    // bottom hotbar
    this.hotbar = this.createNineSlice('hotbar', 1);
    this.hotbar.width = Config.gameWidth;
    this.hotbar.y = Config.gameHeight;
    this.addChild(this.hotbar);


    // right chat panel
    this.chat = this.createNineSlice('chat', 1);
    this.chat.width = Config.fullWidth-Config.gameWidth;
    this.chat.height = Config.fullHeight;
    this.chat.x = Config.gameWidth;
    this.addChild(this.chat);

    this.worldName = new BMText(Global.base.state.worldName, {fontName: 'Visitor', fontSize:26});
    this.worldName.x = 4;
    this.worldName.y = -7;
    this.chat.addChild(this.worldName);

    this.worldInfo = new Container();
    let y = 15;
    for (const stat in Global.base.state.worldInfo) {
      let text = new BMText(`${stat}: ${Global.base.state.worldInfo[stat]}`, {fontName: 'Visitor', fontSize:13});;
      text.tint = 0xA9A9A9;
      text.x = 5;
      text.y = y;
      this.worldInfo.addChild(text);
      y += 9;
    }
    this.chat.addChild(this.worldInfo);


    // top left debug info
    this.debugText = new ShadowText('FPS: xx',{fontName: 'Nokia', fontSize:13});
    this.debugText.x = 5;
    this.addChild(this.debugText);

    this.report.Ping = 'xx';
    this.report.FPS = 'xx';
    this.report.Position = 'xx';
    this.report.Time = 'xx';


    // info popup
    this.info = new Container();

    this.infoBG = new Sprite(PIXI.Texture.WHITE);
    this.infoBG.tint = 0;
    this.infoBG.alpha = 0.6;
    this.infoBG.width = Config.gameWidth;
    this.infoBG.height = Config.gameHeight;
    this.info.addChild(this.infoBG);

    this.infoBox = this.createNineSlice('info', 12);
    this.info.addChild(this.infoBox);
    this.info.visible = false;

    this.addChild(this.info);
  }

  createNineSlice(name, borders) {
    return new NineSlice(loader.resources[name].texture, borders, borders, borders, borders);
  }

  redrawChat(width) {
    this.chat.width = width-Config.gameWidth;
  }

  showInfo(title, body) {
    this.info.visible = true;
    this.infoBox.width = Config.gameWidth - 200;
    this.infoBox.height = Config.gameHeight - 200;
    this.infoBox.x = this.infoBox.y = 100;
  }
  hideInfo() {
    this.info.visible = false;
  }

  enterFrame() {
    let player = Global.base.state.player;

    if(this.debugText.visible != this.showDebug) this.debugText.visible = this.showDebug;
    if(this.showDebug) {
      this.debugText.text = `Everybody Edits: Rewritten (vAlpha)`
      this.report.Ping = 'xx';
      this.report.FPS = this.getFPSText();
      this.report.Position = this.getPosText(player)
      this.report.Time = (player.ticks * Config.physics.ms_per_tick/1000).toFixed(2) + 's';
      for (const property in this.report) {
        this.debugText.text += `\n${property}: ${this.report[property]}`;
      }
    }
  }

  getFPSText() {
    //overengineered fps counter let's go
    let fps;
    if(fps < 1) fps = ticker.FPS;
    else {
      this.fps.shift();
      this.fps.push(ticker.FPS);
      fps = this.fps.reduce((a,b) => a+b)/this.fps.length;
      let diff = Math.abs(ticker.FPS-fps);

      if(diff > 5)
        for(let i; i < this.fps.length/2; i++) {
          this.fps.shift();
          this.fps.push(ticker.FPS);
        }
    }
    return fps < 1 ? `SPF: ${(1/fps).toFixed(1)}` : `${fps.toFixed(1)}`;
  }
  getPosText(player) {
    return `(${player.x.toFixed(3)}, ${player.y.toFixed(3)})`;
  }

  drawUIRect(localx, localy, width, height, x, y, colour) {
    let rect = new Graphics();
    rect.beginFill(colour);
    rect.lineStyle(1, 0x7B7B7B);
    rect.drawRect(localx, localy, width, height);
    rect.x = x;
    rect.y = y;
    rect.endFill();
    // rect.alpha = 0.5;
    this.addChild(rect);
    return rect;
  }
}
