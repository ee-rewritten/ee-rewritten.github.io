class Global {
  static base;

  static app;
  static canvas;
  static stage;

  static report;

  static _isFullscreen = false;
  static scale = 1;

  static isMobile = false;

  static lastFrameTime = 0;
  static thisFrameTime = 0;

  static set fullscreen(bool) {
    if(bool) this.goFullscreen();
    else this.leaveFullscreen();
  }
  static get fullscreen() {
    return this._isFullscreen;
  }

  static goFullscreen() {
    Input.allowInput = false;
    this._isFullscreen = true;

    let onFullscreen = () => {
      let resize = () => setTimeout(() => {
        this.resize(screen.width/screen.height * Config.fullHeight);
        this.scale = screen.height / Config.fullHeight;
      }, 1000/60);
      screen.orientation.lock('landscape').then(resize, resize);
      Input.allowInput = true;
    }
    let allowInput = () => Input.allowInput = true;

    if (this.canvas.requestFullscreen)
      this.canvas.requestFullscreen().then(onFullscreen, allowInput);
    else if (this.canvas.webkitRequestFullscreen)
      this.canvas.webkitRequestFullscreen().then(onFullscreen, allowInput); /* Safari */
    else if (this.canvas.msRequestFullscreen)
      this.canvas.msRequestFullscreen().then(onFullscreen, allowInput); /* IE11 */
  }

  static leaveFullscreen() {
    Input.allowInput = false;
    this._isFullscreen = false;

    let onExit = () => {
      this.resize(Config.fullWidth);
      this.scale = 1;
      Input.allowInput = true;
    }

    if (document.exitFullscreen)
      document.exitFullscreen().then(onExit, onExit);
    else if (document.webkitExitFullscreen)
      document.webkitExitFullscreen().then(onExit, onExit); /* Safari */
    else if (document.msExitFullscreen)
      document.msExitFullscreen().then(onExit, onExit); /* IE11 */
  }

  static resize(width) {
    this.base.UI.redrawChat(width);
    this.canvas.width = width;
    this.app.renderer.resize(width, Config.fullHeight);
  }

  static get scale() {
    return this.stage.scale.x;
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max+1 - min)) + min;
  }
}
