let debug = [];
let text;

class Game {
  _state;
  set state(newState) {
    if(this._state) this._state.stop();
    this._state = newState;
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
      //negative margin hack because pixi's canvas is 5px taller than specified and I can't fix it
      Global.canvas.style.marginBottom = "-5px";
      document.getElementById('ee').appendChild(Global.canvas);
    }

    //moved loading images into ItemManager because that just makes sense
    //provides the below init function as a callback, to initiate the rest of the game
    ItemManager.loadImages(this.init);
  }

  //This `init` function will run when the image has loaded
  init() {
    ItemManager.init();
    Input.init();
    Global.base.state = new PlayState();
    new UI();
    ticker.add(Global.base.enterFrame);
    ticker.start();
  }

  enterFrame() {
    text.text = `FPS: ${Math.round(ticker.FPS)}`;
    if(Global.base.state != null && !Global.base.state.stoppedRendering) {
      let ticks = ticker.elapsedMS/Config.physics_ms_per_tick;
      for (let i = 0; i < ticks; i++) {
        Global.base.state.tick();
      }
      Global.base.state.enterFrame();
    }
    Input.resetJustPressed();
  }
}
