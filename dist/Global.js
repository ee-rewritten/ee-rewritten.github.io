class Global {
  static base;
  static app;
  static canvas;
  static stage;
  
  static randomInt(min, max) {
    return Math.floor(Math.random() * (max+1 - min)) + min;
  }
}
