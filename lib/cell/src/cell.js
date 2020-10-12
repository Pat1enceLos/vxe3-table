"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Cell = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils/methods/xe-utils"));

var _conf = _interopRequireDefault(require("../../conf"));

var _vXETable = _interopRequireDefault(require("../../v-x-e-table"));

var _tools = require("../../tools");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderTitleContent(h, content) {
  return [h('span', {
    class: 'vxe-cell--title'
  }, content)];
}

var Cell = {
  createColumn: function createColumn($xetable, _vm) {
    var type = _vm.type,
        sortable = _vm.sortable,
        remoteSort = _vm.remoteSort,
        filters = _vm.filters,
        editRender = _vm.editRender,
        treeNode = _vm.treeNode;
    var editConfig = $xetable.editConfig,
        editOpts = $xetable.editOpts,
        checkboxOpts = $xetable.checkboxOpts;
    var renMaps = {
      renderHeader: this.renderDefaultHeader,
      renderCell: treeNode ? this.renderTreeCell : this.renderDefaultCell,
      renderFooter: this.renderDefaultFooter
    };

    switch (type) {
      case 'seq':
        renMaps.renderHeader = this.renderIndexHeader;
        renMaps.renderCell = treeNode ? this.renderTreeIndexCell : this.renderIndexCell;
        break;

      case 'radio':
        renMaps.renderHeader = this.renderRadioHeader;
        renMaps.renderCell = treeNode ? this.renderTreeRadioCell : this.renderRadioCell;
        break;

      case 'checkbox':
        renMaps.renderHeader = this.renderSelectionHeader;
        renMaps.renderCell = checkboxOpts.checkField ? treeNode ? this.renderTreeSelectionCellByProp : this.renderSelectionCellByProp : treeNode ? this.renderTreeSelectionCell : this.renderSelectionCell;
        break;

      case 'expand':
        renMaps.renderCell = this.renderExpandCell;
        renMaps.renderData = this.renderExpandData;
        break;

      case 'html':
        renMaps.renderCell = treeNode ? this.renderTreeHTMLCell : this.renderHTMLCell;

        if (filters && (sortable || remoteSort)) {
          renMaps.renderHeader = this.renderSortAndFilterHeader;
        } else if (sortable || remoteSort) {
          renMaps.renderHeader = this.renderSortHeader;
        } else if (filters) {
          renMaps.renderHeader = this.renderFilterHeader;
        }

        break;

      default:
        if (editConfig && editRender) {
          renMaps.renderHeader = this.renderEditHeader;
          renMaps.renderCell = editOpts.mode === 'cell' ? treeNode ? this.renderTreeCellEdit : this.renderCellEdit : treeNode ? this.renderTreeRowEdit : this.renderRowEdit;
        } else if (filters && (sortable || remoteSort)) {
          renMaps.renderHeader = this.renderSortAndFilterHeader;
        } else if (sortable || remoteSort) {
          renMaps.renderHeader = this.renderSortHeader;
        } else if (filters) {
          renMaps.renderHeader = this.renderFilterHeader;
        }

    }

    return _tools.UtilTools.getColumnConfig($xetable, _vm, renMaps);
  },

  /**
   * 单元格
   */
  renderDefaultHeader: function renderDefaultHeader(h, params) {
    var $table = params.$table,
        column = params.column;
    var slots = column.slots,
        own = column.own;
    var renderOpts = own.editRender || own.cellRender;

    if (slots && slots.header) {
      return renderTitleContent(h, slots.header.call($table, params, h));
    }

    if (renderOpts) {
      var compConf = _vXETable.default.renderer.get(renderOpts.name);

      if (compConf && compConf.renderHeader) {
        return renderTitleContent(h, compConf.renderHeader.call($table, h, renderOpts, params, {
          $grid: $table.$xegrid,
          $table: $table
        }));
      }
    }

    return renderTitleContent(h, _tools.UtilTools.formatText(column.getTitle(), 1));
  },
  renderDefaultCell: function renderDefaultCell(h, params) {
    var $table = params.$table,
        row = params.row,
        column = params.column;
    var slots = column.slots,
        own = column.own;
    var renderOpts = own.editRender || own.cellRender;

    if (slots && slots.default) {
      return slots.default.call($table, params, h);
    }

    if (renderOpts) {
      var funName = own.editRender ? 'renderCell' : 'renderDefault';

      var compConf = _vXETable.default.renderer.get(renderOpts.name);

      if (compConf && compConf[funName]) {
        return compConf[funName].call($table, h, renderOpts, Object.assign({
          $type: own.editRender ? 'edit' : 'cell'
        }, params), {
          $grid: $table.$xegrid,
          $table: $table
        });
      }
    }

    return [_tools.UtilTools.formatText(_tools.UtilTools.getCellLabel(row, column, params), 1)];
  },
  renderTreeCell: function renderTreeCell(h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderDefaultCell.call(this, h, params));
  },
  renderDefaultFooter: function renderDefaultFooter(h, params) {
    var $table = params.$table,
        column = params.column,
        _columnIndex = params._columnIndex,
        items = params.items;
    var slots = column.slots,
        own = column.own;
    var renderOpts = own.editRender || own.cellRender;

    if (slots && slots.footer) {
      return slots.footer.call($table, params, h);
    }

    if (renderOpts) {
      var compConf = _vXETable.default.renderer.get(renderOpts.name);

      if (compConf && compConf.renderFooter) {
        return compConf.renderFooter.call($table, h, renderOpts, params, {
          $grid: $table.$xegrid,
          $table: $table
        });
      }
    }

    return [_tools.UtilTools.formatText(items[_columnIndex], 1)];
  },

  /**
   * 树节点
   */
  renderTreeIcon: function renderTreeIcon(h, params, cellVNodes) {
    var $table = params.$table,
        isHidden = params.isHidden;
    var treeOpts = $table.treeOpts,
        treeExpandeds = $table.treeExpandeds,
        treeLazyLoadeds = $table.treeLazyLoadeds;
    var row = params.row,
        column = params.column,
        level = params.level;
    var slots = column.slots;
    var children = treeOpts.children,
        hasChild = treeOpts.hasChild,
        indent = treeOpts.indent,
        lazy = treeOpts.lazy,
        trigger = treeOpts.trigger,
        iconLoaded = treeOpts.iconLoaded,
        iconOpen = treeOpts.iconOpen,
        iconClose = treeOpts.iconClose;
    var rowChilds = row[children];
    var hasLazyChilds = false;
    var isAceived = false;
    var isLazyLoaded = false;
    var on = {};

    if (slots && slots.icon) {
      return slots.icon.call($table, params, h, cellVNodes);
    }

    if (!isHidden) {
      isAceived = treeExpandeds.indexOf(row) > -1;

      if (lazy) {
        isLazyLoaded = treeLazyLoadeds.indexOf(row) > -1;
        hasLazyChilds = row[hasChild];
      }
    }

    if (!trigger || trigger === 'default') {
      on.click = function (evnt) {
        return $table.triggerTreeExpandEvent(evnt, params);
      };
    }

    return [h('div', {
      class: ['vxe-cell--tree-node', {
        'is--active': isAceived
      }],
      style: {
        paddingLeft: "".concat(level * indent, "px")
      }
    }, [rowChilds && rowChilds.length || hasLazyChilds ? [h('div', {
      class: 'vxe-tree--btn-wrapper',
      on: on
    }, [h('i', {
      class: ['vxe-tree--node-btn', isLazyLoaded ? iconLoaded || _conf.default.icon.TABLE_TREE_LOADED : isAceived ? iconOpen || _conf.default.icon.TABLE_TREE_OPEN : iconClose || _conf.default.icon.TABLE_TREE_CLOSE]
    })])] : null, h('div', {
      class: 'vxe-tree-cell'
    }, cellVNodes)])];
  },

  /**
   * 索引
   */
  renderIndexHeader: function renderIndexHeader(h, params) {
    var $table = params.$table,
        column = params.column;
    var slots = column.slots;
    return renderTitleContent(h, slots && slots.header ? slots.header.call($table, params, h) : _tools.UtilTools.formatText(column.getTitle(), 1));
  },
  renderIndexCell: function renderIndexCell(h, params) {
    var $table = params.$table,
        column = params.column;
    var seqOpts = $table.seqOpts;
    var slots = column.slots;

    if (slots && slots.default) {
      return slots.default.call($table, params, h);
    }

    var $seq = params.$seq,
        seq = params.seq,
        level = params.level;
    var seqMethod = seqOpts.seqMethod || column.seqMethod;
    return [_tools.UtilTools.formatText(seqMethod ? seqMethod(params) : level ? "".concat($seq, ".").concat(seq) : seqOpts.startIndex + seq, 1)];
  },
  renderTreeIndexCell: function renderTreeIndexCell(h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderIndexCell(h, params));
  },

  /**
   * 单选
   */
  renderRadioHeader: function renderRadioHeader(h, params) {
    var $table = params.$table,
        column = params.column;
    var slots = column.slots;
    return renderTitleContent(h, slots && slots.header ? slots.header.call($table, params, h) : [h('span', {
      class: 'vxe-radio--label'
    }, _tools.UtilTools.formatText(column.getTitle(), 1))]);
  },
  renderRadioCell: function renderRadioCell(h, params) {
    var $table = params.$table,
        column = params.column,
        isHidden = params.isHidden;
    var radioOpts = $table.radioOpts,
        selectRow = $table.selectRow;
    var slots = column.slots;
    var labelField = radioOpts.labelField,
        checkMethod = radioOpts.checkMethod;
    var row = params.row;
    var isChecked = row === selectRow;
    var isDisabled = !!checkMethod;
    var on;

    if (!isHidden) {
      on = {
        click: function click(evnt) {
          if (!isDisabled) {
            $table.triggerRadioRowEvent(evnt, params);
          }
        }
      };

      if (checkMethod) {
        isDisabled = !checkMethod({
          row: row
        });
      }
    }

    return [h('span', {
      class: ['vxe-cell--radio', {
        'is--checked': isChecked,
        'is--disabled': isDisabled
      }],
      on: on
    }, [h('span', {
      class: 'vxe-radio--icon vxe-radio--checked-icon'
    }), h('span', {
      class: 'vxe-radio--icon vxe-radio--unchecked-icon'
    })].concat(slots && slots.default ? slots.default.call($table, params, h) : labelField ? [h('span', {
      class: 'vxe-radio--label'
    }, _xeUtils.default.get(row, labelField))] : []))];
  },
  renderTreeRadioCell: function renderTreeRadioCell(h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderRadioCell(h, params));
  },

  /**
   * 多选
   */
  renderSelectionHeader: function renderSelectionHeader(h, params) {
    var $table = params.$table,
        column = params.column,
        isHidden = params.isHidden;
    var isIndeterminate = $table.isIndeterminate,
        isAllCheckboxDisabled = $table.isAllCheckboxDisabled;
    var slots = column.slots;
    var checkboxOpts = $table.checkboxOpts;
    var headerTitle = column.getTitle();
    var isChecked = false;
    var on;

    if (checkboxOpts.checkStrictly ? !checkboxOpts.showHeader : checkboxOpts.showHeader === false) {
      return renderTitleContent(h, slots && slots.header ? slots.header.call($table, params, h) : [h('span', {
        class: 'vxe-checkbox--label'
      }, headerTitle)]);
    }

    if (!isHidden) {
      isChecked = isAllCheckboxDisabled ? false : $table.isAllSelected;
      on = {
        click: function click(evnt) {
          if (!isAllCheckboxDisabled) {
            $table.triggerCheckAllEvent(evnt, !isChecked);
          }
        }
      };
    }

    return renderTitleContent(h, [h('span', {
      class: ['vxe-cell--checkbox', {
        'is--checked': isChecked,
        'is--disabled': isAllCheckboxDisabled,
        'is--indeterminate': isIndeterminate
      }],
      attrs: {
        title: _conf.default.i18n('vxe.table.allTitle')
      },
      on: on
    }, [h('span', {
      class: 'vxe-checkbox--icon vxe-checkbox--checked-icon'
    }), h('span', {
      class: 'vxe-checkbox--icon vxe-checkbox--unchecked-icon'
    }), h('span', {
      class: 'vxe-checkbox--icon vxe-checkbox--indeterminate-icon'
    })].concat(slots && slots.header ? slots.header.call($table, params, h) : headerTitle ? [h('span', {
      class: 'vxe-checkbox--label'
    }, headerTitle)] : []))]);
  },
  renderSelectionCell: function renderSelectionCell(h, params) {
    var $table = params.$table,
        row = params.row,
        column = params.column,
        isHidden = params.isHidden;
    var treeConfig = $table.treeConfig,
        treeIndeterminates = $table.treeIndeterminates;
    var _$table$checkboxOpts = $table.checkboxOpts,
        labelField = _$table$checkboxOpts.labelField,
        checkMethod = _$table$checkboxOpts.checkMethod;
    var slots = column.slots;
    var indeterminate = false;
    var isChecked = false;
    var isDisabled = !!checkMethod;
    var on;

    if (!isHidden) {
      isChecked = $table.selection.indexOf(row) > -1;
      on = {
        click: function click(evnt) {
          if (!isDisabled) {
            $table.triggerCheckRowEvent(evnt, params, !isChecked);
          }
        }
      };

      if (checkMethod) {
        isDisabled = !checkMethod({
          row: row
        });
      }

      if (treeConfig) {
        indeterminate = treeIndeterminates.indexOf(row) > -1;
      }
    }

    return [h('span', {
      class: ['vxe-cell--checkbox', {
        'is--checked': isChecked,
        'is--disabled': isDisabled,
        'is--indeterminate': indeterminate
      }],
      on: on
    }, [h('span', {
      class: 'vxe-checkbox--icon vxe-checkbox--checked-icon'
    }), h('span', {
      class: 'vxe-checkbox--icon vxe-checkbox--unchecked-icon'
    }), h('span', {
      class: 'vxe-checkbox--icon vxe-checkbox--indeterminate-icon'
    })].concat(slots && slots.default ? slots.default.call($table, params, h) : labelField ? [h('span', {
      class: 'vxe-checkbox--label'
    }, _xeUtils.default.get(row, labelField))] : []))];
  },
  renderTreeSelectionCell: function renderTreeSelectionCell(h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderSelectionCell(h, params));
  },
  renderSelectionCellByProp: function renderSelectionCellByProp(h, params) {
    var $table = params.$table,
        row = params.row,
        column = params.column,
        isHidden = params.isHidden;
    var treeConfig = $table.treeConfig,
        treeIndeterminates = $table.treeIndeterminates;
    var _$table$checkboxOpts2 = $table.checkboxOpts,
        labelField = _$table$checkboxOpts2.labelField,
        property = _$table$checkboxOpts2.checkField,
        halfField = _$table$checkboxOpts2.halfField,
        checkMethod = _$table$checkboxOpts2.checkMethod;
    var slots = column.slots;
    var indeterminate = false;
    var isChecked = false;
    var isDisabled = !!checkMethod;
    var on;

    if (!isHidden) {
      isChecked = _xeUtils.default.get(row, property);
      on = {
        click: function click(evnt) {
          if (!isDisabled) {
            $table.triggerCheckRowEvent(evnt, params, !isChecked);
          }
        }
      };

      if (checkMethod) {
        isDisabled = !checkMethod({
          row: row
        });
      }

      if (treeConfig) {
        indeterminate = treeIndeterminates.indexOf(row) > -1;
      }
    }

    return [h('span', {
      class: ['vxe-cell--checkbox', {
        'is--checked': isChecked,
        'is--disabled': isDisabled,
        'is--indeterminate': halfField && !isChecked ? row[halfField] : indeterminate
      }],
      on: on
    }, [h('span', {
      class: 'vxe-checkbox--icon vxe-checkbox--checked-icon'
    }), h('span', {
      class: 'vxe-checkbox--icon vxe-checkbox--unchecked-icon'
    }), h('span', {
      class: 'vxe-checkbox--icon vxe-checkbox--indeterminate-icon'
    })].concat(slots && slots.default ? slots.default.call($table, params, h) : labelField ? [h('span', {
      class: 'vxe-checkbox--label'
    }, _xeUtils.default.get(row, labelField))] : []))];
  },
  renderTreeSelectionCellByProp: function renderTreeSelectionCellByProp(h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderSelectionCellByProp(h, params));
  },

  /**
   * 展开行
   */
  renderExpandCell: function renderExpandCell(h, params) {
    var $table = params.$table,
        isHidden = params.isHidden,
        row = params.row,
        column = params.column;
    var expandOpts = $table.expandOpts,
        rowExpandeds = $table.rowExpandeds,
        expandLazyLoadeds = $table.expandLazyLoadeds;
    var lazy = expandOpts.lazy,
        labelField = expandOpts.labelField,
        iconLoaded = expandOpts.iconLoaded,
        iconOpen = expandOpts.iconOpen,
        iconClose = expandOpts.iconClose,
        visibleMethod = expandOpts.visibleMethod;
    var slots = column.slots;
    var isAceived = false;
    var isLazyLoaded = false;

    if (slots && slots.icon) {
      return slots.icon.call($table, params, h);
    }

    if (!isHidden) {
      isAceived = rowExpandeds.indexOf(params.row) > -1;

      if (lazy) {
        isLazyLoaded = expandLazyLoadeds.indexOf(row) > -1;
      }
    }

    return [!visibleMethod || visibleMethod(params) ? h('span', {
      class: ['vxe-table--expanded', {
        'is--active': isAceived
      }],
      on: {
        click: function click(evnt) {
          $table.triggerRowExpandEvent(evnt, params);
        }
      }
    }, [h('i', {
      class: ['vxe-table--expand-btn', isLazyLoaded ? iconLoaded || _conf.default.icon.TABLE_EXPAND_LOADED : isAceived ? iconOpen || _conf.default.icon.TABLE_EXPAND_OPEN : iconClose || _conf.default.icon.TABLE_EXPAND_CLOSE]
    })]) : null, h('span', {
      class: 'vxe-table--expand-label'
    }, slots && slots.default ? slots.default.call($table, params, h) : labelField ? _xeUtils.default.get(row, labelField) : null)];
  },
  renderExpandData: function renderExpandData(h, params) {
    var $table = params.$table,
        column = params.column;
    var slots = column.slots,
        contentRender = column.contentRender;

    if (slots && slots.content) {
      return slots.content.call($table, params, h);
    }

    if (contentRender) {
      var compConf = _vXETable.default.renderer.get(contentRender.name);

      if (compConf && compConf.renderExpand) {
        return compConf.renderExpand.call($table, h, contentRender, params, {
          $grid: $table.$xegrid,
          $table: $table
        });
      }
    }

    return [];
  },

  /**
   * HTML 标签
   */
  renderHTMLCell: function renderHTMLCell(h, params) {
    var $table = params.$table,
        row = params.row,
        column = params.column;
    var slots = column.slots;

    if (slots && slots.default) {
      return slots.default.call($table, params, h);
    }

    return [h('span', {
      class: 'vxe-cell--html',
      domProps: {
        innerHTML: _tools.UtilTools.formatText(_tools.UtilTools.getCellLabel(row, column, params), 1)
      }
    })];
  },
  renderTreeHTMLCell: function renderTreeHTMLCell(h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderHTMLCell(h, params));
  },

  /**
   * 排序和筛选
   */
  renderSortAndFilterHeader: function renderSortAndFilterHeader(h, params) {
    return Cell.renderDefaultHeader(h, params).concat(Cell.renderSortIcon(h, params)).concat(Cell.renderFilterIcon(h, params));
  },

  /**
   * 排序
   */
  renderSortHeader: function renderSortHeader(h, params) {
    return Cell.renderDefaultHeader(h, params).concat(Cell.renderSortIcon(h, params));
  },
  renderSortIcon: function renderSortIcon(h, params) {
    var $table = params.$table,
        column = params.column;
    var _$table$sortOpts = $table.sortOpts,
        showIcon = _$table$sortOpts.showIcon,
        iconAsc = _$table$sortOpts.iconAsc,
        iconDesc = _$table$sortOpts.iconDesc;
    return showIcon === false ? [] : [h('span', {
      class: 'vxe-cell--sort'
    }, [h('i', {
      class: ['vxe-sort--asc-btn', iconAsc || _conf.default.icon.TABLE_SORT_ASC, {
        'sort--active': column.order === 'asc'
      }],
      attrs: {
        title: _conf.default.i18n('vxe.table.sortAsc')
      },
      on: {
        click: function click(evnt) {
          $table.triggerSortEvent(evnt, column, 'asc');
        }
      }
    }, [h('svg', {
      attrs: {
        viewBox: '0 0 16 8',
        width: '16px',
        height: '8px'
      },
      domProps: {
        innerHTML: "\n                <g id=\"\u753B\u677F\" stroke=\"none\" stroke-width=\"1\" fill-rule=\"evenodd\">\n                    <path d=\"M7.55803708,2.49069051 L4.63890187,6.19028212 C4.4678494,6.40706696 4.50492282,6.72147121 4.72170766,6.89252367 C4.80993448,6.96213839 4.91904146,7 5.03142554,7 L10.9507721,7 C11.2269145,7 11.4507721,6.77614237 11.4507721,6.5 C11.4507721,6.38532418 11.4113531,6.27413338 11.3391221,6.18506466 L8.33891077,2.48547306 C8.16497679,2.27099327 7.85010521,2.2381244 7.63562542,2.41205838 C7.60693772,2.43532288 7.58091617,2.4616945 7.55803708,2.49069051 Z\" id=\"up/fill\"></path>\n                </g>\n              "
      }
    })]), h('i', {
      class: ['vxe-sort--desc-btn', iconDesc || _conf.default.icon.TABLE_SORT_DESC, {
        'sort--active': column.order === 'desc'
      }],
      attrs: {
        title: _conf.default.i18n('vxe.table.sortDesc')
      },
      on: {
        click: function click(evnt) {
          $table.triggerSortEvent(evnt, column, 'desc');
        }
      }
    }, [h('svg', {
      attrs: {
        viewBox: '0 0 16 8',
        width: '16px',
        height: '8px'
      },
      domProps: {
        innerHTML: "\n                <g id=\"\u753B\u677F\" stroke=\"none\" stroke-width=\"1\" fill-rule=\"evenodd\">\n                  <path d=\"M7.55803708,1.49069051 L4.63890187,5.19028212 C4.4678494,5.40706696 4.50492282,5.72147121 4.72170766,5.89252367 C4.80993448,5.96213839 4.91904146,6 5.03142554,6 L10.9507721,6 C11.2269145,6 11.4507721,5.77614237 11.4507721,5.5 C11.4507721,5.38532418 11.4113531,5.27413338 11.3391221,5.18506466 L8.33891077,1.48547306 C8.16497679,1.27099327 7.85010521,1.2381244 7.63562542,1.41205838 C7.60693772,1.43532288 7.58091617,1.4616945 7.55803708,1.49069051 Z\" id=\"down/fill\" transform=\"translate(8.000000, 3.500000) scale(1, -1) translate(-8.000000, -3.500000) \"></path>\n                </g>\n              "
      }
    })])])];
  },

  /**
   * 筛选
   */
  renderFilterHeader: function renderFilterHeader(h, params) {
    return Cell.renderDefaultHeader(h, params).concat(Cell.renderFilterIcon(h, params));
  },
  renderFilterIcon: function renderFilterIcon(h, params) {
    var $table = params.$table,
        column = params.column,
        hasFilter = params.hasFilter;
    var filterStore = $table.filterStore,
        filterOpts = $table.filterOpts;
    var showIcon = filterOpts.showIcon,
        iconNone = filterOpts.iconNone,
        iconMatch = filterOpts.iconMatch;
    return showIcon === false ? [] : [h('span', {
      class: ['vxe-cell--filter', {
        'is--active': filterStore.visible && filterStore.column === column
      }]
    }, [h('i', {
      class: ['vxe-filter--btn', hasFilter ? iconMatch || _conf.default.icon.TABLE_FILTER_MATCH : iconNone || _conf.default.icon.TABLE_FILTER_NONE],
      attrs: {
        title: _conf.default.i18n('vxe.table.filter')
      },
      on: {
        click: function click(evnt) {
          $table.triggerFilterEvent(evnt, params.column, params);
        }
      }
    }, [h('svg', {
      attrs: {
        viewBox: '0 0 24 24',
        width: '100%',
        height: '100%'
      },
      domProps: {
        innerHTML: "<g id=\"icon-/-filter\" stroke=\"none\" stroke-width=\"1\" fill-rule=\"evenodd\">\n                <path d=\"M9.14662963,18.2982456 C9.14662963,18.6864035 9.39513883,19 9.70315024,19 L14.2953204,19 C14.6033318,19 14.851841,18.6864035 14.851841,18.2982456 L14.851841,14.4646233 L9.14662963,14.4646233 L9.14662963,18.2982456 Z M17.5210491,5 L6.47763999,5 C6.11012638,5 5.88061787,5.50377358 6.06512471,5.90566038 L9.12413103,13 L14.8681932,13 L17.9365645,5.90566038 C18.1180712,5.50377358 17.8885627,5 17.5210491,5 Z\"></path>\n              </g>"
      }
    })])])];
  },

  /**
   * 可编辑
   */
  renderEditHeader: function renderEditHeader(h, params) {
    var $table = params.$table,
        column = params.column;
    var editRules = $table.editRules,
        editOpts = $table.editOpts;
    var sortable = column.sortable,
        remoteSort = column.remoteSort,
        filters = column.filters;
    var isRequired;

    if (editRules) {
      var columnRules = _xeUtils.default.get(editRules, params.column.property);

      if (columnRules) {
        isRequired = columnRules.some(function (rule) {
          return rule.required;
        });
      }
    }

    return [isRequired ? h('i', {
      class: 'vxe-required-icon'
    }) : null, editOpts.showIcon === false ? null : h('i', {
      class: ['vxe-edit-icon', editOpts.icon || _conf.default.icon.TABLE_EDIT]
    })].concat(Cell.renderDefaultHeader(h, params)).concat(sortable || remoteSort ? Cell.renderSortIcon(h, params) : []).concat(filters ? Cell.renderFilterIcon(h, params) : []);
  },
  // 行格编辑模式
  renderRowEdit: function renderRowEdit(h, params) {
    var $table = params.$table;
    var actived = $table.editStore.actived;
    return Cell.runRenderer(h, params, this, actived && actived.row === params.row);
  },
  renderTreeRowEdit: function renderTreeRowEdit(h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderRowEdit(h, params));
  },
  // 单元格编辑模式
  renderCellEdit: function renderCellEdit(h, params) {
    var $table = params.$table;
    var actived = $table.editStore.actived;

    if (params.$table.editConfig.trigger === 'click') {
      // show edit at the begining when single click
      return Cell.runRenderer(h, params, this, true);
    } else {
      return Cell.runRenderer(h, params, this, actived && actived.row === params.row && actived.column === params.column);
    }
  },
  renderTreeCellEdit: function renderTreeCellEdit(h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderCellEdit(h, params));
  },
  runRenderer: function runRenderer(h, params, _vm, isEdit) {
    var $table = params.$table,
        row = params.row,
        column = params.column;
    var slots = column.slots,
        own = column.own,
        formatter = column.formatter;
    var editRender = own.editRender;

    var compConf = _vXETable.default.renderer.get(editRender.name);

    if (isEdit) {
      if (slots && slots.edit) {
        return slots.edit.call($table, params, h);
      }

      return compConf && compConf.renderEdit ? compConf.renderEdit.call($table, h, editRender, Object.assign({
        $type: 'edit'
      }, params), {
        $grid: $table.$xegrid,
        $table: $table
      }) : [];
    }

    if (slots && slots.default) {
      return slots.default.call($table, params, h);
    }

    if (formatter) {
      return [_tools.UtilTools.formatText(_tools.UtilTools.getCellLabel(row, column, params), 1)];
    }

    return Cell.renderDefaultCell.call(_vm, h, params);
  }
};
exports.Cell = Cell;
var _default = Cell;
exports.default = _default;