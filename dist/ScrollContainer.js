class ScrollContainer extends PIXI.Container {
  _mask; _width; _height; scrollToBottom; maxChildren;
  constructor(width, height, padding = 0, scrollToBottom = false, maxChildren = null) {
    super();
    this.padding = padding;
    this.scrollToBottom = scrollToBottom;
    this.maxChildren = maxChildren;

    this.scrollContainer = new Container();
    this.scrollContainer.sortableChildren = true;
    super.addChild(this.scrollContainer);

    this.resize(width, height);
  }

  addChild(child) {
    child.y = this.scrollContainer.height;
    if(this.scrollContainer.children.length) child.y += this.padding;
    this.scrollContainer.addChild(child);

    if(this.scrollContainer.height >= this._height && this.scrollToBottom)
      this.scrollContainer.y = this._height - this.scrollContainer.height - this.padding;

    if(this.maxChildren && this.scrollContainer.children.length > this.maxChildren) {
      this.scrollContainer.y = 0;
      this.scrollContainer.children.shift();
      this.sort();
    }
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
    this._width = width; this._height = height;

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
