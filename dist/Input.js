class Input {
  static keys = {};
  static justPressedKeys = {};
  static justReleasedKeys = {};

  static mouseX = 0;
  static mouseY = 0;
  static mouseDown = false;
  static mouseJustPressed = false;

  static middleMouseDown = false;
  static middleMouseJustPressed = false;

  static inited = false;
  static init() {
    if(this.inited) throw new Error('Input is already initialised.');
    window.addEventListener('keydown', e => {
      if(!this.keys[e.keyCode]) {
        this.justPressedKeys[e.keyCode] = true;
        this.keys[e.keyCode] = true;
      }
      e.preventDefault();
    });
    window.addEventListener('keyup', e => {
      if(this.keys[e.keyCode]) {
        this.justReleasedKeys[e.keyCode] = true;
        delete this.keys[e.keyCode];
      }
    });

    window.addEventListener('mousedown', e => {
      this.mouseDown = this.mouseJustPressed = true;
      this.mouseX = e.offsetX;
      this.mouseY = e.offsetY;
    });
    window.addEventListener('mousemove', e => {
      this.mouseX = e.offsetX;
      this.mouseY = e.offsetY;
    })
    window.addEventListener('mouseup', e => {
      this.mouseDown = false;
      this.mouseX = e.offsetX;
      this.mouseY = e.offsetY;
    });
    this.inited = true;
  }

  static resetJustPressed() {
    this.justPressedKeys = {};
    this.justReleasedKeys = {};
    this.mouseJustPressed = false;
    this.middleMouseJustPressed = false;
  }

  static isKeyDown(keyCode) {
    return !!this.keys[keyCode];
  }
  static isKeyJustPressed(keyCode) {
    return !!this.justPressedKeys[keyCode];
  }
  static isKeyJustReleased(keyCode) {
    return !!this.justReleasedKeys[keyCode];
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
}
