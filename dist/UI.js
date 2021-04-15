class UI extends PIXI.Container {
  debugText;
  showDebug = true;
  fps = new Array(10);
  report = {};

  joystick;
  joystickPointerId = -1;

  chat; worldName; worldInfo;

  hotbar;

  infoBG; infoBox; info;

  static loadAssets() {
    loader
      .add('hotbar', './Assets/hotbar.png') //borders: 1
      .add('info', './Assets/info.png') //12
      .add('chat', './Assets/chat.png') //1

      .add('outer', './Assets/outer.png')
      .add('inner', './Assets/inner.png')
  }

  static createNineSlice(name, borders) {
    return new NineSlice(loader.resources[name].texture, borders, borders, borders, borders);
  }
  static createText(text, font, scale = 1) {
    return new BMText(text, {fontName: font,
      fontSize: (font == 'Visitor' ? Config.fontVisitorSize :
                 font == 'Nokia' ? Config.fontNokiaSize : 1) * scale});
  }
  static createShadowText(text, font, blur = 2, amount = 3, scale = 1) {
    return new ShadowText(text, {fontName: font,
      fontSize: (font == 'Visitor' ? Config.fontVisitorSize :
                 font == 'Nokia' ? Config.fontNokiaSize : 1) * scale},
      blur, amount);
  }

  constructor() {
    super();
    Global.report = this.report;

    // bottom hotbar
    this.hotbar = UI.createNineSlice('hotbar', 1);
    this.hotbar.width = Config.gameWidth;
    this.hotbar.y = Config.gameHeight;
    this.addChild(this.hotbar);


    // right chat panel
    this.chat = UI.createNineSlice('chat', 1);
    this.chat.width = Config.fullWidth-Config.gameWidth;
    this.chat.height = Config.fullHeight;
    this.chat.x = Config.gameWidth;
    this.addChild(this.chat);

    this.worldName = UI.createText(Global.base.state.worldName, 'Visitor', 2);
    this.worldName.x = 4;
    this.worldName.y = 1;
    this.chat.addChild(this.worldName);

    this.worldInfo = UI.createText('', 'Visitor');
    this.worldInfo.tint = 0xA9A9A9;
    this.worldInfo.x = 5;
    this.worldInfo.y = 19;
    for (const stat in Global.base.state.worldInfo) {
      this.worldInfo.text += `${stat}: ${Global.base.state.worldInfo[stat]}\n`;
    }
    this.chat.addChild(this.worldInfo);


    // top left debug info
    this.debugText = UI.createShadowText('FPS: xx', 'Nokia');
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

    this.infoBox = UI.createNineSlice('info', 12);
    this.info.addChild(this.infoBox);
    this.info.visible = false;

    this.addChild(this.info);


    // joystick.
    if(Global.isMobile) {
      this.joystick = new Joystick({
        outer: new Sprite(loader.resources['outer'].texture),
        inner: new Sprite(loader.resources['inner'].texture),

        onStart: event => {
          this.joystickPointerId = event.data.pointerId;
          Input.joystickDirection = 'start';
        },
        onChange: (event, data) => {
          Input.joystickDirection = data.power > 0.6 ? data.direction : '';
        },
        onEnd: event => {
          Input.joystickDirection = '';
          this.joystickPointerId = -1;
        }
      });
      this.joystick.outer.alpha = 0.6;
      this.joystick.inner.alpha = 0.4;
      this.joystick.x = this.joystick.width/2 + 10;
      this.joystick.y = Config.gameHeight - this.joystick.height/2 - 10;
      this.addChild(this.joystick);
    }

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
