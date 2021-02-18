var Transposition = {
  chars: "abcdefghijklmnopqrstuvwxyz",

  encrypt(plain, key, pad) {
    plain = plain.toLowerCase().replace(/[^a-z]/g, "");
    key = key.toLowerCase().replace(/[^a-z]/g, "");
    var klen = key.length;
    if (pad == "") pad = "x";
    while (plain.length % klen != 0) {
      plain += pad.charAt(0);
    }
    var colLength = plain.length / klen;
    var cipher = "";
    var k = 0;
    for (let i = 0; i < klen; i++) {
      while (k < 26) {
        var t = key.indexOf(Transposition.chars.charAt(k));
        var arrkw = key.split("");
        arrkw[t] = "_";
        key = arrkw.join("");
        if (t >= 0) break;
        else k++;
      }
      for (let j = 0; j < colLength; j++) {
        cipher += plain.charAt(j * klen + t);
      }
    }
    return cipher;
  },

  decrypt(cipher, key) {
    cipher = cipher.toLowerCase().replace(/[^a-z]/g, "");
    key = key.toLowerCase().replace(/[^a-z]/g, "");
    var klen = key.length;
    var cols = new Array(klen);
    var colLength = cipher.length / klen;
    for (let i = 0; i < klen; i++)
      cols[i] = cipher.substr(i * colLength, colLength);
    var newcols = new Array(klen);
    var j = 0;
    var i = 0;
    while (j < klen) {
      var t = key.indexOf(Transposition.chars.charAt(i));
      if (t >= 0) {
        newcols[t] = cols[j++];
        var arrkw = key.split("");
        arrkw[t] = "_";
        key = arrkw.join("");
      } else i++;
    }
    var plain = "";
    for (i = 0; i < colLength; i++) {
      for (j = 0; j < klen; j++) {
        plain += newcols[j].charAt(i);
      }
    }
    return plain;
  }
};

export default Transposition;
