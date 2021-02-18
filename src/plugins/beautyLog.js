function beautyLog() {
  var text = "Developed by Ruslan Kurbanali";
  var style = [
    "height: 40px",
    "margin: 20px 0",
    'font-family: "Segeo UI", sans-serif',
    "font-weight: bold",
    "font-size: 14px"
  ].join(";");
  style += ";";
  style += [
    "padding: 25px 25px 25px 70px",
    "line-height: 16px",
    'background: url("'.concat(
      window.location.origin,
      '/img/icons/android-chrome-192x192.png") 0px 50% / 50px 50px no-repeat'
    )
  ].join(";");
  console.log("%c ".concat(text), style);
}

beautyLog();
