class Input {
  static keys = {};
  static justPressedKeys = {};
  static justReleasedKeys = {};

  static _mouseX = 0;
  static _mouseY = 0;
  static mouseDown = false;
  static mouseJustPressed = false;

  static middleMouseDown = false;
  static middleMouseJustPressed = false;

  static isGameInFocus = false;
  static allowInput = true;

  static joystickDirection = '';

  static inited = false;
  static init() {
    if(this.inited) throw new Error('Input is already initialised.');
    window.addEventListener('keydown', e => {
      if(this.isGameInFocus && this.allowInput || e.keyCode == 122) {
        if(!this.keys[e.keyCode]) {
          this.justPressedKeys[e.keyCode] = true;
          this.keys[e.keyCode] = true;
          Global.base?.UI?.handleKey(e);
        }
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', e => {
      if(this.keys[e.keyCode] || e.keyCode == 122) {
        this.justReleasedKeys[e.keyCode] = true;
        delete this.keys[e.keyCode];
      }
    });

    window.addEventListener('pointerdown', e => {
      if(e.pointerId == Global.base?.UI?.joystickPointerId || e.buttons & 0b10) return;
      this.isGameInFocus = e.target == Global.canvas;
      if(this.isGameInFocus && this.allowInput) {
        this.mouseDown = this.mouseJustPressed = true;
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
      }
    });
    window.addEventListener('pointermove', e => {
      if(e.pointerId == Global.base?.UI?.joystickPointerId || e.buttons & 0b10) return;
      if(e.target == Global.canvas) {
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
      }
    })
    window.addEventListener('pointerup', e => {
      if(e.pointerId == Global.base?.UI?.joystickPointerId || e.buttons & 0b10) return;
      this.mouseDown = false;
      this.isGameInFocus = e.target == Global.canvas;
        if(this.isGameInFocus && this.allowInput) {
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
      }
    });
    this.inited = true;
  }

  static get mouseX() {return this._mouseX;}
  static get mouseY() {return this._mouseY;}
  static set mouseX(value) {this._mouseX = value/Global.scale;}
  static set mouseY(value) {this._mouseY = value/Global.scale;}

  static resetJustPressed() {
    this.justPressedKeys = {};
    this.justReleasedKeys = {};
    this.mouseJustPressed = false;
    this.middleMouseJustPressed = false;
  }

  static isKeyDown(keyCode, ignoreShift = false) {
    if(typeof(keyCode) == 'number')
      return !!this.keys[keyCode];
    else {
      let key = keyCode.key;
      if(!ignoreShift && this.isKeyDown(16) != key.needsShift) return false;
      return this.isKeyDown(key.keyCode);
    }
  }
  static isKeyJustPressed(keyCode, ignoreShift = false) {
    if(typeof(keyCode) == 'number')
      return !!this.justPressedKeys[keyCode];
    else {
      let key = keyCode.key;
      if(!ignoreShift && this.isKeyDown(16) != key.needsShift) return false;
      return this.isKeyJustPressed(key.keyCode);
    }
  }
  static isKeyJustReleased(keyCode, ignoreShift = false) {
    if(typeof(keyCode) == 'number')
      return !!this.justReleasedKeys[keyCode];
    else {
      let key = keyCode.key;
      if(!ignoreShift && this.isKeyDown(16) != key.needsShift) return false;
      return this.isKeyJustReleased(key.keyCode);
    }
  }

  static get isMouseDown() {
    return this.mouseDown;
  }
  static get isMouseJustPressed() {
    return this.mouseJustPressed;
  }

  static get isMiddleMouseDown() {
    return this.middleMouseDown;
  }
  static get isMiddleMouseJustPressed() {
    return this.middleMouseJustPressed;
  }



  static keyBindings = [];
  static keyBindFromId = [];

  id; name; keyDefault; keyAzerty; keyCustom; staffOnly;
  static add(id, name, keyDefault, keyAzerty = null, staffOnly = false) {
    let keybind = new Input(id, name, keyDefault, keyAzerty, staffOnly)
    this.keyBindings.push(keybind);
    this.keyBindFromId[id] = keybind;
    return keybind;
  }
  constructor(id, name, keyDefault, keyAzerty, staffOnly) {
    this.id = id;
    this.name = name;
    this.keyDefault = keyDefault;
    this.keyAzerty = keyAzerty;
    this.staffOnly = staffOnly;
  }
  get key() {
    return this.keyCustom ? this.keyCustom : false && this.keyAzerty ? this.keyAzerty : this.keyDefault;
  }
}
