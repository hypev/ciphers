var Vigenere = {
  _matrix: {
    a: "abcdefghijklmnopqrstuvwxyz",
    b: "bcdefghijklmnopqrstuvwxyza",
    c: "cdefghijklmnopqrstuvwxyzab",
    d: "defghijklmnopqrstuvwxyzabc",
    e: "efghijklmnopqrstuvwxyzabcd",
    f: "fghijklmnopqrstuvwxyzabcde",
    g: "ghijklmnopqrstuvwxyzabcdef",
    h: "hijklmnopqrstuvwxyzabcdefg",
    i: "ijklmnopqrstuvwxyzabcdefgh",
    j: "jklmnopqrstuvwxyzabcdefghi",
    k: "klmnopqrstuvwxyzabcdefghij",
    l: "lmnopqrstuvwxyzabcdefghijk",
    m: "mnopqrstuvwxyzabcdefghijkl",
    n: "nopqrstuvwxyzabcdefghijklm",
    o: "opqrstuvwxyzabcdefghijklmn",
    p: "pqrstuvwxyzabcdefghijklmno",
    q: "qrstuvwxyzabcdefghijklmnop",
    r: "rstuvwxyzabcdefghijklmnopq",
    s: "stuvwxyzabcdefghijklmnopqr",
    t: "tuvwxyzabcdefghijklmnopqrs",
    u: "uvwxyzabcdefghijklmnopqrst",
    v: "vwxyzabcdefghijklmnopqrstu",
    w: "wxyzabcdefghijklmnopqrstuv",
    x: "xyzabcdefghijklmnopqrstuvw",
    y: "yzabcdefghijklmnopqrstuvwx",
    z: "zabcdefghijklmnopqrstuvwxy"
  },

  encrypt(plain, key) {
    plain = plain.toLowerCase();
    key = key
      .match(/[a-z]/gi)
      .join("")
      .toLowerCase();
    var encrypted = "";
    var specialCharacterCount = 0;
    for (var i = 0; i < plain.length; i++) {
      var keyLetter = (i - specialCharacterCount) % key.length;
      var keyIndex = Vigenere._matrix.a.indexOf(key[keyLetter]);
      if (Vigenere._matrix[plain[i]]) {
        encrypted += Vigenere._matrix[plain[i]][keyIndex];
      } else {
        encrypted += plain[i];
        specialCharacterCount++;
      }
    }
    return encrypted;
  },

  decrypt(encrypted, key) {
    encrypted = encrypted.toLowerCase();
    key = key
      .match(/[a-z]/gi)
      .join("")
      .toLowerCase();
    var decrypted = "";
    var specialCharacterCount = 0;
    for (var i = 0; i < encrypted.length; i++) {
      var keyLetter = (i - specialCharacterCount) % key.length;
      var keyRow = Vigenere._matrix[key[keyLetter]];
      if (keyRow.indexOf(encrypted[i]) !== -1) {
        decrypted += Vigenere._matrix.a[keyRow.indexOf(encrypted[i])];
      } else {
        decrypted += encrypted[i];
        specialCharacterCount++;
      }
    }
    return decrypted;
  }
};

export default Vigenere;
