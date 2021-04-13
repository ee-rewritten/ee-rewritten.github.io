class Game {
  UI;
  _state;
  set state(newState) {
    if(this._state) {
      this._state.stop();
      Global.stage.removeChild(this._state);
    }
    this._state = newState;
    this._state.zIndex = 0;
    Global.stage.addChild(this.state);
  }
  get state() {
    return this._state;
  }

  constructor() {
    //Create a Pixi Application
    Global.app = new PIXI.Application({width: Config.fullWidth, height: Config.fullHeight});
    Global.canvas = Global.app.view;
    Global.stage = Global.app.stage;

    //Add the canvas that Pixi automatically created for you to the HTML document
    window.onload = () => {
      Global.screenWidth = window.screen.width;
      Global.screenHeight = window.screen.height;
      //negative margin hack because pixi's canvas is 5px taller than specified and I can't fix it
      Global.canvas.style.marginBottom = "-5px";
      document.getElementById('ee').appendChild(Global.canvas);
      document.addEventListener('fullscreenchange', () => {
        Global.isFullscreen = (document.fullscreenElement != null);
      });
    }

    //moved loading assets into ItemManager because that just makes sense
    //provides the below init function as a callback, to initiate the rest of the game
    ItemManager.loadAssets(this.init);
  }

  //This `init` function will run when the image has loaded
  init() {
    ItemManager.init();
    Input.init();

    Global.stage.sortableChildren = true;

    Global.base.state = new PlayState(100, 100, 2);

    Global.base.UI = new UI();
    Global.base.UI.zIndex = 1;
    Global.stage.addChild(Global.base.UI);

    Global.stage.sortChildren();

    ticker.add(Global.base.enterFrame);
    ticker.start();
  }

  enterFrame() {
    if(Global.base.state != null && !Global.base.state.stoppedRendering) {
      let ticks = ticker.elapsedMS/Config.physics.ms_per_tick;
      for (let i = 0; i < ticks; i++) {
        Global.base.state.tick();
        Input.resetJustPressed();
      }
      Global.base.state.enterFrame();
      Global.base.UI.enterFrame();
    }
  }
}
