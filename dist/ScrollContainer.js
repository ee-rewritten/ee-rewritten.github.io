class ScrollContainer extends PIXI.Container {
  _mask;
  constructor(width, height) {
    super();
    this.scrollContainer = new Container();
    this.scrollContainer.sortableChildren = true;
    super.addChild(this.scrollContainer);

    this.resize(width, height);
  }

  addChild(child) {
    child.y = this.scrollContainer.height;
    this.scrollContainer.addChild(child);
  }
  removeChild(child) {
    this.scrollContainer.removeChild(child);
    this.sort();
  }
  sort() {
    this.scrollContainer.sortChildren();
    let children = [...this.scrollContainer.children];
    this.scrollContainer.removeChildren();
    children.forEach(child => this.addChild(child));
  }

  resize(width, height) {
    super.removeChild(this._mask);

    this._mask = new Graphics();
    this._mask
      .beginFill(0xFFFFFF)
      .drawRect(0, 0, width, height)
      .endFill();
    super.addChild(this._mask);
    this.scrollContainer.mask = this._mask;
  }
}
