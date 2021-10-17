class ChatEntry extends BMText {
  static padding = 8;
  // static style = {
  //   fill: 0x888888,
  //   fontSize: 8,
  //   fontFamily: ['Tahoma', 'Times New Roman', 'Arial'],
  //   wordWrap: true,
  //   breakWords: true,
  // }
  static style = {
    tint: 0x888888,
    fontSize: 12,
    fontName: 'Tahoma',
  }
  // static linkRegex = /([a-zA-Z0-9.\-/]+\.[A-Za-z]{2,4})/g;
  //https://stackoverflow.com/a/6927878
  static linkRegex = /\b((?:(https?:\/\/)|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/g;
  constructor(name, text) {
    text = text.replace(/\n/g, '\\n');
    super(name.toUpperCase(), ChatEntry.style);
    this.tint = Player.getNameColour(name);

    this.txt = new BMText(`${name.toUpperCase()}: ${text}`, ChatEntry.style);
    this.addChild(this.txt);

    UI.makeButton(this.txt, () => navigator.clipboard?.writeText(text));

    this.setWordWrap(Global.base.UI?.sidebar?.width);

    let links = text.match(ChatEntry.linkRegex);
    if(links) links.forEach(link => {
      if(this.children.length >= 5) return;

      if(this.txt.text.charAt(this.txt.text.indexOf(link)-1) == '\\') {
        this.txt.text = this.txt.text.replace('\\' + link, link);
        return;
      }

      if(!link.startsWith('https://') && !link.startsWith('http://'))
        link = `https://${link}`;
      let linkTxt = new BMText(link, ChatEntry.style);
      linkTxt.tint = 0x3366BB;
      linkTxt.x += ChatEntry.padding;
      linkTxt.y = this.height;
      this.addChild(linkTxt);

      UI.makeButton(linkTxt, () => window.open(link, '_blank'));
    });
  }

  setWordWrap(width) {
    this.x = ChatEntry.padding;
    if(Global.base.UI) this.maxWidth = this.txt.maxWidth = width - ChatEntry.padding * 2;
    this.dirty=true;
  }
}
