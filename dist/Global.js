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

  static isMobile = false;

  static resize(width) {
    if(this.base && this.base.UI) this.base.UI.redrawChat(width);
    this.canvas.width = width;
    // this.canvas.height = height;
    this.app.renderer.resize(width, Config.fullHeight);
  }

  static rotate() {
    Input.allowInput = true;
    let nothing = () => {};
    screen.orientation.lock('landscape').then(nothing, nothing);
  }
  static set fullscreen(bool) {
    Input.allowInput = false;
    if(bool) {
      if (this.canvas.requestFullscreen) {
        this.canvas.requestFullscreen().then(this.rotate);
      } else if (this.canvas.webkitRequestFullscreen) { /* Safari */
        this.canvas.webkitRequestFullscreen().then(this.rotate);
      } else if (this.canvas.msRequestFullscreen) { /* IE11 */
        this.canvas.msRequestFullscreen().then(this.rotate);
      }
    }
    else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }
  }

  static set isFullscreen(value) {
    this._isFullscreen = value;

    if(value) {
      var orientation = (screen.orientation || {}).type || screen.mozOrientation || screen.msOrientation;
      if(this.isMobile && orientation.includes('landscape')) {
        this.screenWidth = window.screen.width;
        this.screenHeight = window.screen.height;
      }
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
