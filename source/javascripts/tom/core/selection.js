var ts = ts || {};
ts.tom = ts.tom || {};
ts.tom.core = ts.tom.core || {};


/**
 * @export
 * @param {Range} range
 * @constructor
 */
ts.tom.core.Selection = function(range) {
  /**
   * @type {Range}
   * @private
   */
  this.range_ = range;
};


/**
 * @export
 * @return {Array.<Text>}
 */
ts.tom.core.Selection.prototype.getTextNodes = function() {
  'use strict';
  /**
   * @export
   * @param {Text|{startPosition, endPosition}} container
   * @param {number} offset
   * @return {Text}
   */
  function split(container, offset) {
    var rp = container.splitText(offset);
    rp.startPosition = container.startPosition + ts.tom.utils.string.compact(container.data).length;
    rp.endPosition = container.endPosition;
    container.endPosition = rp.startPosition - 1;
    return rp;
  }

  var sc = /**@type {Text}*/(this.range_.startContainer), ec = /**@type {Text}*/(this.range_.endContainer),
      so = this.range_.startOffset, eo = this.range_.endOffset;
  var bNodes = document.body.data.tNodes;
  var si = bNodes.indexOf(sc);
  var srp = split(sc, so);
  if (srp.length > 0) {
    bNodes.splice(si + 1, 0, srp);
  }
  if (ec === sc) {
    ec = srp;
    eo = eo - so;
  }
  var ei = bNodes.indexOf(ec);
  var erp = split(ec, eo);
  if (erp.length > 0) {
    bNodes.splice(ei + 1, 0, erp);
  }
  return bNodes.slice(si + 1, ei + 1);
};


/**
 * @export
 * @return {Number}
 */
ts.tom.core.Selection.prototype.getIndex = function() {
  'use strict';
  var container = this.range_.endContainer;
  if (!(container instanceof Text) || !(this.range_.startContainer instanceof Text)) {
    throw new Error('illegal selection');
  }
  var offset = this.range_.endOffset;
  var cHead = ts.tom.utils.string.compact(container.substringData(0, offset));
  var cLength = cHead ? cHead.length : 0;
  if (cLength < 1) {
    throw new Error('illegal selection');
  }
  var cText = ts.tom.utils.string.compact(this.range_.toString());
  return ts.tom.utils.string.times(document.body.data.tText.substr(0, container.startPosition + cLength), cText);
};


/**
 * @export
 * @return {Selection}
 */
ts.tom.core.Selection.prototype.getSelection = function() {
  var selection = window.getSelection();
  if (selection.rangeCount < 1) {
    selection.addRange(this.range_);
  }
  return selection;
};


/**
 * @export
 * @param {string=} opt_text
 * @param {number=} opt_nth
 * @param {boolean=} opt_select = false whether to select the range
 * @return {ts.tom.core.Selection}
 */
ts.tom.core.Selection.from = function(opt_text, opt_nth, opt_select) {
  var selection = window.getSelection();
  if (!opt_text && selection.rangeCount > 0) {
    return new ts.tom.core.Selection(window.getSelection().getRangeAt(0));
  }
  var range = ts.tom.core.Selection.rangeFrom_(opt_text, opt_nth);
  if (opt_select) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
  return new ts.tom.core.Selection(range);
};


/**
 *  return an empty range object that has both of its boundary points positioned at
 *  the beginning of the document when no parameters are given, else return an range
 *  object that contains the nth occurrence of the specified text
 *
 * @param {string} text the base text
 * @param {number} nth = 1 the nth index
 * @return {Range} the range created that contains the specified text
 * @private
 */
ts.tom.core.Selection.rangeFrom_ = function(text, nth) {
  'use strict';
  /**
   * @param {String} str
   * @param {number} count
   * @param {number} isStart only 1 or 0 is accepted
   * @return {number}
   */
  function offset(str, count, isStart) {
    for (var i = 0, j = 0; i < count + isStart; j++) {
      if (!/\s+/m.test(str[j])) {
        i++;
      }
    }
    return j - isStart;
  }

  if (!text) {
    return document.createRange();
  } else {
    var bText = document.body.data.tText;
    var bNodes = document.body.data.tNodes;
    var range = document.createRange();
    var cText = ts.tom.utils.string.compact(text);
    var index = ts.tom.utils.string.nthIndexOf(bText, cText, nth || 1);
    if (index > -1) {
      var cStartPos = index + bNodes[0].startPosition;//include the first character
      var cEndPos = cStartPos + cText.length;//exclude the last character

      var startContainer = null, endContainer = null;
      for (var i = 0; i < bNodes.length; i++) {
        var node = bNodes[i];
        if (!startContainer && node.endPosition >= cStartPos) {
          startContainer = bNodes[i];
        }
        if (node.startPosition >= cEndPos) {
          endContainer = bNodes[i - 1];
          break;
        }
      }
      if (startContainer !== null) {
        endContainer = endContainer || bNodes[bNodes.length - 1];
        var startOffset = offset(startContainer.data, cStartPos - startContainer.startPosition, 1);
        var endOffset = offset(endContainer.data, cEndPos - endContainer.startPosition, 0);
        range.setStart(startContainer, startOffset);
        range.setEnd(endContainer, endOffset);
      }
    }
    return range;
  }
};

window.addEventListener('load', function() {
  'use strict';
  function getTextNodes(element) {
    'use strict';
    var nodes = [];
    var elesToSkip = {
      elements: ['applet', 'area', 'base', 'basefont', 'bdo', 'button', 'frame', 'frameset', 'iframe',
        'head', 'hr', 'img', 'input', 'link', 'map', 'meta', 'noframes', 'noscript', 'optgroup',
        'option', 'param', 'script', 'select', 'style', 'textarea', 'title'],
      /**
       * @param {Element} node
       * @param {Array.<string>|null} list
       * @return {boolean}
       */
      test: function(node, list) {
        var elements = list || this.elements;
        return elements.indexOf(node.tagName.toLowerCase()) > -1;
      }
    };

    function getTextNodes(node) {
      if (node.nodeType === 3 && /\S/.test(node.data)) {
        nodes.push(node);
      } else if (node.nodeType === 1 && !elesToSkip.test(node, null)) {
        for (var i = 0, len = node.childNodes.length; i < len; ++i) {
          getTextNodes(node.childNodes[i]);
        }
      }
    }

    getTextNodes(element);
    return nodes;
  }

  var bodyNodes = getTextNodes(document.body), position = 0;
  var cBodyText = '';
  bodyNodes.forEach(function(/**@type {Text}*/node) {
    node.startPosition = position;
    var cText = ts.tom.utils.string.compact(node.data);
    cBodyText += cText;
    position += cText.length;
    node.endPosition = position - 1;
  });
  document.body.data = {
    /**
     * @type {Array.<Text>}
     */
    tNodes: bodyNodes,
    /**
     * @type {String}
     */
    tText: cBodyText
  };
});


