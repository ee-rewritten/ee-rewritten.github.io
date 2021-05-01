class Hotbar extends PIXI.NineSlicePlane {
  buttons = {};

  constructor() {
    super(loader.resources['hotbar'].texture, 1, 1, 1, 1);
    this.width = Config.gameWidth;
    this.height = Config.fullHeight - Config.gameHeight;
    this.y = Config.gameHeight;
  }

  lastLeftX = 0;
  lastRightX = 1;
  addTextButton(text, alignRight = false, name = null, padding = 7) {
    if(!name) name = text;
    let button = UI.createNineSlice('hotbar', 1);
    let buttonText = UI.createText(text, 'Visitor', 1, 'center');

    buttonText.x = padding+1;
    buttonText.y = (button.height-buttonText.height)/2 + 2;
    button.addChild(buttonText);

    button.width = buttonText.width-2 + padding*2;
    button.height = this.height;

    button.setAttr('alignRight', alignRight);
    this.alignButton(button);

    this.addChild(button);
    this.buttons[name] = button;
    return button;
  }

  addTextureButton(name, texture, ...args) {
    let sprite;
    if(!texture) texture = name;
    if(typeof(texture) == "string")
      sprite = new Sprite(new Texture(ItemManager.baseTexture(texture)));
    else sprite = new Sprite(new Texture(texture));
    return this.addImageButton(name, sprite, ...args);
  }

  addImageButton(name, sprite, imgWidth = null, imgHeight = null, frame = 0, alignRight = false, width = 30, center = true) {
    let button = UI.createNineSlice('hotbar');
    if(imgWidth && imgHeight)
      sprite.texture.frame = new Rectangle(frame*imgWidth, 0, imgWidth, imgHeight);
    if(center) {
      sprite.x = (width-sprite.width)/2;
      sprite.y = (this.height-sprite.height)/2;
    }
    button.addChild(sprite);

    button.width = width;
    button.height = this.height;

    button.setAttr('alignRight', alignRight);
    this.alignButton(button);

    this.addChild(button);
    this.buttons[name] = button;
    return button;
  }
  setButtonFrame(name, frame) {
    let texture = this.buttons[name]?.children[0].texture;
    if(texture && texture.frame.width*(frame+1) <= texture.baseTexture.width)
      texture.frame = new Rectangle(texture.frame.width*frame, 0, texture.frame.width, texture.frame.height);
  }
  getButtonFrame(name) {
    let texture = this.buttons[name]?.children[0].texture;
    if(texture) return texture.frame.x/texture.frame.width;
  }

  showButton(name, visible) {
    let button = this.buttons[name]
    if(!button) return;

    if(button.visible != visible) {
      button.visible = visible;
      this.alignButtons(button.getAttr('alignRight'));
    }
  }

  alignButton(button) {
    if(button.getAttr('alignRight')) {
      this.lastRightX += button.width-1;
      button.x = this.width - this.lastRightX;
    } else {
      button.x = this.lastLeftX;
      this.lastLeftX += button.width-1;
    }
  }
  alignButtons(right = false) {
    if(right) this.lastRightX = 1;
    else this.lastLeftX = 0;
    for(let name in this.buttons) {
      let button = this.buttons[name];
      if(button.visible && button.getAttr('alignRight') == right) this.alignButton(button);
    }
  }

  addEventListener(name, eventName, callback, toggleFrame = true, ...args) {
    let button = this.buttons[name];
    if(!button) return;

    button.interactive = true;
    button.on(eventName, e=>{
      if(toggleFrame) this.setButtonFrame(name, 1 - this.getButtonFrame(name));
      callback(e, ...args);
    });
    button.on('pointerover', e=>document.body.style.cursor = 'pointer');
    button.on('pointerout', e=>document.body.style.cursor = '');
  }
}
