class Global {
  static base;

  static app;
  static canvas;
  static stage;

  static report;

  static _isFullscreen = false;
  static _enterFullscreen = () => {Global.resize(window.innerWidth, window.innerHeight)}
  static scale = 1;

  static isMobile = false;

  static lastFrameTime = 0;
  static thisFrameTime = 0;

  static queue = [];

  static set fullscreen (bool) {
    this._isFullscreen = bool;

    let style = this.canvas.style;
    if(bool) {
      style.position = 'absolute';
      style.top = '0px';
      style.left = '0px';
      window.onresize = this._enterFullscreen;
      this.resize(window.innerWidth, window.innerHeight);
    }
    else {
      style.position = style.top = style.left = '';
      window.onresize = null;
      this.resize(Config.fullWidth, Config.fullHeight);
    }
  }
  static get fullscreen () {
    return this._isFullscreen;
  }

  static resize(width, height) {
    this.app.renderer.resize(width/height * Config.fullHeight, Config.fullHeight);

    // https://stackoverflow.com/a/50915858
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;

    this.scale = height/Config.fullHeight;

    this.base.UI.redrawChat(width/height * Config.fullHeight);
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max+1 - min)) + min;
  }
}
