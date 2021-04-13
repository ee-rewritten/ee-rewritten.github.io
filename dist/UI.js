class UI extends PIXI.Container {
  debugText;
  fps = new Array(10);
  report = {};

  constructor() {
    super();
    Global.report = this.report;

    this.drawUIRect(1, -1, Config.fullWidth-Config.gameWidth, Config.fullHeight+2, Config.gameWidth, 0, 0x000000);
    this.drawUIRect(1, 0, Config.gameWidth, Config.fullHeight-Config.gameHeight-1, 0, Config.gameHeight, 0x323231);

    // this.debugText = new Text('FPS: xx',{fill: 'white', fontSize: 12});
    // this.debugText = new BMText('FPS: xx',{fontName: 'Nokia', fontSize:13});
    this.debugText = new ShadowText('FPS: xx',{fontName: 'Nokia', fontSize:13});
    this.debugText.x = 5;
    this.addChild(this.debugText);

    this.report.Ping = 'xx';
    this.report.FPS = 'xx';
    this.report.Position = 'xx';
    this.report.Time = 'xx';
  }

  enterFrame() {
    let player = Global.base.state.player;
    this.debugText.text = `Everybody Edits: Rewritten (vAlpha)`
    this.report.Ping = 'xx';
    this.report.FPS = this.getFPSText();
    this.report.Position = this.getPosText(player)
    this.report.Time = (player.ticks * Config.physics.ms_per_tick/1000).toFixed(2) + 's';
    for (const property in this.report) {
      this.debugText.text += `\n${property}: ${this.report[property]}`;
    }
  }

  getFPSText() {
    //overengineered fps counter let's go
    let fps;
    if(fps < 1) fps = ticker.FPS;
    else {
      this.fps.shift();
      this.fps.push(ticker.FPS);
      fps = this.fps.reduce((a,b) => a+b)/this.fps.length;
      let diff = Math.abs(ticker.FPS-fps);

      if(diff > 5)
        for(let i; i < this.fps.length/2; i++) {
          this.fps.shift();
          this.fps.push(ticker.FPS);
        }
    }
    return fps < 1 ? `SPF: ${(1/fps).toFixed(1)}` : `${fps.toFixed(1)}`
  }
  getPosText(player) {
    return `(${player.x.toFixed(3)}, ${player.y.toFixed(3)})`
  }

  drawUIRect(localx, localy, width, height, x, y, colour) {
    let rect = new Graphics();
    rect.beginFill(colour);
    rect.lineStyle(1, 0x7B7B7B);
    rect.drawRect(localx, localy, width, height);
    rect.x = x;
    rect.y = y;
    rect.endFill();
    // rect.alpha = 0.5;
    this.addChild(rect);
  }
}
