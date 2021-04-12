class UI extends PIXI.Container {
  debugText;
  fps = new Array(10);

  constructor() {
    super();
    this.drawUIRect(1, -1, Config.fullWidth-Config.gameWidth, Config.fullHeight+2, Config.gameWidth, 0, 0x000000);
    this.drawUIRect(1, 1, Config.gameWidth, Config.fullHeight-Config.gameHeight-2, 0, Config.gameHeight, 0x323231);

    this.debugText = new PIXI.Text('FPS: xx',{fill: 'white', fontSize: 12});
    this.addChild(this.debugText);
  }

  enterFrame() {
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
    this.debugText.text = fps < 1 ? `SPF: ${Math.gaussRound(1/fps,1)}` : `FPS: ${Math.gaussRound(fps,1)}`;
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
