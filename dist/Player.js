class Player extends PIXI.Container {
  nameText;
  smileySprite;
  _smileyRow = 0;
  _smiley = 0;
  godmodeSprite;

  isme = false;
  name = '';
  playstate;
  x = 0; y = 0;

  _isInGodMode = false;
  _layer = null;

  speedX = 0; speedY = 0;
  horizontal = 0; vertical = 0; isSpaceDown = false; isSpaceJustPressed = false;
  lastJump = -1; jumpCount = 0; maxJumps = 1;
  lastMoved = -1;

  ticks = 0;

  static smileyOffset = Math.round(-(Config.smileySize-Config.blockSize)/2);
  static godmodeOffset = Math.round(-(Config.godmodeSize-Config.smileySize)/2) + this.smileyOffset;

  constructor(playstate, isme, name, x, y) {
    super();
    this.isme = isme;
    this.playstate = playstate;
    this.name = name;
    this.x = x;
    this.y = y;

    let godmodeTexture = new Texture(ItemManager.godmodeBMD, new Rectangle(Config.godmodeSize,0,Config.godmodeSize,Config.godmodeSize));
    this.godmodeSprite = new Sprite(godmodeTexture);
    this.addChild(this.godmodeSprite);

    let smileyTexture = new Texture(ItemManager.smileysBMD, new Rectangle(0,0,Config.smileySize,Config.smileySize));
    this.smileySprite = new Sprite(smileyTexture);
    this.addChild(this.smileySprite);

    this.nameText = UI.createShadowText(name, 'Visitor');

    this.toggleGodMode(false);
    this.enterFrame();
  }

  set smiley(id) {
    if(!ItemManager.smileys[id]) return;

    this._smiley = id;
    let frame = ItemManager.smileys[id].getFrame(this.smileyRow);

    this.smileySprite.texture.frame = frame;
    if(Global.base.UI) Global.base.UI.hotbarSmiley.texture.frame = frame;
  }
  get smiley() {
    return this._smiley;
  }
  set smileyRow(row) {
    if(row >= 0 && row < Config.smileyRows) {
      this._smileyRow = row;
      this.smiley = this.smiley;
    }
  }
  get smileyRow() {
    return this._smileyRow;
  }

  toggleGodMode(bool = null) {
    if(bool == null ) bool = !this.isInGodMode;
    this._isInGodMode = bool;
    this.godmodeSprite.visible = bool;
    this.playstate.movePlayer(this); //moves into a different container for rendering
    Global.base.UI?.hotbar.setTextGlow('god', bool);
  }
  get isInGodMode() {
    return this._isInGodMode;
  }

  enterFrame() {
    this.smileySprite.position.set(
      Math.round(this.x+Player.smileyOffset),
      Math.round(this.y+Player.smileyOffset));
    this.godmodeSprite.position.set(
      Math.round(this.x+Player.godmodeOffset),
      Math.round(this.y+Player.godmodeOffset));
    this.nameText.position.set(
      Math.round(this.x+Config.blockSize/2-this.nameText.get('width')/2 + 2),
      Math.round(this.y+Config.blockSize+2));
    if(this.playstate.target)
      this.nameText.visible = !this.playstate.target.moving || Input.isKeyDown(16);
  }

  tick() {
    if(this.isme) {
        this.horizontal =
          (Input.joystickDirection.includes('right') || Input.isKeyDown(39) || Input.isKeyDown(Key.right, true))
         -(Input.joystickDirection.includes('left')  || Input.isKeyDown(37) || Input.isKeyDown(Key.left, true));
        this.vertical =
          (Input.joystickDirection.includes('bottom')|| Input.isKeyDown(40) || Input.isKeyDown(Key.down, true))
         -(Input.joystickDirection.includes('top')   || Input.isKeyDown(38) || Input.isKeyDown(Key.up, true));
        this.isSpaceDown = Input.isKeyDown(Key.jump, true);
        this.isSpaceJustPressed = Input.isKeyJustPressed(Key.jump, true);
    }

    let blockX = Math.round(this.x/Config.blockSize);
    let blockY = Math.round(this.y/Config.blockSize);

    let origModX = 0, origModY = 0;
    let modX = 0, modY = 0;
    let modifierX = 0, modifierY = 0;

    let isFlying = this.isInGodMode;
    if(!isFlying) {
      origModX = 0;
      origModY = Config.physics.gravity;

      modX = 0;
      modY = Config.physics.gravity;
    }

    let movementX = 0, movementY = 0;

    if(modY) {
      movementX = this.horizontal;
      movementY = 0;
    }
    else if(modX) {
      movementX = 0;
      movementY = this.vertical;
    }
    else {
      movementX = this.horizontal;
      movementY = this.vertical;
    }
    movementX *= this.speedMult;
    movementY *= this.speedMult;
    modX *= this.gravityMult;
    modY *= this.gravityMult;

    modifierX = (modX + movementX) / Config.physics.variable_multiplyer;
    modifierY = (modY + movementY) / Config.physics.variable_multiplyer;

    if(this.speedX || modifierX) {
      this.speedX += modifierX;

      this.speedX *= Config.physics.base_drag;
      if((!movementX && modY) || (this.speedX < 0 && movementX > 0) || (this.speedX > 0 && movementX < 0)) {
        this.speedX *= Config.physics.no_modifier_drag;
      }

      if(this.speedX > 16) {
        this.speedX = 16;
      } else if(this.speedX < -16) {
        this.speedX = -16;
      } else if(Math.abs(this.speedX) < 0.0001) {
        this.speedX = 0;
      }
    }

    if(this.speedY || modifierY) {
      this.speedY += modifierY;

      this.speedY *= Config.physics.base_drag;
      if((!movementY && modX) || (this.speedY < 0 && movementY > 0) || (this.speedY > 0 && movementY < 0)) {
        this.speedY *= Config.physics.no_modifier_drag;
      }

      if(this.speedY > 16) {
        this.speedY = 16;
      } else if(this.speedY < -16) {
        this.speedY = -16;
      } else if(Math.abs(this.speedY) < 0.0001) {
        this.speedY = 0;
      }
    }

    let remainderX = this.x % 1, remainderY = this.y % 1;
    let currentSX = this.speedX, currentSY = this.speedY;
    let oldSX = 0, oldSY = 0;
    let oldX = 0, oldY = 0;

    let doneX = false, doneY = false;

    let grounded = false;

    let stepX = () => {
      if(currentSX > 0){
        if(currentSX + remainderX >= 1){
          this.x += (1-remainderX);
          this.x >>= 0;
          currentSX -= (1-remainderX);
          remainderX = 0;
        } else {
          this.x += currentSX;
          currentSX = 0;
        }
      }
      else if(currentSX < 0){
        if(remainderX + currentSX < 0 && (remainderX != 0/*|| ItemId.isBoost(current)*/)){
          currentSX += remainderX;
          this.x -= remainderX;
          this.x >>= 0;
          remainderX = 1;
        }else{
          this.x += currentSX;
          currentSX = 0;
        }
      }
      if(this.playstate.world != null){
        if(this.playstate.world.overlaps(this)){
          this.x = oldX;
          if (this.speedX > 0 && (origModX > 0))
            grounded = true;
          if (this.speedX < 0 && (origModX < 0))
            grounded = true;

          this.speedX = 0;
          currentSX = oldSX;
          doneX = true;
        }
      }
    }
    let stepY = () => {
      if(currentSY > 0){
        if(currentSY + remainderY >= 1){
          this.y += (1-remainderY);
          this.y >>= 0;
          currentSY -= (1-remainderY);
          remainderY = 0;
        } else {
          this.y += currentSY;
          currentSY = 0;
        }
      }
      else if(currentSY < 0){
        if(remainderY + currentSY < 0 && (remainderY != 0/*|| ItemId.isBoost(current)*/)){
          currentSY += remainderY;
          this.y -= remainderY;
          this.y >>= 0;
          remainderY = 1;
        }else{
          this.y += currentSY;
          currentSY = 0;
        }
      }
      if(this.playstate.world != null){
        if(this.playstate.world.overlaps(this)){
          this.y = oldY;
          if (this.speedY > 0 && (origModY > 0))
            grounded = true;
          if (this.speedY < 0 && (origModY < 0))
            grounded = true;

          this.speedY = 0;
          currentSY = oldSY;
          doneY = true;
        }
      }
    }

    while((currentSX && !doneX) || (currentSY && !doneY)) {
      oldX = this.x;
      oldY = this.y;

      oldSX = currentSX;
      oldSY = currentSY;

      stepX();
      stepY();
    }



    // jumping
    let mod = 1
    let inJump = false;
    if (this.isSpaceJustPressed){
      this.lastJump = -this.ticks;
      inJump = true;
      mod = -1
    }

    if(this.isSpaceDown){
        if(this.lastJump < 0){
          if(this.ticks + this.lastJump > 75){
            inJump = true;
          }
        }else{
          if(this.ticks - this.lastJump > 15){
            inJump = true;
          }
        }
    }

    if((this.speedX == 0 && origModX && modX || this.speedY == 0 && origModY && modY) && grounded) {
      // On ground so reset jumps to 0
      this.jumpCount = 0;
    }

    if(this.jumpCount == 0 && !grounded) this.jumpCount = 1; // Not on ground so first 'jump' removed

    if(inJump) {
      if(this.jumpCount < this.maxJumps && origModX && modX) { // Jump in x direction
        if (this.maxJumps < 1000) { // Not infinite jumps
          this.jumpCount += 1;
        }
        this.speedX = (-origModX * Config.physics.jump_height * this.jumpMult) / Config.physics.variable_multiplyer;
        this.lastJump = this.ticks * mod;
      }
      if(this.jumpCount < this.maxJumps && origModY && modY) { // Jump in y direction
        if (this.maxJumps < 1000) { // Not infinite jumps
          this.jumpCount += 1;
        }
        this.speedY = (-origModY * Config.physics.jump_height * this.jumpMult) / Config.physics.variable_multiplyer;
        this.lastJump = this.ticks * mod;
      }
    }

    // touchBlock(cx, cy, isgodmod);
    // sendMovement(cx, cy);



    // autoalign
    let imx = (this.speedX*256)>>0;
    let imy = (this.speedY*256)>>0;

    if(imx != 0) {
      this.moving = true;
    }
    else if(Math.abs(modifierX) < 0.1) {
      let tx = this.x % Config.blockSize;
      if(tx < Config.physics.autoalign_range) {
        if(tx < Config.physics.autoalign_snap_range) {
          this.x >>= 0;
        }
        else this.x -= tx/(Config.blockSize-1);
      }
      else if(tx > Config.blockSize - Config.physics.autoalign_range) {
        if(tx > Config.blockSize - Config.physics.autoalign_snap_range) {
          this.x >>= 0;
          this.x++;
        }
        else this.x += (tx-(Config.blockSize - Config.physics.autoalign_range))/(Config.blockSize-1);
      }
    }

    if(imy != 0) {
      this.moving = true;
    }
    else if(Math.abs(modifierY) < 0.1) {
      let ty = this.y % Config.blockSize;
      if(ty < Config.physics.autoalign_range) {
        if(ty < Config.physics.autoalign_snap_range) {
          this.y >>= 0;
        }
        else this.y -= ty/(Config.blockSize-1);
      }
      else if(ty > Config.blockSize - Config.physics.autoalign_range) {
        if(ty > Config.blockSize - Config.physics.autoalign_snap_range) {
          this.y >>= 0;
          this.y++;
        }
        else this.y += (ty-(Config.blockSize - Config.physics.autoalign_range))/(Config.blockSize-1);
      }
    }

    this.ticks++;
  }

  get moving() {
    return this.ticks - this.lastMoved < 100;
  }
  set moving(value) {
    if(value) this.lastMoved = this.ticks;
    else this.lastMoved = -1;
  }

  get speedMult() {
    return 1;
  }
  get gravityMult() {
    return 1;
  }
  get jumpMult() {
    return 1;
  }
}
