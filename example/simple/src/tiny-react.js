'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var VEmptyComponent = function () {
  function VEmptyComponent() {
    classCallCheck(this, VEmptyComponent);

    this._element = null;
  }

  createClass(VEmptyComponent, [{
    key: 'mountComponent',
    value: function mountComponent() {
      return '';
    }
  }]);
  return VEmptyComponent;
}();

var VTextComponent = function () {
  function VTextComponent(text) {
    classCallCheck(this, VTextComponent);

    this._element = text;
    this._stringText = '' + text;
    this._rootID = 0;
  }

  createClass(VTextComponent, [{
    key: 'mountComponent',
    value: function mountComponent(rootID) {
      this._rootID = rootID;
      var openingComment = '<!-- text: ' + rootID + ' -->';
      var closingComment = '<!-- /text -->';
      return openingComment + this._stringText + closingComment;
    }
  }]);
  return VTextComponent;
}();

var VDomComponent = function () {
  function VDomComponent(element) {
    classCallCheck(this, VDomComponent);

    var tag = element.type;

    this._element = element;
    this._tag = tag.toLowerCase();
    this._rootID = 0;
  }

  createClass(VDomComponent, [{
    key: 'mountComponent',
    value: function mountComponent(rootID) {
      this._rootID = rootID;
      if (typeof this._element.type !== 'string') {
        throw new Error('VDOMComponent\'s VElement.type must be string');
      }

      var ret = '<' + this._tag + ' ';
      var props = this._element.props;
      for (var propsName in props) {
        if (propsName === 'children') {
          continue;
        }
        var propsValue = props[propsName];
        ret += propsName + '=' + propsValue;
      }

      var tagContent = '';
      if (props.children) {
        // TODO: render children
        // children = this._mountChildren(props.children)
      }
      ret += tagContent;
      ret += '</' + this._tag + '>';
      return ret;
    }
  }]);
  return VDomComponent;
}();

var VCompositeComponent = function () {
  function VCompositeComponent(element) {
    classCallCheck(this, VCompositeComponent);

    this._element = element;
    this._rootId = 0;
  }

  createClass(VCompositeComponent, [{
    key: 'mountComponent',
    value: function mountComponent(rootID) {
      this._rootId = rootID;
      if (typeof this._element.type !== 'function') {
        throw new Error('VCompositeComponent\'s VElement.type must be function');
      }

      var Component = this._element.type;
      var props = this._element.props;
      var instance = new Component(props);

      var renderedElement = instance.render();
      var renderedComponent = instantiateVComponent(renderedElement);
      var renderedResult = renderedComponent.mountComponent(rootID);
      return renderedResult;
    }
  }]);
  return VCompositeComponent;
}();

var VElement = function VElement(type, props, key, ref) {
  classCallCheck(this, VElement);

  this.type = type;
  this.props = props;
  this.key = key;
  this.ref = ref;
  console.log(props);
};

function instantiateVComponent(element) {
  var instance = null;
  if (element === null || element === false) {
    instance = new VEmptyComponent();
  }

  if ((typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object') {
    var type = element.type;
    if (typeof type === 'string') {
      instance = new VDomComponent(element);
    } else {
      instance = new VCompositeComponent(element);
    }
  } else if (typeof element === 'string' || typeof element === 'number') {
    instance = new VTextComponent(element);
  }
  return instance;
}

var RESERVED_PROPS = {
  ref: true,
  key: true,
  __self: true,
  __source: true
};

function createElement(type, config) {
  var props = {};
  var key = null;
  var ref = null;

  if (config != null) {
    ref = config.ref === undefined ? null : config.ref;
    key = config.key === undefined ? null : '' + config.key;

    for (var propsName in config) {
      if (config.hasOwnProperty(propsName) || !RESERVED_PROPS.hasOwnProperty(propsName)) {
        props[propsName] = config[propsName];
      }
    }

    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    props.children = children;
  }

  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (var _propsName in defaultProps) {
      if (props[_propsName] === undefined) {
        props[_propsName] = defaultProps[_propsName];
      }
    }
  }

  return new VElement(type, props, key, ref);
}

function extend(obj, props) {
  for (var propsName in props) {
    obj[propsName] = props[propsName];
  }
  return obj;
}

var Component = function () {
  function Component(props, context) {
    classCallCheck(this, Component);

    this.props = props;
    this.context = context;
    this.state = this.state || {};

    this._prevState = null;
    this._renderCallbacks = [];
  }

  createClass(Component, [{
    key: 'setState',
    value: function setState(updater, callback) {
      var state = this.state;
      if (!this._prevState) {
        this._prevState = extend({}, state);
      }

      // When the first argument is an updater function
      if (typeof updater === 'function') {
        updater = updater(state, this.props);
      }
      extend(state, updater);

      if (callback) {
        this._renderCallbacks.push(callback);
      }
    }
  }, {
    key: 'render',
    value: function render() {}
  }]);
  return Component;
}();

function render(element, container) {
  var rootID = 0;
  var mainComponent = instantiateVComponent(element);
  var containerContent = mainComponent.mountComponent(rootID);

  container.innerHTML = containerContent;
}

var index = {
  createElement: createElement,
  Component: Component,
  render: render
};

module.exports = index;
