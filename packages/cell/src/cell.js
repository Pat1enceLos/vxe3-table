import XEUtils from 'xe-utils/methods/xe-utils'
import { h } from 'vue';
import GlobalConfig from '../../conf'
import VXETable from '../../v-x-e-table'
import { UtilTools } from '../../tools'

function renderTitleContent (h, content) {
  return [
    h('span', {
      class: 'vxe-cell--title'
    }, content)
  ]
}

export const Cell = {
  createColumn ($xetable, _vm) {
    const { type, sortable, remoteSort, filters, editRender, treeNode } = _vm
    const { editConfig, editOpts, checkboxOpts } = $xetable
    const renMaps = {
      renderHeader: this.renderDefaultHeader,
      renderCell: treeNode ? this.renderTreeCell : this.renderDefaultCell,
      renderFooter: this.renderDefaultFooter
    }
    switch (type) {
      case 'seq':
        renMaps.renderHeader = this.renderIndexHeader
        renMaps.renderCell = treeNode ? this.renderTreeIndexCell : this.renderIndexCell
        break
      case 'radio':
        renMaps.renderHeader = this.renderRadioHeader
        renMaps.renderCell = treeNode ? this.renderTreeRadioCell : this.renderRadioCell
        break
      case 'checkbox':
        renMaps.renderHeader = this.renderSelectionHeader
        renMaps.renderCell = checkboxOpts.checkField ? (treeNode ? this.renderTreeSelectionCellByProp : this.renderSelectionCellByProp) : (treeNode ? this.renderTreeSelectionCell : this.renderSelectionCell)
        break
      case 'expand':
        renMaps.renderCell = this.renderExpandCell
        renMaps.renderData = this.renderExpandData
        break
      case 'html':
        renMaps.renderCell = treeNode ? this.renderTreeHTMLCell : this.renderHTMLCell
        if (filters && (sortable || remoteSort)) {
          renMaps.renderHeader = this.renderSortAndFilterHeader
        } else if (sortable || remoteSort) {
          renMaps.renderHeader = this.renderSortHeader
        } else if (filters) {
          renMaps.renderHeader = this.renderFilterHeader
        }
        break
      default:
        if (editConfig && editRender) {
          renMaps.renderHeader = this.renderEditHeader
          renMaps.renderCell = editOpts.mode === 'cell' ? (treeNode ? this.renderTreeCellEdit : this.renderCellEdit) : (treeNode ? this.renderTreeRowEdit : this.renderRowEdit)
        } else if (filters && (sortable || remoteSort)) {
          renMaps.renderHeader = this.renderSortAndFilterHeader
        } else if (sortable || remoteSort) {
          renMaps.renderHeader = this.renderSortHeader
        } else if (filters) {
          renMaps.renderHeader = this.renderFilterHeader
        }
    }
    return UtilTools.getColumnConfig($xetable, _vm, renMaps)
  },
  /**
   * 单元格
   */
  renderDefaultHeader (h, params) {
    const { $table, column } = params
    const { slots, own } = column
    const renderOpts = own.editRender || own.cellRender
    if (slots && slots.header) {
      return renderTitleContent(h, slots.header.call($table, params, h))
    }
    if (renderOpts) {
      const compConf = VXETable.renderer.get(renderOpts.name)
      if (compConf && compConf.renderHeader) {
        return renderTitleContent(h, compConf.renderHeader.call($table, h, renderOpts, params, { $grid: $table.$xegrid, $table }))
      }
    }
    return renderTitleContent(h, UtilTools.formatText(column.getTitle(), 1))
  },
  renderDefaultCell (h, params) {
    const { $table, row, column } = params
    const { slots, own } = column
    const renderOpts = own.editRender || own.cellRender
    if (slots && slots.default) {
      return slots.default.call($table, params, h)
    }
    if (renderOpts) {
      const funName = own.editRender ? 'renderCell' : 'renderDefault'
      const compConf = VXETable.renderer.get(renderOpts.name)
      if (compConf && compConf[funName]) {
        return compConf[funName].call($table, h, renderOpts, Object.assign({ $type: own.editRender ? 'edit' : 'cell' }, params), { $grid: $table.$xegrid, $table })
      }
    }
    return [UtilTools.formatText(UtilTools.getCellLabel(row, column, params), 1)]
  },
  renderTreeCell (h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderDefaultCell.call(this, h, params))
  },
  renderDefaultFooter (h, params) {
    const { $table, column, _columnIndex, items } = params
    const { slots, own } = column
    const renderOpts = own.editRender || own.cellRender
    if (slots && slots.footer) {
      return slots.footer.call($table, params, h)
    }
    if (renderOpts) {
      const compConf = VXETable.renderer.get(renderOpts.name)
      if (compConf && compConf.renderFooter) {
        return compConf.renderFooter.call($table, h, renderOpts, params, { $grid: $table.$xegrid, $table })
      }
    }
    return [UtilTools.formatText(items[_columnIndex], 1)]
  },

  /**
   * 树节点
   */
  renderTreeIcon (h, params, cellVNodes) {
    const { $table, isHidden } = params
    const { treeOpts, treeExpandeds, treeLazyLoadeds } = $table
    const { row, column, level } = params
    const { slots } = column
    const { children, hasChild, indent, lazy, trigger, iconLoaded, iconOpen, iconClose } = treeOpts
    const rowChilds = row[children]
    let hasLazyChilds = false
    let isAceived = false
    let isLazyLoaded = false
    const on = {}
    if (slots && slots.icon) {
      return slots.icon.call($table, params, h, cellVNodes)
    }
    if (!isHidden) {
      isAceived = treeExpandeds.indexOf(row) > -1
      if (lazy) {
        isLazyLoaded = treeLazyLoadeds.indexOf(row) > -1
        hasLazyChilds = row[hasChild]
      }
    }
    if (!trigger || trigger === 'default') {
      on.onClick = evnt => $table.triggerTreeExpandEvent(evnt, params)
    }
    return [
      h('div', {
        class: ['vxe-cell--tree-node', {
          'is--active': isAceived
        }],
        style: {
          paddingLeft: `${level * indent}px`
        }
      }, [
        (rowChilds && rowChilds.length) || hasLazyChilds ? [
          h('div', {
            class: 'vxe-tree--btn-wrapper',
            ...on
          }, [
            h('i', {
              class: ['vxe-tree--node-btn', isLazyLoaded ? (iconLoaded || GlobalConfig.icon.TABLE_TREE_LOADED) : (isAceived ? (iconOpen || GlobalConfig.icon.TABLE_TREE_OPEN) : (iconClose || GlobalConfig.icon.TABLE_TREE_CLOSE))]
            })
          ])
        ] : null,
        h('div', {
          class: 'vxe-tree-cell'
        }, cellVNodes)
      ])
    ]
  },

  /**
   * 索引
   */
  renderIndexHeader (h, params) {
    const { $table, column } = params
    const { slots } = column
    return renderTitleContent(h, slots && slots.header ? slots.header.call($table, params, h) : UtilTools.formatText(column.getTitle(), 1))
  },
  renderIndexCell (h, params) {
    const { $table, column } = params
    const { seqOpts } = $table
    const { slots } = column
    if (slots && slots.default) {
      return slots.default.call($table, params, h)
    }
    const { $seq, seq, level } = params
    const seqMethod = seqOpts.seqMethod || column.seqMethod
    return [UtilTools.formatText(seqMethod ? seqMethod(params) : level ? `${$seq}.${seq}` : (seqOpts.startIndex) + seq, 1)]
  },
  renderTreeIndexCell (h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderIndexCell(h, params))
  },

  /**
   * 单选
   */
  renderRadioHeader (h, params) {
    const { $table, column } = params
    const { slots } = column
    return renderTitleContent(h, slots && slots.header ? slots.header.call($table, params, h) : [
      h('span', {
        class: 'vxe-radio--label'
      }, UtilTools.formatText(column.getTitle(), 1))
    ])
  },
  renderRadioCell (h, params) {
    const { $table, column, isHidden } = params
    const { radioOpts, selectRow } = $table
    const { slots } = column
    const { labelField, checkMethod } = radioOpts
    const { row } = params
    const isChecked = row === selectRow
    let isDisabled = !!checkMethod
    let on
    if (!isHidden) {
      on = {
        onClick (evnt) {
          if (!isDisabled) {
            $table.triggerRadioRowEvent(evnt, params)
          }
        }
      }
      if (checkMethod) {
        isDisabled = !checkMethod({ row })
      }
    }
    return [
      h('span', {
        class: ['vxe-cell--radio', {
          'is--checked': isChecked,
          'is--disabled': isDisabled
        }],
        ...on
      }, [
        h('span', {
          class: 'vxe-radio--icon vxe-radio--checked-icon'
        }),
        h('span', {
          class: 'vxe-radio--icon vxe-radio--unchecked-icon'
        })
      ].concat(slots && slots.default ? slots.default.call($table, params, h) : (labelField ? [
        h('span', {
          class: 'vxe-radio--label'
        }, XEUtils.get(row, labelField))
      ] : [])))
    ]
  },
  renderTreeRadioCell (h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderRadioCell(h, params))
  },

  /**
   * 多选
   */
  renderSelectionHeader (h, params) {
    const { $table, column, isHidden } = params
    const { isIndeterminate, isAllCheckboxDisabled } = $table
    const { slots } = column
    const checkboxOpts = $table.checkboxOpts
    const headerTitle = column.getTitle()
    let isChecked = false
    let on
    if (checkboxOpts.checkStrictly ? !checkboxOpts.showHeader : checkboxOpts.showHeader === false) {
      return renderTitleContent(h, slots && slots.header ? slots.header.call($table, params, h) : [
        h('span', {
          class: 'vxe-checkbox--label'
        }, headerTitle)
      ])
    }
    if (!isHidden) {
      isChecked = isAllCheckboxDisabled ? false : $table.isAllSelected
      on = {
        onClick (evnt) {
          if (!isAllCheckboxDisabled) {
            $table.triggerCheckAllEvent(evnt, !isChecked)
          }
        }
      }
    }
    return renderTitleContent(h, [
      h('span', {
        class: ['vxe-cell--checkbox', {
          'is--checked': isChecked,
          'is--disabled': isAllCheckboxDisabled,
          'is--indeterminate': isIndeterminate
        }],
        title: GlobalConfig.i18n('vxe.table.allTitle'),
        ...on
      }, [
        h('span', {
          class: 'vxe-checkbox--icon vxe-checkbox--checked-icon'
        }),
        h('span', {
          class: 'vxe-checkbox--icon vxe-checkbox--unchecked-icon'
        }),
        h('span', {
          class: 'vxe-checkbox--icon vxe-checkbox--indeterminate-icon'
        })
      ].concat(slots && slots.header ? slots.header.call($table, params, h) : (headerTitle ? [
        h('span', {
          class: 'vxe-checkbox--label'
        }, headerTitle)
      ] : [])))
    ])
  },
  renderSelectionCell (h, params) {
    const { $table, row, column, isHidden } = params
    const { treeConfig, treeIndeterminates } = $table
    const { labelField, checkMethod } = $table.checkboxOpts
    const { slots } = column
    let indeterminate = false
    let isChecked = false
    let isDisabled = !!checkMethod
    let on
    if (!isHidden) {
      isChecked = $table.selection.indexOf(row) > -1
      on = {
        onClick (evnt) {
          if (!isDisabled) {
            $table.triggerCheckRowEvent(evnt, params, !isChecked)
          }
        }
      }
      if (checkMethod) {
        isDisabled = !checkMethod({ row })
      }
      if (treeConfig) {
        indeterminate = treeIndeterminates.indexOf(row) > -1
      }
    }
    return [
      h('span', {
        class: ['vxe-cell--checkbox', {
          'is--checked': isChecked,
          'is--disabled': isDisabled,
          'is--indeterminate': indeterminate
        }],
        ...on
      }, [
        h('span', {
          class: 'vxe-checkbox--icon vxe-checkbox--checked-icon'
        }),
        h('span', {
          class: 'vxe-checkbox--icon vxe-checkbox--unchecked-icon'
        }),
        h('span', {
          class: 'vxe-checkbox--icon vxe-checkbox--indeterminate-icon'
        })
      ].concat(slots && slots.default ? slots.default.call($table, params, h) : (labelField ? [
        h('span', {
          class: 'vxe-checkbox--label'
        }, XEUtils.get(row, labelField))
      ] : [])))
    ]
  },
  renderTreeSelectionCell (h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderSelectionCell(h, params))
  },
  renderSelectionCellByProp (h, params) {
    const { $table, row, column, isHidden } = params
    const { treeConfig, treeIndeterminates } = $table
    const { labelField, checkField: property, halfField, checkMethod } = $table.checkboxOpts
    const { slots } = column
    let indeterminate = false
    let isChecked = false
    let isDisabled = !!checkMethod
    let on
    if (!isHidden) {
      isChecked = XEUtils.get(row, property)
      on = {
        click (evnt) {
          if (!isDisabled) {
            $table.triggerCheckRowEvent(evnt, params, !isChecked)
          }
        }
      }
      if (checkMethod) {
        isDisabled = !checkMethod({ row })
      }
      if (treeConfig) {
        indeterminate = treeIndeterminates.indexOf(row) > -1
      }
    }
    return [
      h('span', {
        class: ['vxe-cell--checkbox', {
          'is--checked': isChecked,
          'is--disabled': isDisabled,
          'is--indeterminate': halfField && !isChecked ? row[halfField] : indeterminate
        }],
        on
      }, [
        h('span', {
          class: 'vxe-checkbox--icon vxe-checkbox--checked-icon'
        }),
        h('span', {
          class: 'vxe-checkbox--icon vxe-checkbox--unchecked-icon'
        }),
        h('span', {
          class: 'vxe-checkbox--icon vxe-checkbox--indeterminate-icon'
        })
      ].concat(slots && slots.default ? slots.default.call($table, params, h) : (labelField ? [
        h('span', {
          class: 'vxe-checkbox--label'
        }, XEUtils.get(row, labelField))
      ] : [])))
    ]
  },
  renderTreeSelectionCellByProp (h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderSelectionCellByProp(h, params))
  },

  /**
   * 展开行
   */
  renderExpandCell (h, params) {
    const { $table, isHidden, row, column } = params
    const { expandOpts, rowExpandeds, expandLazyLoadeds } = $table
    const { lazy, labelField, iconLoaded, iconOpen, iconClose, visibleMethod } = expandOpts
    const { slots } = column
    let isAceived = false
    let isLazyLoaded = false
    if (slots && slots.icon) {
      return slots.icon.call($table, params, h)
    }
    if (!isHidden) {
      isAceived = rowExpandeds.indexOf(params.row) > -1
      if (lazy) {
        isLazyLoaded = expandLazyLoadeds.indexOf(row) > -1
      }
    }
    return [
      !visibleMethod || visibleMethod(params) ? h('span', {
        class: ['vxe-table--expanded', {
          'is--active': isAceived
        }],
        onClick: (evnt) => $table.triggerRowExpandEvent(evnt, params)
      }, [
        h('i', {
          class: ['vxe-table--expand-btn', isLazyLoaded ? (iconLoaded || GlobalConfig.icon.TABLE_EXPAND_LOADED) : (isAceived ? (iconOpen || GlobalConfig.icon.TABLE_EXPAND_OPEN) : (iconClose || GlobalConfig.icon.TABLE_EXPAND_CLOSE))]
        })
      ]) : null,
      h('span', {
        class: 'vxe-table--expand-label'
      }, slots && slots.default ? slots.default.call($table, params, h) : (labelField ? XEUtils.get(row, labelField) : null))
    ]
  },
  renderExpandData (h, params) {
    const { $table, column } = params
    const { slots, contentRender } = column
    if (slots && slots.content) {
      return slots.content.call($table, params, h)
    }
    if (contentRender) {
      const compConf = VXETable.renderer.get(contentRender.name)
      if (compConf && compConf.renderExpand) {
        return compConf.renderExpand.call($table, h, contentRender, params, { $grid: $table.$xegrid, $table })
      }
    }
    return []
  },

  /**
   * HTML 标签
   */
  renderHTMLCell (h, params) {
    const { $table, row, column } = params
    const { slots } = column
    if (slots && slots.default) {
      return slots.default.call($table, params, h)
    }
    return [
      h('span', {
        class: 'vxe-cell--html',
        innerHTML: UtilTools.formatText(UtilTools.getCellLabel(row, column, params), 1)
      })
    ]
  },
  renderTreeHTMLCell (h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderHTMLCell(h, params))
  },

  /**
   * 排序和筛选
   */
  renderSortAndFilterHeader (h, params) {
    return Cell.renderDefaultHeader(h, params)
      .concat(Cell.renderSortIcon(h, params))
      .concat(Cell.renderFilterIcon(h, params))
  },

  /**
   * 排序
   */
  renderSortHeader (h, params) {
    return Cell.renderDefaultHeader(h, params).concat(Cell.renderSortIcon(h, params))
  },
  renderSortIcon (h, params) {
    const { $table, column } = params
    const { showIcon, iconAsc, iconDesc } = $table.sortOpts
    return showIcon === false ? [] : [
      h('span', {
        class: 'vxe-cell--sort'
      }, [
        h('i', {
          class: ['vxe-sort--asc-btn', iconAsc || GlobalConfig.icon.TABLE_SORT_ASC, {
            'sort--active': column.order === 'asc'
          }],
          title: GlobalConfig.i18n('vxe.table.sortAsc'),
          onClick: (evnt) => $table.triggerSortEvent(evnt, column, 'asc')
        }, [
          h('svg', {
            viewBox: '0 0 16 8',
            width: '16px',
            height: '8px',
            innerHTML: `
              <g id="画板" stroke="none" stroke-width="1" fill-rule="evenodd">
                  <path d="M7.55803708,2.49069051 L4.63890187,6.19028212 C4.4678494,6.40706696 4.50492282,6.72147121 4.72170766,6.89252367 C4.80993448,6.96213839 4.91904146,7 5.03142554,7 L10.9507721,7 C11.2269145,7 11.4507721,6.77614237 11.4507721,6.5 C11.4507721,6.38532418 11.4113531,6.27413338 11.3391221,6.18506466 L8.33891077,2.48547306 C8.16497679,2.27099327 7.85010521,2.2381244 7.63562542,2.41205838 C7.60693772,2.43532288 7.58091617,2.4616945 7.55803708,2.49069051 Z" id="up/fill"></path>
              </g>
            `
          })
        ]),
        h('i', {
          class: ['vxe-sort--desc-btn', iconDesc || GlobalConfig.icon.TABLE_SORT_DESC, {
            'sort--active': column.order === 'desc'
          }],
          title: GlobalConfig.i18n('vxe.table.sortDesc'),
          onClick: (evnt) => $table.triggerSortEvent(evnt, column, 'desc')
        }, [
          h('svg', {
            viewBox: '0 0 16 8',
            width: '16px',
            height: '8px',
            innerHTML: `
              <g id="画板" stroke="none" stroke-width="1" fill-rule="evenodd">
                <path d="M7.55803708,1.49069051 L4.63890187,5.19028212 C4.4678494,5.40706696 4.50492282,5.72147121 4.72170766,5.89252367 C4.80993448,5.96213839 4.91904146,6 5.03142554,6 L10.9507721,6 C11.2269145,6 11.4507721,5.77614237 11.4507721,5.5 C11.4507721,5.38532418 11.4113531,5.27413338 11.3391221,5.18506466 L8.33891077,1.48547306 C8.16497679,1.27099327 7.85010521,1.2381244 7.63562542,1.41205838 C7.60693772,1.43532288 7.58091617,1.4616945 7.55803708,1.49069051 Z" id="down/fill" transform="translate(8.000000, 3.500000) scale(1, -1) translate(-8.000000, -3.500000) "></path>
              </g>
            `
          })
        ])
      ])
    ]
  },

  /**
   * 筛选
   */
  renderFilterHeader (h, params) {
    return Cell.renderDefaultHeader(h, params).concat(Cell.renderFilterIcon(h, params))
  },
  renderFilterIcon (h, params) {
    const { $table, column, hasFilter } = params
    const { filterStore, filterOpts } = $table
    const { showIcon, iconNone, iconMatch } = filterOpts
    return showIcon === false ? [] : [
      h('span', {
        class: ['vxe-cell--filter', {
          'is--active': filterStore.visible && filterStore.column === column
        }]
      }, [
        h('i', {
          class: ['vxe-filter--btn', hasFilter ? (iconMatch || GlobalConfig.icon.TABLE_FILTER_MATCH) : (iconNone || GlobalConfig.icon.TABLE_FILTER_NONE)],
          title: GlobalConfig.i18n('vxe.table.filter'),
          onClick: (evnt) => $table.triggerFilterEvent(evnt, params.column, params)
        }, [
          h('svg', {
            viewBox: '0 0 24 24',
            width: '100%',
            height: '100%',
            innerHTML: `<g id="icon-/-filter" stroke="none" stroke-width="1" fill-rule="evenodd">
              <path d="M9.14662963,18.2982456 C9.14662963,18.6864035 9.39513883,19 9.70315024,19 L14.2953204,19 C14.6033318,19 14.851841,18.6864035 14.851841,18.2982456 L14.851841,14.4646233 L9.14662963,14.4646233 L9.14662963,18.2982456 Z M17.5210491,5 L6.47763999,5 C6.11012638,5 5.88061787,5.50377358 6.06512471,5.90566038 L9.12413103,13 L14.8681932,13 L17.9365645,5.90566038 C18.1180712,5.50377358 17.8885627,5 17.5210491,5 Z"></path>
            </g>`
          })
        ])
      ])
    ]
  },

  /**
   * 可编辑
   */
  renderEditHeader (h, params) {
    const { $table, column } = params
    const { editRules, editOpts } = $table
    const { sortable, remoteSort, filters } = column
    let isRequired
    if (editRules) {
      const columnRules = XEUtils.get(editRules, params.column.property)
      if (columnRules) {
        isRequired = columnRules.some(rule => rule.required)
      }
    }
    return [
      isRequired ? h('i', {
        class: 'vxe-required-icon'
      }) : null,
      editOpts.showIcon === false ? null : h('i', {
        class: ['vxe-edit-icon', editOpts.icon || GlobalConfig.icon.TABLE_EDIT]
      })
    ].concat(Cell.renderDefaultHeader(h, params))
      .concat(sortable || remoteSort ? Cell.renderSortIcon(h, params) : [])
      .concat(filters ? Cell.renderFilterIcon(h, params) : [])
  },
  // 行格编辑模式
  renderRowEdit (h, params) {
    const { $table } = params
    const { actived } = $table.editStore
    return Cell.runRenderer(h, params, this, actived && actived.row === params.row)
  },
  renderTreeRowEdit (h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderRowEdit(h, params))
  },
  // 单元格编辑模式
  renderCellEdit (h, params) {
    const { $table } = params
    const { actived } = $table.editStore
    if (params.$table.editConfig.trigger === 'click') {
      // show edit at the begining when single click
      return Cell.runRenderer(h, params, this, true)
    } else {
      return Cell.runRenderer(h, params, this, actived && actived.row === params.row && actived.column === params.column)
    }
  },
  renderTreeCellEdit (h, params) {
    return Cell.renderTreeIcon(h, params, Cell.renderCellEdit(h, params))
  },
  runRenderer (h, params, _vm, isEdit) {
    const { $table, row, column } = params
    const { slots, own, formatter } = column
    const editRender = own.editRender
    const compConf = VXETable.renderer.get(editRender.name)
    if (isEdit) {
      if (slots && slots.edit) {
        return slots.edit.call($table, params, h)
      }
      return compConf && compConf.renderEdit ? compConf.renderEdit.call($table, h, editRender, Object.assign({ $type: 'edit' }, params), { $grid: $table.$xegrid, $table }) : []
    }
    if (slots && slots.default) {
      return slots.default.call($table, params, h)
    }
    if (formatter) {
      return [UtilTools.formatText(UtilTools.getCellLabel(row, column, params), 1)]
    }
    return Cell.renderDefaultCell.call(_vm, h, params)
  }
}

export default Cell
