class FillContainer extends PIXI.Container {
  maxWidth; paddingRight; paddingBottom;
  constructor(maxWidth, paddingRight = 0, paddingBottom = 0) {
    super();
    this.maxWidth = maxWidth;
    this.paddingRight = paddingRight;
    this.paddingBottom = paddingBottom;
  }

  addChildren(childArray) {
    childArray.forEach(child => {
      child.visible = false;
      this.addChild(child);
    });
  }

  showChildren(filter = null) {
    if(filter == null) filter = () => true;

    let usedX = 0, usedY = 0;

    this.children.forEach(child => {
      if(!filter(child)) {
        child.visible = false;
        return;
      }
      child.visible = true;

      if(usedX + child.width > this.maxWidth) {
        usedX = 0;
        usedY += child.height + this.paddingBottom;
      }

      child.x = usedX; child.y = usedY;
      usedX += child.width + this.paddingRight;
    });
  }

  get height() {
    return super.height + this.paddingBottom;
  }
  get width() {
    return super.width + this.paddingRight;
  }
}
