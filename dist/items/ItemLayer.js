class ItemLayer {
  //unlike EE's 4 render layers, I have 3 and a true/false flag for transparency

  //render:
  static BACKGROUND = 0;
  static BELOW = 1;
  static ABOVE = 2;

  //physics:
  static BG = 1;
  static FG = 0;

  //players:
  static PLAYER_LAYERS = [1.5, 2.5];
  static SOCIAL_LAYERS = [2.25, 3.25];

  //converting from physics to render layers and vice versa
  static NUM_LAYERS = 3;
  static BLAYER_TO_RLAYER = [[this.BELOW, this.ABOVE], [this.BACKGROUND]];
  static RLAYER_TO_BLAYER = [1, 0, 0];
}
Object.freeze(ItemLayer);
