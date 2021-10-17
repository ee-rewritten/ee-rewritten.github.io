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
    window.onload = () => {
      //Create a Pixi Application
      Global.app = new PIXI.Application({width: Config.fullWidth, height: Config.fullHeight});
      Global.canvas = Global.app.view;
      Global.stage = Global.app.stage;

      //https://github.com/pixijs/pixi.js/issues/7407#issuecomment-820444887
      const interaction = Global.app.renderer.plugins.interaction;
      interaction.removeEvents();
      interaction.supportsTouchEvents = !interaction.supportsPointerEvents && 'ontouchstart' in window;
      interaction.interactionDOMElement = Global.app.view;
      interaction.addEvents();

      //negative margin hack because pixi's canvas is 5px taller than specified and I can't fix it
      Global.canvas.style.marginBottom = "-5px";
      //Add the canvas that Pixi automatically created for you to the HTML document
      document.getElementById('ee').appendChild(Global.canvas);
    }

    //moved adding assets into ItemManager because that just makes sense
    //as well as other relevant scripts - UI images in UI
    ItemManager.loadAssets();
    UI.loadAssets();

    loader
      .add('Nokia', './Assets/fonts/Nokia.fnt')
      .add('Visitor', './Assets/fonts/Visitor.fnt')
      .add('Tahoma', './Assets/fonts/Tahoma.fnt')
      .load(this.init);
  }

  //This `init` function will run when the image has loaded
  init() {
    Global.isMobile = mobileCheck();

    ItemManager.init();
    Input.init();

    Global.stage.sortableChildren = true;

    Global.base.state = new PlayState(400, 200, 2, 'Untitled World', {by: 'unknown', plays: 1, favorites: 0, likes: 0});

    Global.base.UI = new UI();
    Global.base.UI.zIndex = 1;
    Global.stage.addChild(Global.base.UI);

    console.log(localStorage.getItem('fullscreen'), !!localStorage.getItem('fullscreen'));
    Global.fullscreen = localStorage.getItem('fullscreen') == '1';

    Global.base.time = performance.now();
    //setInterval(Global.base.enterFrame, 1000/60);
    requestAnimationFrame(Global.base.enterFrame);
  }

  time = 0;
  enterFrame() {
    if(Global.base.state != null && !Global.base.state.stoppedRendering) {
      let now = performance.now();
      Global.lastFrameTime = Global.thisFrameTime;
      Global.thisFrameTime = now;

      // limits ticks to max_ticks_per_frame so as to not lag out already laggy players
      if((now - Global.base.time) / Config.physics.ms_per_tick > Config.physics.max_ticks_per_frame) {
        Global.base.time = now - Config.physics.ms_per_tick * Config.physics.max_ticks_per_frame;
      }

      while(Global.base.time < now) {
        Global.base.time += Config.physics.ms_per_tick;

        Global.base.state.tick();
        Input.resetJustPressed();

        while(Global.queue.length)
          Global.queue.shift()();
      }
      Global.base.state.enterFrame();
      Global.base.UI.enterFrame();

      requestAnimationFrame(Global.base.enterFrame);
    }
  }
}
