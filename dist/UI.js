class UI extends PIXI.Container {
  debugText;
  fps = new Array(10);
  report = {};

  chat;
  hotbar;

  infoBG; infoBox; info;

  static loadAssets() {
    loader
      .add('hotbar', './Assets/hotbar.png') //borders: 1
      .add('info', './Assets/info.png') //12
  }

  constructor() {
    super();
    Global.report = this.report;

    this.hotbar = new NineSlice(loader.resources['hotbar'].texture, 1, 1, 1, 1);
    this.hotbar.width = Config.gameWidth;
    this.hotbar.y = Config.gameHeight;
    this.addChild(this.hotbar);

    this.chatRect = this.drawUIRect(1, -1,
      Config.fullWidth-Config.gameWidth, Config.fullHeight+2,
      Config.gameWidth, 0, 0x000000);

    this.debugText = new ShadowText('FPS: xx',{fontName: 'Nokia', fontSize:13});
    this.debugText.x = 5;
    this.addChild(this.debugText);

    this.report.Ping = 'xx';
    this.report.FPS = 'xx';
    this.report.Position = 'xx';
    this.report.Time = 'xx';

    this.info = new Container();

    this.infoBG = new Sprite(PIXI.Texture.WHITE);
    this.infoBG.tint = 0;
    this.infoBG.alpha = 0.6;
    this.infoBG.width = Config.gameWidth;
    this.infoBG.height = Config.gameHeight;
    this.info.addChild(this.infoBG);

    this.infoBox = new NineSlice(loader.resources['info'].texture, 12, 12, 12, 12);
    this.info.addChild(this.infoBox);
    this.info.visible = false;

    this.addChild(this.info);
  }
  redrawChat(width) {
    this.removeChild(this.chatRect);
    this.chatRect = this.drawUIRect(1, -1,
      width-Config.gameWidth, Config.fullHeight+2,
      Config.gameWidth, 0, 0x000000);
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
    this.debugText.text = `Everybody Edits: Rewritten (vAlpha)`
    this.report.Ping = 'xx';
    this.report.FPS = this.getFPSText();
    this.report.Position = this.getPosText(player)
    this.report.Time = (player.ticks * Config.physics.ms_per_tick/1000).toFixed(2) + 's';
    for (const property in this.report) {
      this.debugText.text += `\n${property}: ${this.report[property]}`;
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
