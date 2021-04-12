class Key {
  keyCode;
  needsShift;

  static jump =              Input.add(25, "Jump", new Key(32));                              // Space
  static up =                Input.add(0, "Move Up (alt)", new Key(87), new Key(90));         // W / Z
  static left =              Input.add(1, "Move Left (alt)", new Key(65), new Key(81));       // A / Q
  static down =              Input.add(2, "Move Down (alt)", new Key(83));                    // S
  static right =             Input.add(3, "Move Right (alt)", new Key(68));                   // D

	static lockCamera =        Input.add(19, "Lock Camera", new Key(76, true), null, true);     // Shift + L
  static lookUp =            Input.add(22, "Look Up", new Key(89, true), null, true);         // Shift + Y
  static lookLeft =          Input.add(23, "Look Left", new Key(71, true), null, true);       // Shift + G
  static lookDown =          Input.add(20, "Look Down", new Key(72, true), null, true);       // Shift + H
  static lookRight =         Input.add(21, "Look Right", new Key(74, true), null, true);      // Shift + J
  constructor (keyCode, shift = false) {
    this.keyCode = keyCode;
    this.needsShift = shift;
  }

  print() {
    let s = Key.printKey(keyCode);
    return s ? (this.needsShift ? 'Shift + ' : '') + s : '???';
  }

  static isValidKey(code) {
    return (code >= 65 && code <= 90) || // A to Z
           (code >= 96 && code <= 111) || // numpad
           (code >= 186 && code <= 192 && code != 191) || (code >= 219 && code <= 222) || // symbols
         code == 32; // space
  }

  static printKey(code) {
    if (code >= 65 && code <= 90)
      return String.fromCharCode(code);
    else if (code >= 96 && code <= 111)
      return 'Numpad ' + String.fromCharCode(code - (code <= 105 ? 48 : 64));

    switch (code) {
      case 186: return ';:';
      case 187: return '=+';
      case 188: return ',<';
      case 189: return '-_';
      case 190: return '.>';
      //case 191: return '/?';
      case 192: return '`~';
      case 219: return '[{';
      case 220: return '\\|';
      case 221: return ']}';
      case 222: return '\'';
      case 32: return 'Space';
      default: return null;
    }
  }
}
