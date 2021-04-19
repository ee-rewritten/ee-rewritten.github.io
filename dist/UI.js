class UI extends PIXI.Container {
  debugText;
  showDebug = true;
  fps = new Array(10);
  report = {};

  joystick;
  joystickPointerId = -1;

  chat; worldName; worldInfo;

  hotbar;
  hotbarsmiley;
  blockcontainer;
  blockselector;
  _selectedBlock;

  infoBG; infoBox; info;

  static loadAssets() {
    loader
      //9-slices
      .add('hotbar', './Assets/UI/hotbar.png') //borders: 1
      .add('info', './Assets/UI/info.png') //12
      .add('chat', './Assets/UI/chat.png') //1

      //joystick
      .add('outer', './Assets/UI/outer.png')
      .add('inner', './Assets/UI/inner.png')

      //hotbar images
      .add('share', './Assets/UI/share.png')
      .add('aura', './Assets/UI/aura.png')
      .add('chaticon', './Assets/UI/chaticon.png')
      .add('map', './Assets/UI/map.png')
      .add('favlike', './Assets/UI/favlike.png')
      .add('fullscreen', './Assets/UI/fullscreen.png')

      .add('selector', './Assets/UI/selector.png')
  }

  static createNineSlice(name, borders) {
    return new NineSlice(loader.resources[name].texture, borders, borders, borders, borders);
  }
  static createText(text, font, scale = 1, align = 'left') {
    return new BMText(text, {align: align, fontName: font,
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
    this.hotbar = new Hotbar();

    this.hotbar.addTextButton('goto\nlobby', false, 'lobby');
    this.hotbar.addTextureButton('share');

    let godbtn = this.hotbar.addTextButton('god\nmode', false, 'god');
    godbtn.interactive = true;
    godbtn.on('pointerdown', e=>Global.base.state.player.toggleGodMode());

    this.hotbarsmiley = new Sprite(new Texture(ItemManager.smileysBMD, Global.base.state.player.smileySprite.texture.frame));
    let bg = this.hotbar.addTextureButton('smiley', 'aura', 28, 28);
    bg.addChild(this.hotbarsmiley);
    this.hotbarsmiley.x = (30-Config.smileySize)/2;
    this.hotbarsmiley.y = (this.hotbar.height-Config.smileySize)/2;

    this.hotbar.addTextureButton('aura', null, 28, 28);
    this.hotbar.addTextureButton('chat', 'chaticon', 28, 28);

    // this.hotbar.addTextButton('enter level code to edit        ', false, 'code');
    let blockbar = this.createBlockBar();
    this.hotbar.addImageButton('edit', blockbar, null, null, 0, false, blockbar.width + 7, false)

    this.hotbar.addTextureButton('map', null, 29, 28, 0, true, 31);
    this.hotbar.addTextureButton('favlike', null, 43, 28, 0, true, 43);
    this.hotbar.addTextButton('options', true);

    this.hotbar.addTextureButton('fullscreen', null, null, null, 0, true,);
    this.hotbar.addEventListener('fullscreen', 'pointerdown', e=>Global.fullscreen = !Global.isFullscreen);

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

  createBlockBar() {
    let blockbar = new Container();
    blockbar.x = 3;

    this.blockcontainer = new Container();
    let numcontainer = new Container();
    this.blockcontainer.y = numcontainer.y = this.hotbar.height - Config.blockSize - 3;
    blockbar.addChild(this.blockcontainer);
    blockbar.addChild(numcontainer);

    for(let i = 0; i <= 10; i++) {
      let imblock = i ? ItemManager.packs['basic'].blocks[i-1] : ItemManager.blockEmpty[1];
      if(!imblock) break;
      let block = imblock.sprite;
      block.x = i * Config.blockSize;
      block.setAttr('blockid', imblock.id);
      block.setAttr('id', i);

      let blocknum = UI.createText(i ? (i%10).toString() : '^', 'Visitor');
      blocknum.x = block.x + Config.blockSize - blocknum.width+3;
      blocknum.y = Config.blockSize - blocknum.height+5;
      blocknum.alpha = 0.5;

      block.interactive = true;
      block.on('pointerdown', e => {
        this.selectBlock(e.target.getAttr('blockid'));
      });

      this.blockcontainer.addChild(block);
      numcontainer.addChild(blocknum);
    }
    this.blockselector = new Sprite(loader.resources['selector'].texture);
    this.blockcontainer.addChild(this.blockselector);

    this.selectNthBlock(0);

    let blockbartext = UI.createText('level bricks', 'Visitor');
    blockbartext.y = 1;
    blockbar.addChild(blockbartext);

    let blockmore = UI.createText('^ more', 'Visitor');
    blockmore.x = this.blockcontainer.width +  6;
    blockmore.y = (this.hotbar.height-blockmore.height)/2 + 2;
    blockbar.addChild(blockmore);

    return blockbar;
  }

  selectBlock(value) {
    this._selectedBlock = value;
    for(let i = 0; i < this.blockcontainer.children.length; i++) {
      let block = this.blockcontainer.children[i];
      if(block.getAttr('blockid') == value) {
        this.blockselector.visible = true;
        this.blockselector.x = block.x;
        return;
      }
    }
    this.blockselector.visible = false;
  }
  get selectedBlock() {return this._selectedBlock}

  selectNthBlock(value) {
    let block = this.blockcontainer.children[value];
    if(!block) return;

    if(block.getAttr('id') == value) {
      this.blockselector.visible = true;
      this.blockselector.x = block.x;
      this._selectedBlock = block.getAttr('blockid');
      return;
    }
  }

  handleKey(e) {
    this.selectNthBlock(this.getTopRowIndex(e));
  }
  getTopRowIndex(event) {
    if(event.code == 'Backquote') return 0;
    if(event.keyCode > 48 && event.keyCode < 58) return event.keyCode-48;
    if(event.keyCode == 48) return 10;
    if(event.code == 'Minus') return 11;
    if(event.code == 'Plus') return 12;
    return null;
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
