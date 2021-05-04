class ShadowText extends PIXI.Container {
  bmtext;
  bmshadows;
  blurfilter;

  constructor(text, style, blur = 2, amount = 3, shadowColour = 0) {
    super();
    this.bmtext = new BMText(text, style);

    this.blurfilter = new BlurFilter(blur, 5);

    this.bmshadows = new Array(amount);
    for (let i = 0; i < this.bmshadows.length; i++) {
      this.bmshadows[i] = new BMText(text, style);
      this.bmshadows[i].tint = shadowColour;
      this.bmshadows[i].filters = [this.blurfilter];
      this.addChild(this.bmshadows[i]);
    }

    this.addChild(this.bmtext);
  }

  set text(value) {
    for (let i = 0; i < this.bmshadows.length; i++) this.bmshadows[i].text = value;
    this.bmtext.text = value;
  }
  get text() {
    return this.bmtext.text;
  }

  set blur(value) {
    this.blurfilter.blur = value;
  }

  set(prop, value, shadowOnly = false) {
    for (let i = 0; i < this.bmshadows.length; i++) this.bmshadows[i][prop] = value;
    if(!shadowOnly) this.bmtext[prop] = value;
  }
  get(prop) {
    return this.bmtext[prop];
  }
}
