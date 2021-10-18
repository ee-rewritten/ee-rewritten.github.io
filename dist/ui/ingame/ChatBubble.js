class ChatBubble extends Container {
  static paddingTop = 6;
  static paddingBottom = 2;
  static paddingLeft = 7;
  static paddingRight = 4;

  static style = {
    tint: 0x000000,
    fontSize: 12,
    fontName: 'Tahoma',
    maxWidth: 100,
    align: 'center',
  }

  constructor(text) {
    super();
    let bottom = new Sprite(new Texture(ItemManager.baseTexture('chatbubble_bottom')))
    let bubble = UI.createNineSlice('chatbubble', 8);
    let txt = new BMText(text, ChatBubble.style);
    bubble.addChild(txt);
    this.addChild(bubble, bottom);

    bubble.width = txt.width + ChatBubble.paddingLeft + ChatBubble.paddingRight;
    bubble.height = txt.height + ChatBubble.paddingTop + ChatBubble.paddingBottom;
    txt.x = ChatBubble.paddingLeft;
    txt.y = ChatBubble.paddingTop;

    bubble.x = -bubble.width/2+4;
    bubble.y = -bubble.height+2;

    this.x = Config.blockSize-1;
    this.y = -2;
  }
}
