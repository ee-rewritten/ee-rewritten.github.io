class UI extends PIXI.Container {
  debugText;
  showDebug = true;
  fps = new Array(10);
  report = {};

  joystick;
  joystickPointerId = -1;

  sidebar; worldName; worldInfo;
  userlist;
  chat;

  hotbar;
  hotbarSmiley;
  levelBricksPack;
  _selectedBlock; _tempDelete;
  menus = {};

  infoBG; infoBox; info;

  static loadAssets() {
    loader
      //9-slices
      .add('hotbar', './Assets/UI/hotbar.png') //borders: 1
      .add('info', './Assets/UI/info.png') //12
      .add('sidebar', './Assets/UI/sidebar.png') //1
      .add('menu', './Assets/UI/menu.png') //1

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
      .add('moreless', './Assets/UI/moreless.png')

      .add('selector', './Assets/UI/selector.png')
  }

  static createNineSlice(name, borders = 1) {
    return new NineSlice(loader.resources[name].texture, borders, borders, borders, borders);
  }
  static createText(text, font, scale = 1, align = 'left') {
    return new BMText(text, {align: align, fontName: font,
      fontSize: (font == 'Visitor' ? Config.fontVisitorSize :
                 font == 'Nokia' ? Config.fontNokiaSize : 1) * scale});
  }
  static createShadowText(text, font, scale = 1, align = 'left', ...rest) {
    return new ShadowText(text, {align: align, fontName: font,
      fontSize: (font == 'Visitor' ? Config.fontVisitorSize :
                 font == 'Nokia' ? Config.fontNokiaSize : 1) * scale},
      ...rest);
  }
  static makeButton(object, callback, ...args) {
    object.interactive = true;
    object.on('pointerdown', e=>{
      callback(e, ...args);
    });
    object.on('pointerover', e=>document.body.style.cursor = 'pointer');
    object.on('pointerout', e=>document.body.style.cursor = '');
  }

  constructor() {
    super();
    Global.report = this.report;

    // bottom hotbar
    this.hotbar = new Hotbar();

    this.hotbar.addTextButton('goto\nlobby', false, 'lobby');
    this.hotbar.addTextureButton('share');

    this.hotbar.addTextButton('god\nmode', false, 'god');
    this.hotbar.onClick('god', ()=>Global.base.state.player.toggleGodMode(), false);


    // smiley button and menu
    this.createMenu('smiley', {
      items: ItemManager.smileys,
      filter: smiley => smiley.payvaultId == '',
      paddingRight: -4,
      paddingBottom: -4,
      width: (Config.smileySize-4) * 10 + 6,
      x: 2,
      y: 2,
    }, 6, 6);

    let bg = this.hotbar.addTextureButton('smiley', 'aura', 40, 40);

    this.hotbarSmiley = new Sprite(new Texture(ItemManager.smileysBMD, Global.base.state.player.smileySprite.texture.frame));
    this.hotbarSmiley.x = (30-Config.smileySize)/2;
    this.hotbarSmiley.y = (this.hotbar.height-Config.smileySize)/2;

    bg.addChild(this.hotbarSmiley);
    this.hotbar.onClick('smiley', ()=>this.showUI(this.menus['smiley']));

    // aura customisation button and menu
    this.createMenu('aura', {
      items: ItemManager.auraColours,
      paddingRight: 5,
      paddingBottom: 5,
      width: (10 + 5)*6,
      x: 5,
      y: 5,
    });
    this.hotbar.addTextureButton('aura', null, 40, 40);
    this.hotbar.onClick('aura', ()=>this.showUI(this.menus['aura']));

    // chat input
    this.createChatInput();
    this.hotbar.addTextureButton('chat', 'chaticon', 28, 28);
    this.hotbar.onClick('chat', ()=>this.showUI(this.menus['chat']));


    // edit menu and button
    this.createMenu('edit', {
      items: ItemManager.blockTabs[0],
      filter: pack => pack.payvaultId == '',
      paddingRight: 7,
      paddingBottom: 4,
      x: 7,
      y: 7,
    }, 0, 2, this.hotbar.width);

    let hotbarblocks = this.createBlockBar();
    let editBtn = this.hotbar.addTextureButton('edit', 'moreless', 43, 28, 0, false, hotbarblocks.width+43, 'right')
    editBtn.addChild(hotbarblocks);
    this.hotbar.onClick('edit', ()=>this.showUI(this.menus['edit']), true, true);


    // useless buttons but on the right
    this.hotbar.addTextureButton('map', null, 29, 28, 0, true, 31);
    this.hotbar.onClick('map', ()=>{});

    this.hotbar.addTextureButton('favlike', null, 43, 28, 0, true, 43);
    this.hotbar.addTextButton('options', true);

    this.hotbar.addTextureButton('fullscreen', null, null, null, 0, true);
    this.hotbar.onClick('fullscreen', e=>Global.fullscreen = !Global.isFullscreen);

    this.addChild(this.hotbar);


    // right sidebar panel
    this.sidebar = UI.createNineSlice('sidebar');
    this.sidebar.width = Config.fullWidth-Config.gameWidth;
    this.sidebar.height = Config.fullHeight;
    this.sidebar.x = Config.gameWidth;
    this.addChild(this.sidebar);

    this.worldName = UI.createText(Global.base.state.worldName, 'Visitor', 2);
    this.worldName.x = 4;
    this.worldName.y = 1;
    this.sidebar.addChild(this.worldName);

    this.worldInfo = UI.createText('', 'Visitor');
    this.worldInfo.tint = 0xA9A9A9;
    this.worldInfo.x = 5;
    this.worldInfo.y = 19;
    this.sidebar.addChild(this.worldInfo);

    this.userlist = new ScrollContainer(this.sidebar.width, 100);
    this.userlist.addChild(Global.base.state.player.userlistItem);
    this.sidebar.addChild(this.userlist);

    let top = this.userlist.y + 100;
    this.chat = new ScrollContainer(this.sidebar.width, this.sidebar.height - top, ChatEntry.padding/2, true, 25);
    this.chat.y = top;
    this.sidebar.addChild(this.chat);


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
      this.createJoyStick();
    }

    this.repositionMenus();
  }

  createJoyStick() {
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
    this.addChild(this.joystick);
  }

  createBlockBar() {
    let hotbarblocks = new Container();
    hotbarblocks.x = 3;

    let pack = new ItemBlockPack('level bricks', '', 0, 0, 0, true);
    this.levelBricksPack = pack;
    hotbarblocks.addChild(pack);

    let numcontainer = new Container();
    hotbarblocks.addChild(numcontainer);

    for(let i = 0; i <= 12; i++) {
      let block = ItemManager.defaultHotbarBlocks[i];
      if(!block) break;
      pack.pushBlock(block);

      if(Global.isMobile) continue;

      let blocknumtext =
      i == 0 ? '^' :
      i < 10 ? i.toString() :
      i == 10 ? '0' :
      i == 11 ? '-' :
      i == 12 ? '+'
      : '';

      let blocknum = UI.createText(blocknumtext, 'Visitor');
      blocknum.x = i * Config.blockSize + Config.blockSize - blocknum.width+3;
      blocknum.alpha = 0.5;

      numcontainer.addChild(blocknum);
    }
    pack.y = (this.hotbar.height-pack.height)/2;
    numcontainer.y = pack.y + pack.height - numcontainer.height+4;

    this.selectNthBlock(0);

    return hotbarblocks;
  }

  repositionMenus() {
    let visibleMenu;

    for(let key in this.menus) {
      let menu = this.menus[key];
      menu.y = this.hotbar.y - menu.height + 1;

      let button = this.hotbar.buttons[key];
      if(!button) continue;
      menu.x = button.x - Math.floor((menu.width - button.width)/2);
      if(menu.x < 0) menu.x = 0;
      else if(menu.x + menu.width > Config.gameWidth) menu.x = Config.gameWidth - menu.width;

      if(menu.visible) visibleMenu = menu;
    }

    if(this.joystick) {
      let offs = this.joystick.width/2 + 10;
      this.joystick.x = offs;
      if(visibleMenu && visibleMenu.x < this.joystick.x + this.joystick.width)
        this.joystick.y = visibleMenu.y - offs;
      else this.joystick.y = Config.gameHeight - offs;
    }
  }
  showUI(menuObject, visible = null, hideOthers = true) {
    if(!menuObject) return;
    if(visible == null) visible = !menuObject.visible;

    if(hideOthers) for(let key in this.menus) {
      this.showUI(this.menus[key], false, false)
    }

    menuObject.visible = visible;

    let onShow = menuObject.getAttr('onShow');
    if(onShow) onShow(visible);

    for(let key in this.menus) {
      if(this.menus[key] == menuObject) {
        this.hotbar.setButtonFrame(key, visible ? 1 : 0);
        this.repositionMenus();
        return;
      }
    }
  }

  createChatInput() {
    let menu = UI.createNineSlice('menu');
    this.menus['chat'] = menu;

    let input = new PIXI.TextInput({
      input: {
        fontFamily: 'Tahoma, "Times New Roman", Arial',
        fontSize: '12px',
        padding: '1px',
        width: '450px',
        color: 'black'
      },
      box: {fill: 0xFFFFFF, rounded: 0, stroke: {color: 0xBFBFBF, width: 1}}
    })

    let sendMsg = () => {
      this.chat.addChild(new ChatEntry('seb135', input.text));
      this.showUI(this.menus['chat'], false);
    }

    input.on('keydown', keycode => {
      if(keycode == 13) sendMsg();
    });

    let sendBtn = UI.createText('send', 'Visitor');
    UI.makeButton(sendBtn, sendMsg);

    menu.setAttr('onShow', visible => {
      Input.isGameInFocus = !visible;
      // if(visible) input.focus();
      if(!visible) {
        input.text = '';
        input.blur();
      }
    });

    menu.width = 5 + input.width + 3 + sendBtn.width + 5;
    menu.height = input.height + 10;
    input.x = input.y = 5;
    sendBtn.x = input.x + input.width + 5;
    sendBtn.y = 1+(menu.height-sendBtn.height)>>1;

    menu.addChild(input);
    menu.addChild(sendBtn);

    this.addChild(menu);

    menu.visible = false;
  }

  createMenu(name, item, addWidth = 0, addHeight = 0, setWidth = null) {
    let menu = UI.createNineSlice('menu');
    this.menus[name] = menu;

    item = Object.assign({
      items: [],
      filter: () => true,
      width: null,
      paddingRight: 0,
      paddingBottom: 0,
      x: 0,
      y: 0,
    }, item);
    if(!item.width && setWidth) item.width = setWidth - item.x;

    menu.setAttr('item', item);

    let itemContainer = new FillContainer(item.width, item.paddingRight, item.paddingBottom);
    itemContainer.x = item.x;
    itemContainer.y = item.y;

    itemContainer.addChildren(item.items);
    menu.addChild(itemContainer);

    this.addChild(menu);

    itemContainer.showChildren(item.filter);
    menu.width = (setWidth ? setWidth : itemContainer.x + itemContainer.width) + addWidth;
    menu.height = itemContainer.y + itemContainer.height + addHeight;

    menu.visible = false;
  }

  selectBlock(id) {
    //select in the old pack to hide blockSelector
    let oldPack = ItemManager.getPackFromId(this._selectedBlock);

    oldPack.selectBlock(id);
    this.levelBricksPack.selectBlock(id);

    let newPack = ItemManager.getPackFromId(id);
    if(newPack != oldPack)
      newPack.selectBlock(id);

    if(Input.isKeyJustPressed(16)) return;

    this._selectedBlock = id;
    this._tempDelete = false;
  }
  selectNthBlock(index) {
    let block = this.levelBricksPack.blockContainer.children[index];
    if(!block) return;

    this.selectBlock(block.getAttr('blockid'));
  }
  tempSelectDelete() {
    this.selectBlock(ItemManager.blockEmpty[0].id);
    this._tempDelete = true;
  }
  get selectedBlock() {return this._tempDelete ? ItemManager.blockEmpty[1].id : this._selectedBlock}


  get isMouseInGame() {
    let isMouseOnMenu = false;
    if(this.visible) for(let key in this.menus) {
      let menu = this.menus[key]
      if(!menu.visible) continue;
      if(Input.mouseY >= menu.y && Input.mouseX >= menu.x && Input.mouseX <= menu.x + menu.width) {
        isMouseOnMenu = true;
        break;
      }
    }
    return Input.mouseX <= Config.gameWidth && Input.mouseY <= Config.gameHeight
    && !isMouseOnMenu;
  }

  handleKey(e) {
    this.selectNthBlock(this.getTopRowIndex(e));
  }
  getTopRowIndex(event) {
    if(event.code == 'Backquote') return 0;
    if(event.keyCode > 48 && event.keyCode < 58) return event.keyCode-48;
    if(event.keyCode == 48) return 10;
    if(event.code == 'Minus') return 11;
    if(event.code == 'Equal') return 12;
    return null;
  }

  redrawChat(width) {
    let sideWidth = width-Config.gameWidth;
    this.sidebar.width = sideWidth;
    this.userlist.resize(sideWidth, this.userlist._height);
    this.chat.resize(sideWidth, this.chat._height);
    this.chat.scrollContainer.children.forEach(child => child.setWordWrap(sideWidth));
  }

  showInfo(title, body) {
    this.info.visible = true;

    if(this.infoBox.children.length == 0) {
      this.infoBox.addChild(UI.createText('', 'Nokia', 2));
      this.infoBox.addChild(UI.createText('', 'Nokia', 1));
    }
    let titleText = this.infoBox.children[0], bodyText = this.infoBox.children[1];

    titleText.text = title; bodyText.text = body;
    bodyText.x = titleText.x = 15;
    titleText.y = 7;
    bodyText.y = titleText.y + titleText.height;

    this.infoBox.width = Math.max(titleText.width, bodyText.width) + 30;
    this.infoBox.height = titleText.height + bodyText.height + 14;
    this.infoBox.x = Math.floor((Config.gameWidth -this.infoBox.width )/2);
    this.infoBox.y = Math.floor((Config.gameHeight-this.infoBox.height)/2);
  }
  hideInfo() {
    this.info.visible = false;
  }

  enterFrame() {
    this.updateDebugMenu();
    this.updateSidebar();
  }

  updateSidebar() {
    this.worldName.text = Global.base.state.worldName;
    this.worldInfo.text = '';
    for (const stat in Global.base.state.worldInfo) {
      this.worldInfo.text += `${stat}: ${Global.base.state.worldInfo[stat]}\n`;
    }

    this.userlist.y = this.worldInfo.y + this.worldInfo.height;

    let top = this.userlist.y + this.userlist._height;
    if(this.chat._height != this.sidebar.height - top)
      this.chat.resize(this.chat._width, this.sidebar.height - top);
    this.chat.y = top;
  }

  updateDebugMenu() {
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
    return `(${(player.x/16).toFixed(3)}, ${(player.y/16).toFixed(3)})`;
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
