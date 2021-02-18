var Playfair = {
  monograph: "x",

  cleanNumbers: function(a) {
    var b = a.match(/\d/g),
      c = {},
      d = [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine"
      ],
      e = 0,
      f = 0;
    if (!b) return a;
    for (e = 0, f = b.length; f > e; e += 1)
      (c = new RegExp(b[e], "g")), (a = a.replace(c, d[parseInt(b[e], 10)]));
    return a;
  },

  generateKey: function(a) {
    var b = (function() {
        var a = {},
          b = 0,
          c = 0;
        for (b = 97, c = 105; c >= b; b += 1) a[String.fromCharCode(b)] = !1;
        for (b = 107, c = 122; c >= b; b += 1) a[String.fromCharCode(b)] = !1;
        return a;
      })(),
      c = "",
      d = [],
      e = 0,
      f = 0;
    for (
      a = a
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .replace("j", "i"),
        a = this.cleanNumbers(a),
        e = 0,
        f = a.length;
      f > e;
      e += 1
    )
      b[a[e]] || ((c += a[e]), (b[a[e]] = !0));
    for (e in b)
      Object.prototype.hasOwnProperty.call(b, e) && (b[e] || (c += e));
    for (e = 0, f = 5; f > e; e += 1)
      d.push(c.substring(5 * e, 5 * e + 5).split(""));
    return d;
  },

  generateText: function(a) {
    var b = 0,
      c = 0;
    for (
      a = a
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .replace("j", "i"),
        a = this.cleanNumbers(a),
        a = a.split(""),
        a.length % 2 && a.push(this.monograph),
        b = 0,
        c = a.length;
      c > b;
      b += 2
    )
      a[b] === a[b + 1] && (a[b + 1] = "x");
    return a.join("");
  },

  printKey: function(a, b) {
    var c = this.generateKey(a),
      d = [],
      e = 0,
      f = 0;
    for (e = 0, f = c.length; f > e; e += 1) d.push(c[e].join(" "));
    return d.join(b || "\n");
  },

  index: function(a, b) {
    var c = 0,
      d = 0;
    for (d = 0; d < b.length; d += 1)
      for (c = 0; c < b.length; c += 1)
        if (b[d][c] === a) return { row: c, col: d };
    return { row: 0, col: 0 };
  },

  shift: function(a, b, c, d) {
    var e = "",
      f = { a: this.index(b, a), b: this.index(c, a) };
    return (
      f.a.row === f.b.row
        ? ((e += a[Math.abs((f.a.col + d + 5) % 5)][f.a.row]),
          (e += a[Math.abs((f.b.col + d + 5) % 5)][f.b.row]))
        : f.a.col === f.b.col
        ? ((e += a[f.a.col][Math.abs((f.a.row + d + 5) % 5)]),
          (e += a[f.b.col][Math.abs((f.b.row + d + 5) % 5)]))
        : ((e += a[f.a.col][f.b.row]), (e += a[f.b.col][f.a.row])),
      e
    );
  },

  encrypt: function(b, a) {
    var c = this.generateKey(a),
      d = this.generateText(b),
      e = "",
      f = 0,
      g = 0;
    for (f = 0, g = d.length; g > f; f += 2)
      e += this.shift(c, d[f], d[f + 1], 1);
    return e;
  },

  decrypt: function(b, a) {
    var c = this.generateKey(a),
      d = this.generateText(b),
      e = "",
      f = 0,
      g = 0;
    for (f = 0, g = d.length; g > f; f += 2)
      e += this.shift(c, d[f], d[f + 1], -1);
    return e;
  }
};

export default Playfair;
