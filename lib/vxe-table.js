"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
exports.default = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils/methods/xe-utils"));

var _vXETable = _interopRequireWildcard(require("./v-x-e-table"));

Object.keys(_vXETable).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _vXETable[key];
    }
  });
});

var _table = _interopRequireWildcard(require("./table"));

Object.keys(_table).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _table[key];
    }
  });
});

var _column = _interopRequireWildcard(require("./column"));

Object.keys(_column).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _column[key];
    }
  });
});

var _header = _interopRequireWildcard(require("./header"));

Object.keys(_header).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _header[key];
    }
  });
});

var _pager = _interopRequireWildcard(require("./pager"));

Object.keys(_pager).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _pager[key];
    }
  });
});

var _zhCN = _interopRequireDefault(require("./locale/lang/zh-CN"));

var _body = require("./body");

Object.keys(_body).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _body[key];
    }
  });
});

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Footer from './footer'
// import Filter from './filter'
// import Grid from './grid'
// import Menu from './menu'
// import Toolbar from './toolbar'
// import Checkbox from './checkbox'
// import Radio from './radio'
// import Input from './input'
// import Textarea from './textarea'
// import Button from './button'
// import Modal from './modal'
// import Tooltip from './tooltip'
// import Form from './form'
// import Select from './select'
// import Switch from './switch'
// import List from './list'
// import Pulldown from './pulldown'
// import Edit from './edit'
// import Export from './export'
// import Custom from './custom'
// import Keyboard from './keyboard'
// import Validator from './validator'
// 按需加载的组件
var components = [// 模块
_column.default, _header.default, // Footer,
// Filter,
// Grid,
// Menu,
// Toolbar,
_pager.default, // Checkbox,
// Radio,
// Input,
// Textarea,
// Button,
// Modal,
// Tooltip,
// Form,
// Select,
// Switch,
// List,
// Pulldown,
// Edit,
// Export,
// Custom,
// Keyboard,
// Validator,
// 核心
_table.default]; // 默认安装

function install(Vue, options) {
  if (_xeUtils.default.isPlainObject(options)) {
    _vXETable.default.setup(options);
  }

  components.map(function (component) {
    return component.install(Vue);
  });
} // 默认中文


_vXETable.default.setup({
  i18n: function i18n(key) {
    return _xeUtils.default.get(_zhCN.default, key);
  }
});

_vXETable.default.install = install;

if (typeof window !== 'undefined' && window.Vue && window.Vue.use) {
  window.Vue.use(_vXETable.default);
}

var _default = _vXETable.default;
exports.default = _default;