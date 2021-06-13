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
    if(bool == this.fullscreen) return;
    if(bool) this.goFullscreen();
    else this.leaveFullscreen();
  }
  static get fullscreen() {
    return this._isFullscreen;
  }

  static goFullscreen() {
    Input.allowInput = false;
    this._isFullscreen = true;

    document.getElementById('ee').requestFullscreen().then(
      () => {
        let resize = () => setTimeout(() => {
          this.resize(screen.width, screen.height);
        }, 1000/60);
        screen.orientation.lock('landscape').then(resize, resize);
        Input.allowInput = true;
      },

      //fullscreen failed, return input to player
      () => Input.allowInput = true);
  }

  static leaveFullscreen() {
    Input.allowInput = false;
    this._isFullscreen = false;

    let onExit = () => {
      this.resize(Config.fullWidth, Config.fullHeight);
      Input.allowInput = true;
    }

    document.exitFullscreen().then(onExit, onExit);
  }

  static resize(width, height) {
    this.base.UI.redrawChat(width/height * Config.fullHeight);
    this.app.renderer.resize(width, height);

    this.scale = height / Config.fullHeight;
    this.stage.scale.set(height / Config.fullHeight);
  }

  static get scale() {
    return this.stage.scale.x;
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max+1 - min)) + min;
  }
}
