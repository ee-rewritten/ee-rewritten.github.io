class Config {
  static blockSize = 16;
  static smileySize = 26;

  static fullWidth = 850;
  static fullHeight = 500;

  static gameWidth = 640;
  static gameHeight = 470;

  //game width&height rounded up to the next multiple of block size
  //prevents glitchy offsets when moving blocks in the game container
  static gameWidthCeil = Config.blockSize*Math.ceil(this.gameWidth/Config.blockSize);
  static gameHeightCeil = Config.blockSize*Math.ceil(this.gameHeight/Config.blockSize);

  static camera_lag = 1/16;

  static physics_ms_per_tick = 10;
}
Object.freeze(Config);
