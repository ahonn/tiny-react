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

var ReactDOMEmptyComponent = function () {
  function ReactDOMEmptyComponent() {
    classCallCheck(this, ReactDOMEmptyComponent);

    this._element = null;
  }

  createClass(ReactDOMEmptyComponent, [{
    key: 'mountComponent',
    value: function mountComponent() {
      return '';
    }
  }]);
  return ReactDOMEmptyComponent;
}();

var ReactDOMTextComponent = function () {
  function ReactDOMTextComponent(text) {
    classCallCheck(this, ReactDOMTextComponent);

    this._element = text;
    this._stringText = '' + text;
    this._rootID = 0;
  }

  createClass(ReactDOMTextComponent, [{
    key: 'mountComponent',
    value: function mountComponent(rootID) {
      this._rootID = rootID;
      var openingComment = '<!-- text: ' + rootID + ' -->';
      var closingComment = '<!-- /text -->';
      return openingComment + this._stringText + closingComment;
    }
  }]);
  return ReactDOMTextComponent;
}();

var ReactDomComponent = function () {
  function ReactDomComponent(element) {
    classCallCheck(this, ReactDomComponent);

    var tag = element.type;

    this._element = element;
    this._tag = tag.toLowerCase();
    this._rootID = 0;
  }

  createClass(ReactDomComponent, [{
    key: '_mountChildren',
    value: function _mountChildren(children) {
      var result = '';
      for (var index in children) {
        var child = children[index];
        var childrenComponent = instantiateReactComponent(child);
        result += childrenComponent.mountComponent(index);
      }
      return result;
    }
  }, {
    key: 'mountComponent',
    value: function mountComponent(rootID) {
      this._rootID = rootID;
      if (typeof this._element.type !== 'string') {
        throw new Error('DOMComponent\'s Element.type must be string');
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
      ret += '>';

      var tagContent = '';
      if (props.children) {
        if (props.children.length === 1 && typeof props.children[0] === 'string') {
          tagContent += props.children[0];
        } else {
          tagContent = this._mountChildren(props.children);
        }
      }
      ret += tagContent;
      ret += '</' + this._tag + '>';
      return ret;
    }
  }]);
  return ReactDomComponent;
}();

var ReactCompositeComponent = function () {
  function ReactCompositeComponent(element) {
    classCallCheck(this, ReactCompositeComponent);

    this._element = element;
    this._rootId = 0;
  }

  createClass(ReactCompositeComponent, [{
    key: 'mountComponent',
    value: function mountComponent(rootID) {
      this._rootId = rootID;
      if (typeof this._element.type !== 'function') {
        throw new Error('CompositeComponent\'s Element.type must be function');
      }

      var Component = this._element.type;
      var props = this._element.props;
      var instance = new Component(props);

      var renderedElement = instance.render();
      var renderedComponent = instantiateReactComponent(renderedElement);
      var renderedResult = renderedComponent.mountComponent(rootID);
      return renderedResult;
    }
  }]);
  return ReactCompositeComponent;
}();

var ReactElement = function ReactElement(type, props, key, ref) {
  classCallCheck(this, ReactElement);

  this.type = type;
  this.props = props;
  this.key = key;
  this.ref = ref;
};

function instantiateReactComponent(element) {
  var instance = null;
  if (element === null || element === false) {
    instance = new ReactDOMEmptyComponent();
  }

  if ((typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object') {
    var type = element.type;
    if (typeof type === 'string') {
      instance = new ReactDomComponent(element);
    } else {
      instance = new ReactCompositeComponent(element);
    }
  } else if (typeof element === 'string' || typeof element === 'number') {
    instance = new ReactDOMTextComponent(element);
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
      if (RESERVED_PROPS.hasOwnProperty(propsName)) {
        continue;
      }

      if (config.hasOwnProperty(propsName)) {
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

  return new ReactElement(type, props, key, ref);
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
  var mainComponent = instantiateReactComponent(element);
  var containerContent = mainComponent.mountComponent(rootID);

  container.innerHTML = containerContent;
}

var React = {
  createElement: createElement,
  Component: Component,
  render: render
};
if (window) {
  window['React'] = React;
}

module.exports = React;
