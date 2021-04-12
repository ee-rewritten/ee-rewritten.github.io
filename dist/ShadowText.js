class ShadowText extends PIXI.Container {
  bmtext;
  bmshadows = new Array(3);
  blurfilter;

  constructor(text, style) {
    super();
    this.bmtext = new BMText(text, style, blur = 2);

    this.blurfilter = new BlurFilter();
    this.blurfilter.blur = blur;

    for (let i = 0; i < this.bmshadows.length; i++) {
      this.bmshadows[i] = new BMText(text, style);
      this.bmshadows[i].tint = 0;
      this.bmshadows[i].filters = [this.blurfilter];
      this.addChild(this.bmshadows[i]);
    }

    this.addChild(this.bmtext);
  }

  set text(value) {
    for (let i = 0; i < this.bmshadows.length; i++) this.bmshadows[i].text = value;
    this.bmtext.text = value;
  }

  set blur(value) {
    this.blurfilter.blur = value;
  }

  set(prop, value) {
    for (let i = 0; i < this.bmshadows.length; i++) this.bmshadows[i][prop] = value;
    this.bmtext[prop] = value;
  }
}
