class Global {
  static base;
  static app;
  static canvas;
  static stage;
  static report;
  static _isFullscreen = false;
  static scale = 1;
  static screenWidth;
  static screenHeight;

  static resize(width) {
    if(this.base && this.base.UI) this.base.UI.redrawChat(width);
    this.canvas.width = width;
    // this.canvas.height = height;
    this.app.renderer.resize(width, Config.fullHeight);
  }

  static goFullscreen() {
    this.canvas.requestFullscreen();
  }
  static set isFullscreen(value) {
    this._isFullscreen = value;

    if(value) {
      let ratio = this.screenWidth/this.screenHeight;
      this.resize(Math.floor(Config.fullHeight*ratio));
      this.scale = this.screenHeight / Config.fullHeight;
    } else {
      this.resize(Config.fullWidth);
      this.scale = 1;
    }
  }
  static get isFullscreen() {
    return this._isFullscreen;
  }

  static get scale() {
    return this.stage.scale.x;
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max+1 - min)) + min;
  }
}
