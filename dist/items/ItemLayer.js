class ItemLayer {
  //unlike EE's 4 layers, I have 3 and a true/false flag for transparency
  static BELOW = 0;
  static ABOVE = 1;
  static BACKGROUND = 2;

  static LAYERS = 3;
}
Object.freeze(ItemLayer);
