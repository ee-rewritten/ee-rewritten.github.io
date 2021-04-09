class UI {
  overlayContainer;

  constructor() {
    this.overlayContainer = new Container();

    this.drawUIRect(1, -1, Config.fullWidth-Config.gameWidth, Config.fullHeight+2, Config.gameWidth, 0, 0x000000);
    this.drawUIRect(1, 1, Config.gameWidth, Config.fullHeight-Config.gameHeight-2, 0, Config.gameHeight, 0x323231);

    Global.stage.addChild(this.overlayContainer);
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
    this.overlayContainer.addChild(rect);
  }
}
