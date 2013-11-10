// Copyright (c) 2013 Marco Biasini
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to 
// deal in the Software without restriction, including without limitation the 
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
// sell copies of the Software, and to permit persons to whom the Software is 
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in 
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
// DEALINGS IN THE SOFTWARE.

(function(exports) {

"use strict";


// A camera, providing us with a view into the 3D worlds. Handles projection,
// and modelview matrices and controls the global render parameters such as
// shader and fog.
function Cam(gl) {
  this._projection = mat4.create();
  this._modelview = mat4.create();
  this._near = 0.1;
  this._far = 400.0;
  this._fogNear = -5;
  this._fogFar = 10;
  this._fog = true;
  this._fogColor = vec3.fromValues(1, 1, 1);
  this._outlineColor = vec3.fromValues(0.1, 0.1, 0.1);
  this._center = vec3.create();
  this._zoom = 50;
  this._rotation = mat4.create();
  this._translation = mat4.create();
  this._updateMat = true;
  this._gl = gl;
  this._currentShader = null;
  mat4.perspective(this._projection, 45.0, 
                   gl.viewportWidth / gl.viewportHeight, this._near, 
                   this._far);
  mat4.translate(this._modelview, this._modelview, [0, 0, -20]);
}

Cam.prototype._updateIfRequired = function() {
  if (!this._updateMat) {
    return false;
  }
  mat4.identity(this._modelview);
  mat4.translate(this._modelview, this._modelview, 
                  [-this._center[0], -this._center[1], -this._center[2]]);
  mat4.mul(this._modelview, this._rotation, this._modelview);
  mat4.identity(this._translation);
  mat4.translate(this._translation, this._translation, [0,0, -this._zoom]);
  mat4.mul(this._modelview, this._translation, this._modelview);
  this._updateMat = false;
  return true;
};


Cam.prototype.setCenter = function(point) {
  this._updateMat = true;
  vec3.copy(this._center, point);
};

Cam.prototype.fog =function(value) {
  if (value !== undefined) {
    this._fog = value;
  }
  return this._fog;
};

Cam.prototype.rotateZ = (function() {
  var tm = mat4.create();
  return function(delta) {
    mat4.identity(tm);
    this._updateMat = true;
    mat4.rotate(tm, tm, delta, [0,0,1]);
    mat4.mul(this._rotation, tm, this._rotation);
  };
})();

Cam.prototype.rotateX= (function(){
  var tm = mat4.create();
  return function(delta) {
    mat4.identity(tm);
    this._updateMat = true;
    mat4.rotate(tm, tm, delta, [1,0,0]);
    mat4.mul(this._rotation, tm, this._rotation);
  };
})();

Cam.prototype.rotateY = (function() {
  var tm = mat4.create();
  return function(delta) {
    mat4.identity(tm);
    this._updateMat = true;
    mat4.rotate(tm, tm, delta, [0,1,0]);
    mat4.mul(this._rotation, tm, this._rotation);
  };
})();

Cam.prototype.panX = function(delta) {
  return this.panXY(delta, 0);
};

Cam.prototype.panY = function(delta) {
  return this.panXY(0, delta);
};

Cam.prototype.panXY = (function () {
  var invertRotation = mat4.create();
  var newCenter = vec3.create();
  return function(deltaX, deltaY) {
    mat4.transpose(invertRotation, this._rotation);
    this._updateMat = true;
    vec3.set(newCenter, -deltaX, deltaY ,0);
    vec3.transformMat4(newCenter, newCenter, invertRotation);
    vec3.add(newCenter, newCenter, this._center);
    this.setCenter(newCenter);
  };
})();

Cam.prototype.zoom = function(delta) {
  this._updateMat = true;
  this._zoom += delta;
};

Cam.prototype.currentShader = function() { return this._currentShader; };

// sets all OpenGL parameters to make this camera active. 
//
// among other things, it sets the follow uniforms on the shader:
//
// - projectionMat   - the 4x4 projection matrix
// - modelviewMat    - the 4x4 modelview matrix
// - rotationMat     - the rotational part of the modelview matrix
// - fog             - boolean indicating whether fog is enabled
// - fogNear,fogFar  - near and far offset of fog
// - fogColor        - the color of fog
// - outlineColor    - color to be used for the outline shader
Cam.prototype.bind = function(shader) {
  var shaderChanged = false;
  if (this._currentShader !== shader)
  {
    this._currentShader = shader;
    this._gl.useProgram(shader);
    shaderChanged = true;
  }
  if (!this._updateIfRequired() && !shaderChanged) {
    return;
  }
  this._gl.viewport(0, 0, this._gl.viewportWidth, this._gl.viewportHeight);
  shader.projection = this._gl.getUniformLocation(shader, 'projectionMat');
  shader.modelview = this._gl.getUniformLocation(shader, 'modelviewMat');
  shader.rotation = this._gl.getUniformLocation(shader, 'rotationMat');
  this._gl.uniformMatrix4fv(shader.projection, false, this._projection);
  this._gl.uniformMatrix4fv(shader.modelview, false, this._modelview);
  this._gl.uniformMatrix4fv(shader.modelview, false, this._modelview);
  if (shader.rotation !== -1) {
    this._gl.uniformMatrix4fv(shader.rotation, false, this._rotation);
  }
  this._gl.uniform1i(this._gl.getUniformLocation(shader, 'fog'), this._fog);
  this._gl.uniform1f(this._gl.getUniformLocation(shader, 'fogFar'),
                this._fogFar+this._zoom);
  this._gl.uniform1f(this._gl.getUniformLocation(shader, 'fogNear'),
                this._fogNear+this._zoom);
  if (this._gl.getUniformLocation(shader, 'outlineColor')) {
    this._gl.uniform3fv(this._gl.getUniformLocation(shader, 'outlineColor'),
                  this._outlineColor);
  }
  this._gl.uniform3fv(this._gl.getUniformLocation(shader, 'fogColor'),
                this._fogColor);
};

exports.Cam = Cam;
})(this);
