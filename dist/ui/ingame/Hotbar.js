class Hotbar extends NineSlice {
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
    let buttonText = UI.createShadowText(text, 'Visitor', 1, 'center', 2, 1, 0xFFFFFF);
    buttonText.set('visible', false, true);

    buttonText.x = padding+1;
    buttonText.y = (this.height-buttonText.height)/2 + 2;
    button.addChild(buttonText);

    button.width = buttonText.width-2 + padding*2;
    button.height = this.height;

    button.setAttr('alignRight', alignRight);
    this.alignButton(button);

    this.addChild(button);
    this.buttons[name] = button;
    return button;
  }
  setTextGlow(name, glowing = null) {
    let button = this.buttons[name];
    if(!button) return;

    if(glowing == null) glowing = !button.getAttr('glowing');
    button.setAttr('glowing', glowing);

    button.children[0].set('visible', glowing, true);
  }

  addTextureButton(name, texture, ...args) {
    let sprite;
    if(!texture) texture = name;
    if(typeof(texture) == "string")
      sprite = new Sprite(new Texture(ItemManager.baseTexture(texture)));
    else sprite = new Sprite(new Texture(texture));
    return this.addImageButton(name, sprite, ...args);
  }

  addImageButton(name, sprite, imgWidth = null, imgHeight = null, frame = 0, alignRight = false, width = 30, align = 'center') {
    let button = UI.createNineSlice('hotbar');
    if(imgWidth && imgHeight)
      sprite.texture.frame = this.createFrame(imgWidth, imgHeight, width, this.height, frame);

    button.setAttr('frameWidth',  imgWidth);
    button.setAttr('frameHeight', imgHeight);

    if(align == 'center') {
      sprite.x = (width-sprite.width)/2;
      sprite.y = (this.height-sprite.height)/2;
    }
    else if(align == 'right') {
      sprite.x = width-sprite.width;
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
    let button = this.buttons[name];
    let texture = button?.children[0].texture;
    if(texture && texture.frame.width*(frame+1) <= texture.baseTexture.width)
      texture.frame = this.createFrame(button.getAttr('frameWidth'), button.getAttr('frameHeight'), button.width, button.height, frame);
  }
  getButtonFrame(name) {
    let button = this.buttons[name];
    let texture = button?.children[0].texture;
    if(texture)
      return Math.floor(texture.frame.x/texture.frame.width);
  }

  createFrame(imgWidth, imgHeight, maxWidth, maxHeight, frame) {
    let x = frame*imgWidth, y = 0;
    return new Rectangle(
      imgWidth  <= maxWidth  ? x : x + (imgWidth -maxWidth)/2,    //x
      imgHeight <= maxHeight ? y : y + (imgHeight-maxHeight)/2,   //y

      imgWidth  <= maxWidth  ? imgWidth  : maxWidth,              //width
      imgHeight <= maxHeight ? imgHeight : maxHeight);            //height
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

  onClick(name, callback, toggleFrame = true, childOnly = false, ...args) {
    let button = this.buttons[name]
    if(!button) return;
    if(childOnly) button = button.children[0];

    UI.makeButton(button, (...rest) => {
      if(toggleFrame) this.toggleButtonFrame(name);
      callback(...rest)
    }, ...args);
  }
  toggleButtonFrame(name) {
    this.setButtonFrame(name, 1 - this.getButtonFrame(name));
  }
}
