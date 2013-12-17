// Copyright (c) 2013 Marco Biasini
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy 
// of this software and associated documentation files (the "Software"), to deal 
// in the Software without restriction, including without limitation the rights 
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
// copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
// SOFTWARE.

(function(exports) {
"use strict";

exports.rgb = {};

exports.rgb.create = vec3.create;
exports.rgb.scale = vec3.scale;
exports.rgb.copy = vec3.copy;
exports.rgb.fromValues = vec3.fromValues;

exports.rgb.mix = function(out, colorOne, colorTwo, t) {
  var oneMinusT = 1.0 - t;
  out[0] = colorOne[0]*t+colorTwo[0]*oneMinusT;
  out[1] = colorOne[1]*t+colorTwo[1]*oneMinusT;
  out[2] = colorOne[2]*t+colorTwo[2]*oneMinusT;
  return out;
};

var COLORS = {
  white : rgb.fromValues(1.0,1.0,1.0),
  black : rgb.fromValues(0.0,0.0,0.0),
  grey : rgb.fromValues(0.5,0.5,0.5),
  lightgrey : rgb.fromValues(0.8,0.8,0.8),
  darkgrey : rgb.fromValues(0.3,0.3,0.3),
  red : rgb.fromValues(1.0,0.0,0.0),
  darkred : rgb.fromValues(0.5,0.0,0.0),
  lightred : rgb.fromValues(1.0,0.5,0.5),
  green : rgb.fromValues(0.0,1.0,0.0),
  darkgreen : rgb.fromValues(0.0,0.5,0.0),
  lightgreen : rgb.fromValues(0.5,1.0,0.5),
  blue : rgb.fromValues(0.0,0.0,1.0),
  darkblue : rgb.fromValues(0.0,0.0,0.5),
  lightblue : rgb.fromValues(0.5,0.5,1.0),
  yellow : rgb.fromValues(1.0,1.0,0.0),
  darkyellow : rgb.fromValues(0.5,0.5,0.0),
  lightyellow : rgb.fromValues(1.0,1.0,0.5),
  cyan : rgb.fromValues(0.0,1.0,1.0),
  darkcyan : rgb.fromValues(0.0,0.5,0.5),
  lightcyan : rgb.fromValues(0.5,1.0,1.0),
  magenta : rgb.fromValues(1.0,0.0,1.0),
  darkmagenta : rgb.fromValues(0.5,0.0,0.5),
  lightmagenta : rgb.fromValues(1.0,0.5,1.0),
  orange : rgb.fromValues(1.0,0.5,0.0),
  darkorange : rgb.fromValues(0.5,0.25,0.0),
  lightorange : rgb.fromValues(1.0,0.75,0.5)
};

// converts color strings to RGB. for now only supports color names. 
// hex triples will need to be added.
exports.forceRGB = function(color) {
  if (COLORS[color] !== undefined) {
    return COLORS[color];
  }
  return color;
};

function Gradient(colors, stops) {
  this._colors = colors;
  for (var i = 0; i < this._colors.length; ++i) {
    this._colors[i] = exports.forceRGB(this._colors[i]);
  }
  this._stops = stops;
}

Gradient.prototype.colorAt = function(out, value) {
  if (value <= this._stops[0]) {
    return vec3.copy(out, this._colors[0]);
  }
  if (value >= this._stops[this._stops.length-1]) {
    return vec3.copy(out, this._colors[this._stops.length-1]);
  }
  // could use a binary search here, but since most gradients
  // have a really small number of stops, that's not going to
  // help much.
  var lowerIndex = 0;
  for (var i = 0; i < this._stops.length; ++i) {
    if (this._stops[i] > value) {
      break;
    }
    lowerIndex = i;
  }
  var upperIndex = lowerIndex+1;
  var lowerStop = this._stops[lowerIndex];
  var upperStop = this._stops[upperIndex];
  var t = (value - lowerStop)/ (upperStop - lowerStop);
  return rgb.mix(out, this._colors[upperIndex], this._colors[lowerIndex], t);
};
var GRADIENTS = { };
// creates a new gradient from the given set of colors. 
// 
// colors must be a valid list of colors.
//
// when stops is set to 'equal', then the color stops are
// assumed to be equi distant on the interval 0,1. otherwise,
// stops must be  a list of floating point numbers with the 
// same length than colors.
exports.gradient = function(colors, stops) {
  if (typeof colors === 'string') {
    return GRADIENTS[colors];
  }
  stops = stops || 'equal';
  if (stops === 'equal') {
    stops = [];
    for (var i = 0; i < colors.length; ++i) {
      stops.push(i*1.0/(colors.length-1));
    }
  }
  return new Gradient(colors, stops);
};

GRADIENTS.rainbow =gradient(['red', 'yellow', 'green', 'blue']);
GRADIENTS.reds = gradient(['lightred', 'darkred']);
GRADIENTS.greens = gradient(['lightgreen', 'darkgreen']);
GRADIENTS.blues = gradient(['lightblue', 'darkblue']);
GRADIENTS.trafficlight = gradient(['green', 'yellow', 'red']);
GRADIENTS.heatmap = gradient(['red', 'white', 'blue']);

function ColorOp(colorFunc, beginFunc, endFunc) {
  this.colorFor = colorFunc;
  this._beginFunc = beginFunc;
  this._endFunc = endFunc;
}

ColorOp.prototype.begin = function(obj) {
  if (this._beginFunc) {
    this._beginFunc(obj);
  }
};


ColorOp.prototype.end = function(obj) {
  if (this._endFunc) {
    this._endFunc(obj);
  }
};

exports.color = {};

exports.ColorOp = ColorOp;

exports.color.uniform = function(color) {
  color = exports.forceRGB(color);
  return new ColorOp(function(atom, out, index) {
    out[index] = color[0];
    out[index+1] = color[1];
    out[index+2] = color[2];
  }, null, null);
};

exports.color.byElement = function() {
  return new ColorOp(function(atom, out, index) {
    var ele = atom.element();
    if (ele === 'C') {
      out[index] = 0.8; out[index+1] = 0.8; out[index+2] = 0.8;
      return out;
    }
    if (ele === 'N') {
      out[index] = 0; out[index+1] = 0; out[index+2] = 1;
      return out;
    }
    if (ele === 'O') {
      out[index] = 1; out[index+1] = 0; out[index+2] = 0;
      return out;
    }
    if (ele === 'S') {
      out[index] = 0.8; out[index+1] = 0.8; out[index+2] = 0;
      return out;
    }
    if (ele === 'CA') {
      out[index] = 0.533; out[index+1] = 0.533; out[index+2] = 0.666;
      return out;
    }
    out[index] = 1; out[index+1] = 0; out[index+2] = 1;
    return out;
  }, null, null);
};

exports.color.bySS = function() {

  return new ColorOp(function(atom, out, index) {
    switch (atom.residue().ss()) {
      case 'C':
        out[index] = 0.8; out[index+1] = 0.8; out[index+2] = 0.8;
        return;
      case 'H':
        out[index] = 0.6; out[index+1] = 0.6; out[index+2] = 0.9;
        return;
      case 'E':
        out[index] = 0.2; out[index+1] = 0.8; out[index+2] = 0.2;
        return;
    }
  }, null, null);
};

exports.color.rainbow = function(grad) {
  if (!grad) {
    grad = gradient('rainbow');
  }
  var colorFunc = new ColorOp(function(a, out, index) {
    var idx = a.residue().index();
    var limits = this.chainLimits[a.residue().chain().name()];
    var t = 0.0;
    if (limits !== undefined) {
      t =  (idx - limits[0])/(limits[1]-limits[0]);
    } 
    var x = [0,0,0];
    grad.colorAt(x, t);
    out[index] = x[0];
    out[index+1] = x[1];
    out[index+2] = x[2];
  }, function(obj) {
    var chains = obj.chains();
    this.chainLimits = {};
    for (var i = 0; i < chains.length; ++i) {
      var bb = chains[i].backboneTraces();
      if (bb.length === 0) {
        continue;
      }
      var minIndex = bb[0].residueAt(0).index(), 
          maxIndex = bb[0].residueAt(bb[0].length()-1).index();
      for (var j = 1; j < bb.length; ++j) {
        var bbj = bb[j];
        minIndex = Math.min(minIndex, bbj.residueAt(0).index());
        maxIndex = Math.max(maxIndex, bbj.residueAt(bbj.length()-1).index());
      }
      this.chainLimits[chains[i].name()] = [minIndex, maxIndex];
    }
  },function(obj) {
    this.chainLimits = null;
  });
  return colorFunc;
};

exports.color.ssSuccession = function(grad, coilColor) {
  if (!grad) {
    grad = gradient('rainbow');
  }
  if (!coilColor) {
    coilColor = forceRGB('lightgrey');
  }
  var colorFunc = new ColorOp(function(a, out, index) {
    var idx = a.residue().index();
    var limits = this.chainLimits[a.residue().chain().name()];
    var ssIndex = limits.indices[idx];
    if (ssIndex === -1) {
      out[index] = coilColor[0];
      out[index+1] = coilColor[1];
      out[index+2] = coilColor[2];
      return;
    }
    var t = 0.0;
    if (limits.max === null) {
    }
    if (limits.max !== null) {
      t =  ssIndex/(limits.max > 0 ? limits.max : 1);
    } 
    var x = [0,0,0];
    grad.colorAt(x, t);
    out[index] = x[0];
    out[index+1] = x[1];
    out[index+2] = x[2];
  }, function(obj) {
    var chains = obj.chains();
    this.chainLimits = {};
    for (var i = 0; i < chains.length; ++i) {
      var residues = chains[i].residues();
      var maxIndex = null;
      var indices = {};
      var ssIndex = 0;
      var lastSS = 'C';
      for (var j = 0; j < residues.length; ++j) {
        var ss =  residues[j].ss();
        if (ss === 'C') {
          if (lastSS !== 'C') {
            ssIndex++;
          }
          indices[residues[j].index()] = -1;
        } else {
          maxIndex = ssIndex;
          indices[residues[j].index()] = ssIndex;
        }
        lastSS = ss;
      }
      this.chainLimits[chains[i].name()] = {
        indices : indices,
        max: maxIndex,
      };
    }
  },function(obj) {
    this.chainLimits = null;
  });
  return colorFunc;
};

exports.color.byChain = function(grad) {
  if (!grad) {
    grad = gradient('rainbow');
  }
  var colorFunc = new ColorOp(function(a, out, index) {
    var idx = a.residue().index();
    var chainIndex = this.chainIndices[a.residue().chain().name()];
    var t =  chainIndex*this.scale;
    var x = [0,0,0];
    grad.colorAt(x, t);
    out[index] = x[0];
    out[index+1] = x[1];
    out[index+2] = x[2];
  }, function(obj) {
    var chains = obj.chains();
    this.chainIndices = {};
    for (var i = 0; i < chains.length; ++i) {
      this.chainIndices[chains[i].name()] = i;
    }
    this.scale = chains.length > 1 ? 1.0/(chains.length-1) : 1.0;
  },function(obj) {
    this.chainIndices = null;
  });
  return colorFunc;
};

function getMinMaxRange(obj, iter, propName) {
  var min = null;
  var max = null;
  obj[iter](function(item) {
    var value = item.prop(propName);
    if (min === null && max === null) {
      min = max = value;
      return;
    }
    min = Math.min(min, value);
    max = Math.max(max, value);
  });
  return { min: min, max: max };
}

var gradColor = (function() {
  var color = vec3.create();
  return function(out, index, grad, t) {
    grad.colorAt(color, t);
    out[index+0] = color[0];
    out[index+1] = color[1];
    out[index+2] = color[2];
  };
})();

function colorByItemProp(propName, grad, range, iter, item) {
  if (!grad) {
    grad = gradient('rainbow');
  }
  return new ColorOp(function(a, out, index) {
      var t = 0.0;
      if (this._min !== this._max) {
        t = (item(a).prop(propName) - this._min)/(this._max - this._min);
      }
      gradColor(out, index, grad, t);
    }, 
    function(obj) {
      if (range !== undefined) {
        this._min = range[0];
        this._max = range[1];
        return;
      }
      range = getMinMaxRange(obj, iter, propName);
      this._min = range.min;
      this._max = range.max;
    }, 
    function(obj) { }
  );
}

exports.color.byAtomProp = function(propName, grad, range) {
  return colorByItemProp(propName, grad, range, 'eachAtom', 
                         function(a) {return a;});
};

exports.color.byResidueProp = function(propName, grad, range) {
  return colorByItemProp(propName, grad, range, 'eachResidue', 
                         function(a) {return a.residue();});
};

// linearly interpolates the array of colors and returns it as a Float32Array
// color must be an array containing a sequence of R,G,B triples.
exports.interpolateColor = function(colors, num) {
  var out = new Float32Array((num*(colors.length/3-1) + 1)*3);
  var index = 0;
  var bf = vec3.create(), af = vec3.create();
  var delta = 1/num;
  for (var i = 0; i < colors.length/3-1; ++i) {
    vec3.set(bf, colors[3*i], colors[3*i+1], colors[3*i+2]);
    vec3.set(af, colors[3*i+3], colors[3*i+4], colors[3*i+5]);
    for (var j = 0; j < num; ++j) {
      var t = delta * j;
      out[index] = bf[0]*(1-t)+af[0]*t;
      out[index+1] = bf[1]*(1-t)+af[1]*t;
      out[index+2] = bf[2]*(1-t)+af[2]*t;
      index+=3;
    }
  }
  out[index] = af[0];
  out[index+1] = af[1];
  out[index+2] = af[2];
  return out;
};



return true;
})(this);