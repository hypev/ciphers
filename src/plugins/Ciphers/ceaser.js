export default function caesarShift(text, offset) {
  if (offset < 0) {
    return caesarShift(text, offset + 26);
  }
  var cipher = "";
  for (var i = 0; i < text.length; i++) {
    var c = text[i];
    if (c.match(/[a-z]/i)) {
      var code = text.charCodeAt(i);
      if (code >= 65 && code <= 90) {
        c = String.fromCharCode(((code - 65 + offset) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        c = String.fromCharCode(((code - 97 + offset) % 26) + 97);
      }
    }
    cipher += c;
  }
  return cipher;
}
