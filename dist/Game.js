let debug = [];

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
      Global.canvas.style.marginBottom = "-5px";
      document.getElementById('ee').appendChild(Global.canvas);
    }

    //load an image and run the `setup` function when it's done
    loader
      .add('blocks', './Assets/blocks.png')
      .add('smileys', './Assets/smileys.png')
      .load(this.setup);
  }

  //This `setup` function will run when the image has loaded
  setup() {
    Input.init();
    ItemManager.init();
    Global.base.state = new PlayState();
    new UI();
    ticker.add(Global.base.enterFrame);
    ticker.start();
  }

  enterFrame() {
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
