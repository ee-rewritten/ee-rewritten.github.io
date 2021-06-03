class ItemAuraColour extends PIXI.Sprite {
  static colours = {
    white:    0xFFFFFF,
    red:      0xFF0000,
    blue:     0x0080FF,
    yellow:   0xFFD400,
    green:    0x13D213,
    purple:   0xAA00FF,
    orange:   0xFF5500,
    cyan:     0x00FFFF,
		// gold:     0xFFD700,
		pink:     0xFF80C0,
		indigo:   0x0000FF,
		lime:     0xAAFF00,
		black:    0x000000,
		teal:     0x89E9B9,
		grey:     0x7F7F7F,
		amaranth: 0xFF0047,
  }

  id; payvaultId;
  constructor(id, colour, payvaultId) {
    let dot = ItemManager.baseTexture('aurabutton');
    let overlay = ItemManager.baseTexture('aurabutton_overlay');
    let frame = new Rectangle(0,0,dot.width,dot.height);

    super(new Texture(dot, frame));
    let overlaySprite = new Sprite(new Texture(overlay, frame));
    this.addChild(overlaySprite);

    this.id = id; this.tint = colour; this.payvaultId = payvaultId;

    UI.makeButton(this, e => {
      Global.base.state.player.godmodeSprite.tint = e.target.tint;
    });
  }
}
