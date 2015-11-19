function selectText(index) {
  var text = document.getElementById('text').value;
  var nth = parseInt(document.getElementById('index').value, 10);
  var selection = ts.tom.core.Selection.from(text, nth, true);
}

function red() {
  var selection = ts.tom.core.Selection.from();
  $(selection.getTextNodes()).wrap("<span style='color: red'/>");
}

function green(index) {
  var selection = ts.tom.core.Selection.from();
  $(selection.getTextNodes()).wrap("<span style='color: green'/>");
}
