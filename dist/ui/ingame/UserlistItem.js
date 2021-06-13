class UserlistItem extends Container {
  nameText;
  constructor(name, colour) {
    super();
    this.nameText = UI.createText(name, 'Visitor');
    this.nameText.x = 5;
    this.nameText.tint = colour;

    this.addChild(this.nameText);
  }

  get name() {
    return this.nameText.text;
  }
  set name(name) {
    this.nameText.text = name;
  }
}
