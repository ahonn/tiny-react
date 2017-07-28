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

    this._currentElement = null;
    this._hostNode = null;
    this._hostParent = null;
    this._hostContainerInfo = null;
    this._domId = 0;
  }

  createClass(ReactDOMEmptyComponent, [{
    key: 'mountComponent',
    value: function mountComponent(hostParent, hostContainerInfo, context) {
      this._context = context;
      this._hostParent = hostParent;
      this._hostContainerInfo = hostContainerInfo;
      this._domId = hostContainerInfo._idCounter++;

      return '';
    }
  }]);
  return ReactDOMEmptyComponent;
}();

var ReactDOMTextComponent = function () {
  function ReactDOMTextComponent(text) {
    classCallCheck(this, ReactDOMTextComponent);

    this._currentElement = text;
    this._stringText = '' + text;
    this._hostNode = null;
    this._hostParent = null;

    this.domID = 0;
    this._mountIndex = 0;
  }

  createClass(ReactDOMTextComponent, [{
    key: 'mountComponent',
    value: function mountComponent(hostParent, hostContainerInfo) {
      var domID = hostContainerInfo._idCounter++;

      this._domID = domID;
      this._hostParent = hostParent;

      var openingValue = '<!-- react-text: ' + domID + ' -->';
      var closingValue = '<!-- /reatc-text -->';
      return openingValue + this._stringText + closingValue;
    }
  }]);
  return ReactDOMTextComponent;
}();

var globalIdCounter = 1;

var ReactDomComponent = function () {
  function ReactDomComponent(element) {
    classCallCheck(this, ReactDomComponent);

    var tag = element.type;

    this._currentElement = element;
    this._tag = tag.toLowerCase();
    this._domID = 0;
    this._rootNodeID = 0;
    this._hostParent = null;
    this._hostContainerInfo = null;
    this._renderedChildren = null;
  }

  createClass(ReactDomComponent, [{
    key: '_mountChildren',
    value: function _mountChildren(props, context) {
      var innerHTML = props.dangerouslySetInnerHTML;
      if (innerHTML == null) {
        innerHTML = '';
        this._renderedChildren = [];
        var children = props.children;
        for (var index in children) {
          var child = children[index];
          var childrenComponent = instantiateReactComponent(child);
          this._renderedChildren.push(childrenComponent);
          innerHTML += childrenComponent.mountComponent(this._hostParent, this._hostContainerInfo, context);
        }
      }

      return innerHTML;
    }
  }, {
    key: 'mountComponent',
    value: function mountComponent(hostParent, hostContainerInfo, context) {
      this._hostParent = hostParent;
      this._hostContainerInfo = hostContainerInfo;
      this._domID = hostContainerInfo._idCounter++;
      this._rootNodeID = globalIdCounter++;

      var ret = '<' + this._tag + ' ';
      var props = this._currentElement.props;
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
        tagContent = this._mountChildren(props, context);
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

    this._currentElement = element;
    this._rootNodeId = 0;
    this._instance = null;
    this._hostParent = null;
    this._hostContainerInfo = null;
    this._context = null;

    this._renderedComponent = null;
    this._updateBatchNumber = null;
    this._pendingStateQueue = null;
    this._pendingCallbacks = null;
  }

  createClass(ReactCompositeComponent, [{
    key: 'mountComponent',
    value: function mountComponent(hostParent, hostContainerInfo, context) {
      this._context = context;
      this._hostParent = hostParent;
      this._hostContainerInfo = hostContainerInfo;

      var Component = this._currentElement.type;
      var publicProps = this._currentElement.props;
      var publicContext = this._processContext(context);
      var ins = new Component(publicProps, publicContext);

      ins.props = publicProps;
      ins.context = publicContext;
      ins.refs = {};

      this._instance = ins;
      ins._reactInternalInstance = this;

      var initialState = ins.state;
      if (initialState === undefined) {
        ins.state = initialState = null;
      }

      var markup = this._initialMount(hostParent, hostContainerInfo, context);
      return markup;
    }
  }, {
    key: 'updateComponent',
    value: function updateComponent() {}
  }, {
    key: '_initialMount',
    value: function _initialMount(hostParent, hostContainerInfo, context) {
      var ins = this._instance;

      if (ins.componentWillMount) {
        ins.componentWillMount();

        if (this._pendingStateQueue) {
          ins.state = this._processPendingState(ins.props, ins.context);
        }
      }

      var renderedElement = ins.render();
      var renderedComponent = instantiateReactComponent(renderedElement);

      this._renderedComponent = renderedComponent;
      var childContext = this._processChildContext(context);
      var markup = renderedComponent.mountComponent(hostParent, hostContainerInfo, childContext);

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
      for (var i = 0; i < queue.length; i++) {
        var partial = queue[i];
        Object.assign(nextState, partial);
      }

      return nextState;
    }
  }, {
    key: '_processContext',
    value: function _processContext(context) {
      var Component = this._currentElement.type;
      var contextTypes = Component.contextTypes;
      if (!contextTypes) {
        return {};
      }
      var maskedContext = {};
      for (var name in contextTypes) {
        maskedContext[name] = context[name];
      }
      return maskedContext;
    }
  }, {
    key: '_processChildContext',
    value: function _processChildContext(currentContext) {
      var ins = this._instance;
      var childContext = null;

      if (ins.getChildContext) {
        childContext = ins.getChildContext();
      }
      if (childContext) {
        return Object.assign({}, currentContext, childContext);
      }
      return currentContext;
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

var ReactDOM = {
  render: function render(nextElement, container, callback) {
    var componentInstance = instantiateReactComponent(nextElement);
    var containerInfo = _createContainerInfo(componentInstance, container);
    var markup = componentInstance.mountComponent(null, containerInfo, {});

    container.innerHTML = markup;

    if (callback) {
      callback.call(componentInstance);
    }
  }
};

function _createContainerInfo(topLevelWarapper, node) {
  var info = {
    _topLevelWarapper: topLevelWarapper,
    _idCounter: 1,
    _ownerDocument: node ? node.nodeType === 9 ? node : node.ownerDocument : null,
    _node: node
  };

  return info;
}

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

ReactElement.createElement = function (type, config) {
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
};

var dirtyComponents = [];
var updateBatchNumber = 0;

var updater = {
  enqueueSetState: function enqueueSetState(instance, partialState) {
    var internalInstance = instance._reactInternalInstance;

    if (!internalInstance) return;
    var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);

    queue.push(partialState);
    enqueueUpdate(internalInstance);
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
      this.runBatchUpdates();
    }
  },

  runBatchUpdates: function runBatchUpdates() {
    var len = dirtyComponents.length;
    for (var i = 0; i < len; i++) {
      var component = dirtyComponents[i];
      component.updateComponent();
    }
  }
};

function enqueueUpdate(component) {
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
  this.refs = {};
  this.state = this.state || {};
  this.updater = updater;
};

ReactClassComponent.prototype.isReactComponent = {};

ReactClassComponent.prototype.setState = function (partialState, callback) {
  if ((typeof partialState === 'undefined' ? 'undefined' : _typeof(partialState)) !== 'object' && typeof partialState !== 'function') {
    throw new Error('setState(...): takes an object of state variables to update or a ' + 'function which returns an object of state variables.');
  }
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};

var render = ReactDOM.render;
var createElement = ReactElement.createElement;

var React = {
  render: render,
  createElement: createElement,
  Component: ReactClassComponent
};

if (window) {
  window['React'] = React;
}

module.exports = React;
