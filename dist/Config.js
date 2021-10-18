class Config {
  static blockSize = 16;
  static smileySize = 26;
  static godmodeSize = 64;
  static blockPadding = 1;

  static fontVisitorSize = 8;
  static fontNokiaSize = 13;

  static smileyRows = 2;

  static fullWidth = 850;
  static fullHeight = 500;

  static gameWidth = 640;
  static gameHeight = 470;

  //game width&height rounded up to the next multiple of block size
  //prevents glitchy offsets when moving blocks in the game container
  static gameWidthCeil = Config.blockSize*Math.ceil(Config.gameWidth/Config.blockSize);
  static gameHeightCeil = Config.blockSize*Math.ceil(Config.gameHeight/Config.blockSize);

  static camera_lag = 1/16;

  static physics = {
    ms_per_tick: 10,
    max_ticks_per_frame: 150,
    variable_multiplyer: 7.752,

    base_drag: Math.pow(.9981, 10) * 1.00016093,
    ice_no_mod_drag: Math.pow(.9993, 10) * 1.00016093,
    ice_drag: Math.pow(.9998, 10) * 1.00016093,
    //Multiplyer when not applying force by userkeys
    no_modifier_drag: Math.pow(.9900, 10) * 1.00016093,
    climbable_drag: Math.pow(.9900, 10) * 1.00016093,
    water_drag: Math.pow(.9950, 10) * 1.00016093,
    mud_drag: Math.pow(.9750, 10) * 1.00016093,
    lava_drag: Math.pow(.9800, 10) * 1.00016093,
    toxic_drag: Math.pow(.9900, 10) * 1.00016093,
    jump_height: 26,

    autoalign_range: 2,
    autoalign_snap_range: 0.2,

    gravity: 2,
    boost: 16,
    water_buoyancy: -.5,
    mud_buoyancy: .4,
    lava_buoyancy: .2,
    toxic_buoyancy: -.4,
  }
}
Object.freeze(Config.physics);
Object.freeze(Config);
