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

var RESERVED_PROPS = {
  ref: true,
  key: true,
  __self: true,
  __source: true
};

var ReactElement = function ReactElement(type, props, key, ref) {
  classCallCheck(this, ReactElement);

  this.type = type;
  this.props = props;
  this.key = key;
  this.ref = ref;
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

var dirtyComponents = [];
var updateBatchNumber = 0;

var updater = {
  enqueueSetState: function enqueueSetState(instance, partialState) {
    var internalInstance = instance._reactInternalInstance;

    if (!internalInstance) return;
    var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);

    queue.push(partialState);
    console.log(queue);
    enqueueUpdate(internalInstance);
  },

  resetBatchingStrategy: function resetBatchingStrategy() {
    batchingStrategy.isBatchingUpdates = false;
  }
};

var batchingStrategy = {
  isBatchingUpdates: false,

  batchedUpdates: function batchedUpdates(callback, component) {
    var alreadyBatchingUpdates = this.isBatchingUpdates;
    this.isBatchingUpdates = true;

    if (alreadyBatchingUpdates) {
      callback(component);
    } else {
      console.log('runBatchUpdates');
      this.runBatchUpdates();
    }
  },

  runBatchUpdates: function runBatchUpdates() {
    var len = dirtyComponents.length;
    for (var i = 0; i < len; i++) {
      var component = dirtyComponents[i];
      console.log(component.updateComponent);
      component.updateComponent();
    }
  }
};

function enqueueUpdate(component) {
  console.log(batchingStrategy.isBatchingUpdates);
  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }

  dirtyComponents.push(component);
  if (component._updateBatchNumber === null) {
    component._updateBatchNumber = updateBatchNumber + 1;
  }
}

var ReactClassComponent = function ReactClassComponent(props, context) {
  classCallCheck(this, ReactClassComponent);

  this.props = props;
  this.context = context;
  this.state = this.state || {};
  this.updater = updater;
};

ReactClassComponent.prototype.setState = function (partialState, callback) {
  if ((typeof partialState === 'undefined' ? 'undefined' : _typeof(partialState)) !== 'object' && typeof partialState !== 'function') {
    throw new Error('setState(...): takes an object of state variables to update or a ' + 'function which returns an object of state variables.');
  }
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};

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
      return this._stringText;
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
        tagContent = this._mountChildren(props.children);
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
    this._instance = null;

    this._updateBatchNumber = null;
    this._pendingStateQueue = null;
    this._pendingCallback = null;
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
      var ins = new Component(props);

      ins._reactInternalInstance = this;
      this._instance = ins;

      var initialState = ins.state;
      if (initialState === undefined) {
        initialState = ins.state = null;
      }

      var markup = this._initialMount();
      return markup;
    }
  }, {
    key: 'updateComponent',
    value: function updateComponent() {
      console.log('update');
      var ins = this._instance;

      if (this._pendingStateQueue) {
        ins.state = this._processPendingState();
      }
    }
  }, {
    key: '_initialMount',
    value: function _initialMount() {
      var ins = this._instance;

      if (ins.componentWillMount) {
        ins.componentWillMount();

        if (this._pendingStateQueue) {
          ins.state = this._processPendingState();
        }
      }

      var renderedElement = ins.render();
      var renderedComponent = instantiateReactComponent(renderedElement);
      var markup = renderedComponent.mountComponent(this.rootID);

      if (ins.componentDidMount) {
        ins.componentDidMount();

        if (this._pendingStateQueue) {
          ins.state = this._processPendingState();
        }
      }
      ins.updater.resetBatchingStrategy();

      return markup;
    }
  }, {
    key: '_processPendingState',
    value: function _processPendingState() {
      var ins = this._instance;
      var queue = this._pendingStateQueue;
      this._pendingStateQueue = null;

      if (!queue) {
        return ins.state;
      }

      var nextState = ins.state;
      console.log(nextState);
      for (var i = 0; i < queue.length; i++) {
        var partial = queue[i];
        console.log(partial);
        Object.assign(nextState, partial);
      }

      return nextState;
    }
  }]);
  return ReactCompositeComponent;
}();

function instantiateReactComponent(element) {
  var instance = null;
  if (element === null || element === false) {
    instance = new ReactDOMEmptyComponent();
  }

  if (typeof element === 'string' || typeof element === 'number') {
    instance = new ReactDOMTextComponent(element);
  }

  if ((typeof element === 'undefined' ? 'undefined' : _typeof(element)) === 'object') {
    var type = element.type;
    if (typeof type === 'string') {
      instance = new ReactDomComponent(element);
    } else if (typeof type === 'function') {
      instance = new ReactCompositeComponent(element);
    }
  }
  return instance;
}

function render(element, container) {
  var rootID = 0;
  var mainComponent = instantiateReactComponent(element);
  var containerContent = mainComponent.mountComponent(rootID);

  container.innerHTML = containerContent;
}

var React = {
  render: render,
  createElement: createElement,
  Component: ReactClassComponent
};

if (window) {
  window['React'] = React;
}

module.exports = React;
