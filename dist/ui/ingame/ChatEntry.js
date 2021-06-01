class ChatEntry extends PIXI.Text {
  static padding = 8;
  static style = {
    fill: 0x888888,
    fontSize: 9,
    fontFamily: ['Tahoma', 'Times New Roman', 'Arial'],
    wordWrap: true,
  }
  constructor(name, text) {
    text = text.replace(/\n/g, '\\n');
    super(`${name.toUpperCase()}: ${text}`, ChatEntry.style);

    this.setWordWrap(Global.base.UI?.sidebar?.width);
  }

  setWordWrap(width) {
    this.x = ChatEntry.padding;
    if(Global.base.UI) this.style.wordWrapWidth = width - ChatEntry.padding * 2;
  }
}
