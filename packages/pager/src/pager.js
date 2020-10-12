import XEUtils from 'xe-utils/methods/xe-utils'
import GlobalConfig from '../../conf'

export default {
  name: 'VxePager',
  props: {
    size: { type: String, default: () => GlobalConfig.pager.size || GlobalConfig.size },
    // 自定义布局
    layouts: { type: Array, default: () => GlobalConfig.pager.layouts || ['PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'Sizes', 'Total'] },
    // 当前页
    currentPage: { type: Number, default: 1 },
    // 加载中
    loading: Boolean,
    // 每页大小
    pageSize: { type: Number, default: () => GlobalConfig.pager.pageSize || 10 },
    // 总条数
    total: { type: Number, default: 0 },
    // 显示页码按钮的数量
    pagerCount: { type: Number, default: () => GlobalConfig.pager.pagerCount || 7 },
    // 每页大小选项列表
    pageSizes: { type: Array, default: () => GlobalConfig.pager.pageSizes || [10, 15, 20, 50, 100] },
    // 列对其方式
    align: { type: String, default: () => GlobalConfig.pager.align },
    // 带边框
    border: { type: Boolean, default: () => GlobalConfig.pager.border },
    // 带背景颜色
    background: { type: Boolean, default: () => GlobalConfig.pager.background },
    // 配套的样式
    perfect: { type: Boolean, default: () => GlobalConfig.pager.perfect },
    // 当只有一页时隐藏
    autoHidden: { type: Boolean, default: () => GlobalConfig.pager.autoHidden },
    // 自定义图标
    iconPrevPage: String,
    iconJumpPrev: String,
    iconJumpNext: String,
    iconNextPage: String,
    iconJumpMore: String,
    id: { type: String, default: '' }
  },
  data () {
    return {
      inputPage: ''
    }
  },
  inject: {
    $xegrid: {
      default: null
    }
  },
  mounted () {
    const key = this.$props.id || window.location.href
    const pageSize = localStorage.getItem(`${key}_pageSize`)
    if (pageSize) {
      this.changePageSize(parseInt(pageSize, 10))
    }
  },
  computed: {
    vSize () {
      return this.size || this.$parent.size || this.$parent.vSize
    },
    isSizes () {
      return this.layouts.some(name => name === 'Sizes')
    },
    pageCount () {
      return this.getPageCount(this.total, this.pageSize)
    },
    numList () {
      const len = this.pageCount > this.pagerCount ? this.pagerCount - 2 : this.pagerCount
      const rest = []
      for (let index = 0; index < len; index++) {
        rest.push(index)
      }
      return rest
    },
    offsetNumber () {
      return Math.floor((this.pagerCount - 2) / 2)
    }
  },
  render (h) {
    const { $scopedSlots, $xegrid, vSize, align } = this
    const childNodes = []
    if ($scopedSlots.left) {
      childNodes.push(
        h('span', {
          class: 'vxe-pager--left-wrapper'
        }, $scopedSlots.left.call(this, { $grid: $xegrid }))
      )
    }
    this.layouts.forEach(name => {
      childNodes.push(this[`render${name}`](h))
    })
    if ($scopedSlots.right) {
      childNodes.push(
        h('span', {
          class: 'vxe-pager--right-wrapper'
        }, $scopedSlots.right.call(this, { $grid: $xegrid }))
      )
    }
    return h('div', {
      class: ['vxe-pager', {
        [`size--${vSize}`]: vSize,
        [`align--${align}`]: align,
        'is--border': this.border,
        'is--background': this.background,
        'is--perfect': this.perfect,
        'is--hidden': this.autoHidden && this.pageCount === 1,
        'is--loading': this.loading
      }]
    }, [
      h('div', {
        class: 'vxe-pager--wrapper'
      }, childNodes)
    ])
  },
  methods: {
    // 上一页
    renderPrevPage (h) {
      return h('span', {
        class: ['vxe-pager--prev-btn', {
          'is--disabled': this.currentPage <= 1
        }],
        attrs: {
          title: GlobalConfig.i18n('vxe.pager.prevPage')
        },
        on: {
          click: this.prevPage
        }
      }, [
        h('i', {
          class: ['vxe-pager--btn-icon', this.iconPrevPage || GlobalConfig.icon.PAGER_PREV_PAGE],
          domProps: {
            innerHTML: `<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <g id="icon/-箭头/左" stroke="none" stroke-width="1" fill-rule="evenodd">
                <path d="M11.2549849,16.5 C11.5241692,16.5 11.7734139,16.384984 11.9628399,16.1932907 L19.2208459,9.05271565 C19.4003021,8.88019169 19.5,8.65974441 19.5,8.41054313 C19.5,7.89297125 19.0912387,7.5 18.5528701,7.5 C18.3036254,7.5 18.0543807,7.59584665 17.8749245,7.76837061 L11.2549849,14.2859425 L4.62507553,7.76837061 C4.44561934,7.59584665 4.2163142,7.5 3.94712991,7.5 C3.41873112,7.5 3,7.89297125 3,8.41054313 C3,8.65974441 3.09969789,8.88019169 3.27915408,9.05271565 L10.5371601,16.1932907 C10.7465257,16.3945687 10.9758308,16.5 11.2549849,16.5 Z" id="1" fill-rule="nonzero" transform="translate(11.250000, 12.000000) scale(-1, 1) rotate(-90.000000) translate(-11.250000, -12.000000) "></path>
              </g>
            </svg>`
          }
        })
      ])
    },
    // 向上翻页
    renderPrevJump (h, tagName) {
      return h(tagName || 'span', {
        class: ['vxe-pager--jump-prev', {
          'is--fixed': !tagName,
          'is--disabled': this.currentPage <= 1
        }],
        attrs: {
          title: GlobalConfig.i18n('vxe.pager.prevJump')
        },
        on: {
          click: this.prevJump
        }
      }, [
        tagName ? h('i', {
          class: ['vxe-pager--jump-more-icon', this.iconJumpMore || GlobalConfig.icon.PAGER_JUMP_MORE],
          domProps: {
            innerHTML: `<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <g id="页面-2" stroke="none" stroke-width="1" fill-rule="evenodd">
                <path d="M12,16.5 C12.8284271,16.5 13.5,17.1715729 13.5,18 C13.5,18.8284271 12.8284271,19.5 12,19.5 C11.1715729,19.5 10.5,18.8284271 10.5,18 C10.5,17.1715729 11.1715729,16.5 12,16.5 Z M12,10.5 C12.8284271,10.5 13.5,11.1715729 13.5,12 C13.5,12.8284271 12.8284271,13.5 12,13.5 C11.1715729,13.5 10.5,12.8284271 10.5,12 C10.5,11.1715729 11.1715729,10.5 12,10.5 Z M12,4.5 C12.8284271,4.5 13.5,5.17157288 13.5,6 C13.5,6.82842712 12.8284271,7.5 12,7.5 C11.1715729,7.5 10.5,6.82842712 10.5,6 C10.5,5.17157288 11.1715729,4.5 12,4.5 Z" id="形状结合" transform="translate(12.000000, 12.000000) rotate(-270.000000) translate(-12.000000, -12.000000) "></path>
              </g>
            </svg>`
          }
        }) : null
      ])
    },
    // number
    renderNumber (h) {
      return h('ul', {
        class: 'vxe-pager--btn-wrapper'
      }, this.renderPageBtn(h))
    },
    // jumpNumber
    renderJumpNumber (h) {
      return h('ul', {
        class: 'vxe-pager--btn-wrapper'
      }, this.renderPageBtn(h, true))
    },
    // 向下翻页
    renderNextJump (h, tagName) {
      return h(tagName || 'span', {
        class: ['vxe-pager--jump-next', {
          'is--fixed': !tagName,
          'is--disabled': this.currentPage >= this.pageCount
        }],
        attrs: {
          title: GlobalConfig.i18n('vxe.pager.nextJump')
        },
        on: {
          click: this.nextJump
        }
      }, [
        tagName ? h('i', {
          class: ['vxe-pager--jump-more-icon', this.iconJumpMore || GlobalConfig.icon.PAGER_JUMP_MORE],
          domProps: {
            innerHTML: `<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <g id="页面-2" stroke="none" stroke-width="1" fill-rule="evenodd">
                <path d="M12,16.5 C12.8284271,16.5 13.5,17.1715729 13.5,18 C13.5,18.8284271 12.8284271,19.5 12,19.5 C11.1715729,19.5 10.5,18.8284271 10.5,18 C10.5,17.1715729 11.1715729,16.5 12,16.5 Z M12,10.5 C12.8284271,10.5 13.5,11.1715729 13.5,12 C13.5,12.8284271 12.8284271,13.5 12,13.5 C11.1715729,13.5 10.5,12.8284271 10.5,12 C10.5,11.1715729 11.1715729,10.5 12,10.5 Z M12,4.5 C12.8284271,4.5 13.5,5.17157288 13.5,6 C13.5,6.82842712 12.8284271,7.5 12,7.5 C11.1715729,7.5 10.5,6.82842712 10.5,6 C10.5,5.17157288 11.1715729,4.5 12,4.5 Z" id="形状结合" transform="translate(12.000000, 12.000000) rotate(-270.000000) translate(-12.000000, -12.000000) "></path>
              </g>
            </svg>`
          }
        }) : null
      ])
    },
    // 下一页
    renderNextPage (h) {
      return h('span', {
        class: ['vxe-pager--next-btn', {
          'is--disabled': this.currentPage >= this.pageCount
        }],
        attrs: {
          title: GlobalConfig.i18n('vxe.pager.nextPage')
        },
        on: {
          click: this.nextPage
        }
      }, [
        h('i', {
          class: ['vxe-pager--btn-icon', this.iconNextPage || GlobalConfig.icon.PAGER_NEXT_PAGE],
          domProps: {
            innerHTML: `<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <g id="icon/-箭头/左" stroke="none" stroke-width="1" fill-rule="evenodd">
                <path d="M11.2549849,16.5 C11.5241692,16.5 11.7734139,16.384984 11.9628399,16.1932907 L19.2208459,9.05271565 C19.4003021,8.88019169 19.5,8.65974441 19.5,8.41054313 C19.5,7.89297125 19.0912387,7.5 18.5528701,7.5 C18.3036254,7.5 18.0543807,7.59584665 17.8749245,7.76837061 L11.2549849,14.2859425 L4.62507553,7.76837061 C4.44561934,7.59584665 4.2163142,7.5 3.94712991,7.5 C3.41873112,7.5 3,7.89297125 3,8.41054313 C3,8.65974441 3.09969789,8.88019169 3.27915408,9.05271565 L10.5371601,16.1932907 C10.7465257,16.3945687 10.9758308,16.5 11.2549849,16.5 Z" id="1" fill-rule="nonzero" transform="translate(11.250000, 12.000000) scale(-1, 1) rotate(-90.000000) translate(-11.250000, -12.000000) "></path>
              </g>
            </svg>`
          }
        })
      ])
    },
    // sizes
    renderSizes (h) {
      return h('vxe-select', {
        class: 'vxe-pager--sizes',
        props: {
          value: this.pageSize,
          placement: 'top',
          options: this.pageSizes.map(num => {
            return {
              value: num,
              label: `${XEUtils.template(GlobalConfig.i18n('vxe.pager.pagesize'), [num])}`
            }
          })
        },
        on: {
          change: ({ value }) => {
            this.pageSizeEvent(value)
          }
        }
      })
    },
    // FullJump
    renderFullJump (h) {
      return this.renderJump(h, true)
    },
    // Jump
    renderJump (h, isFull) {
      return h('span', {
        class: 'vxe-pager--jump'
      }, [
        isFull ? h('span', {
          class: 'vxe-pager--goto-text'
        }, GlobalConfig.i18n('vxe.pager.goto')) : null,
        h('input', {
          class: 'vxe-pager--goto',
          domProps: {
            value: this.inputPage
          },
          attrs: {
            type: 'text',
            autocomplete: 'off'
          },
          on: {
            keydown: this.jumpKeydownEvent,
            blur: this.triggerJumpEvent
          }
        }),
        isFull ? h('span', {
          class: 'vxe-pager--classifier-text'
        }, GlobalConfig.i18n('vxe.pager.pageClassifier')) : null
      ])
    },
    // PageCount
    renderPageCount (h) {
      return h('span', {
        class: 'vxe-pager--count'
      }, [
        h('span', {
          class: 'vxe-pager--separator'
        }),
        h('span', this.pageCount)
      ])
    },
    // total
    renderTotal (h) {
      return h('span', {
        class: 'vxe-pager--total'
      }, XEUtils.template(GlobalConfig.i18n('vxe.pager.total'), [this.total]))
    },
    // number
    renderPageBtn (h, showJump) {
      const { numList, currentPage, pageCount, pagerCount, offsetNumber } = this
      const nums = []
      const isOv = pageCount > pagerCount
      const isLt = isOv && currentPage > offsetNumber + 1
      const isGt = isOv && currentPage < pageCount - offsetNumber
      let startNumber = 1
      if (isOv) {
        if (currentPage >= pageCount - offsetNumber) {
          startNumber = Math.max(pageCount - numList.length + 1, 1)
        } else {
          startNumber = Math.max(currentPage - offsetNumber, 1)
        }
      }
      if (showJump && isLt) {
        nums.push(
          h('li', {
            class: 'vxe-pager--num-btn',
            on: {
              click: () => this.jumpPage(1)
            }
          }, 1),
          this.renderPrevJump(h, 'li')
        )
      }
      numList.forEach((item, index) => {
        const number = startNumber + index
        if (number <= pageCount) {
          nums.push(
            h('li', {
              class: ['vxe-pager--num-btn', {
                'is--active': currentPage === number
              }],
              on: {
                click: () => this.jumpPage(number)
              },
              key: `${number}${Date.now()}`
            }, number)
          )
        }
      })
      if (showJump && isGt) {
        nums.push(
          this.renderNextJump(h, 'li'),
          h('li', {
            class: 'vxe-pager--num-btn',
            on: {
              click: () => this.jumpPage(pageCount)
            }
          }, pageCount)
        )
      }
      return nums
    },
    getPageCount (total, size) {
      return Math.max(Math.ceil(total / size), 1)
    },
    prevPage () {
      const currentPage = this.currentPage
      if (currentPage > 1) {
        this.jumpPage(Math.max(currentPage - 1, 1))
      }
    },
    nextPage () {
      const { currentPage, pageCount } = this
      if (currentPage < pageCount) {
        this.jumpPage(Math.min(currentPage + 1, pageCount))
      }
    },
    prevJump () {
      this.jumpPage(Math.max(this.currentPage - this.numList.length, 1))
    },
    nextJump () {
      this.jumpPage(Math.min(this.currentPage + this.numList.length, this.pageCount))
    },
    jumpPage (currentPage) {
      if (currentPage !== this.currentPage) {
        this.$emit('update:currentPage', currentPage)
        this.$emit('page-change', { type: 'current', pageSize: this.pageSize, currentPage, $event: { type: 'current' } })
        const container = document.querySelector('.vxe-table--body-wrapper')
        if (container) {
          container.scrollTo(0, 0)
        }
      }
    },
    pageSizeEvent (pageSize) {
      this.changePageSize(pageSize)
    },
    changePageSize (pageSize) {
      if (pageSize !== this.pageSize) {
        this.$emit('update:pageSize', pageSize)
        this.$emit('page-change', { type: 'size', pageSize, currentPage: Math.min(this.currentPage, this.getPageCount(this.total, pageSize)), $event: { type: 'size' } })
        const key = this.$props.id || window.location.href
        localStorage.setItem(`${key}_pageSize`, pageSize)
      }
    },
    jumpKeydownEvent (evnt) {
      if (evnt.keyCode === 13) {
        this.triggerJumpEvent(evnt)
      }
    },
    triggerJumpEvent (evnt) {
      if (!evnt.target.value) return
      const value = XEUtils.toNumber(evnt.target.value)
      const current = value <= 0 ? 1 : value >= this.pageCount ? this.pageCount : value
      setTimeout(() => {
        evnt.target.blur()
        evnt.target.value = ''
        this.inputPage = ''
      }, 0)
      this.jumpPage(current)
    }
  }
}
