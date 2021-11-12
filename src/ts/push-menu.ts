/**
 * --------------------------------------------
 * AdminLTE push-menu.ts
 * License MIT
 * --------------------------------------------
 */

import {
  domReady
} from './util/index'

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */
const DATA_KEY = 'lte.pushmenu'
const EVENT_KEY = `.${DATA_KEY}`

const EVENT_EXPANDED = `expanded${EVENT_KEY}`
const EVENT_COLLAPSED = `collapsed${EVENT_KEY}`

const CLASS_NAME_SIDEBAR_MINI = 'sidebar-mini'
const CLASS_NAME_SIDEBAR_MINI_HAD = 'sidebar-mini-had'
const CLASS_NAME_SIDEBAR_HORIZONTAL = 'sidebar-horizontal'
const CLASS_NAME_SIDEBAR_COLLAPSE = 'sidebar-collapse'
const CLASS_NAME_SIDEBAR_CLOSE = 'sidebar-close'
const CLASS_NAME_SIDEBAR_OPEN = 'sidebar-open'
const CLASS_NAME_SIDEBAR_OPENING = 'sidebar-is-opening'
const CLASS_NAME_SIDEBAR_COLLAPSING = 'sidebar-is-collapsing'
const CLASS_NAME_SIDEBAR_IS_HOVER = 'sidebar-is-hover'
const CLASS_NAME_MENU_OPEN = 'menu-open'
const CLASS_NAME_LAYOUT_MOBILE = 'layout-mobile'

const SELECTOR_SIDEBAR = '.sidebar'
const SELECTOR_NAV_SIDEBAR = '.nav-sidebar'
const SELECTOR_NAV_ITEM = '.nav-item'
const SELECTOR_NAV_TREEVIEW = '.nav-treeview'
const SELECTOR_MINI_TOGGLE = '[data-lte-toggle="sidebar-mini"]'
const SELECTOR_FULL_TOGGLE = '[data-lte-toggle="sidebar-full"]'
const SELECTOR_SIDEBAR_SM = `.${CLASS_NAME_LAYOUT_MOBILE}`
const SELECTOR_CONTENT_WRAPPER = '.content-wrapper'

const Defaults = {
  onLayouMobile: 992
}

/**
 * Class Definition
 * ====================================================
 */

class PushMenu {
  _element: HTMLElement | null
  _config: null
  _bodyClass: DOMTokenList
  constructor(element: HTMLElement | null, config: null) {
    this._element = element

    const bodyElement = document.body as HTMLBodyElement
    this._bodyClass = bodyElement.classList

    this._config = config
  }

  sidebarOpening(): void {
    this._bodyClass.add(CLASS_NAME_SIDEBAR_OPENING)
    setTimeout(() => {
      this._bodyClass.remove(CLASS_NAME_SIDEBAR_OPENING)
    }, 1000)
  }

  sidebarColllapsing(): void {
    this._bodyClass.add(CLASS_NAME_SIDEBAR_COLLAPSING)
    setTimeout(() => {
      this._bodyClass.remove(CLASS_NAME_SIDEBAR_COLLAPSING)
    }, 1000)
  }

  menusClose(): void {
    const navTreeview = document.querySelectorAll<HTMLElement>(SELECTOR_NAV_TREEVIEW)

    for (const navTree of navTreeview) {
      navTree.style.removeProperty('display')
      navTree.style.removeProperty('height')
    }

    const navSidebar = document.querySelector(SELECTOR_NAV_SIDEBAR)
    const navItem = navSidebar?.querySelectorAll(SELECTOR_NAV_ITEM)

    if (navItem) {
      for (const navI of navItem) {
        navI.classList.remove(CLASS_NAME_MENU_OPEN)
      }
    }
  }

  expand(): void {
    this.sidebarOpening()

    this._bodyClass.remove(CLASS_NAME_SIDEBAR_CLOSE)
    this._bodyClass.remove(CLASS_NAME_SIDEBAR_COLLAPSE)
    this._bodyClass.add(CLASS_NAME_SIDEBAR_OPEN)

    if (this._element !== null) {
      const event = new CustomEvent(EVENT_EXPANDED)
      this._element.dispatchEvent(event)
    }
  }

  collapse(): void {
    this.sidebarColllapsing()

    this._bodyClass.add(CLASS_NAME_SIDEBAR_COLLAPSE)

    setTimeout(() => {
      if (this._element !== null) {
        const event = new CustomEvent(EVENT_COLLAPSED)
        this._element.dispatchEvent(event)
      }
    }, 1000)
  }

  close(): void {
    this._bodyClass.add(CLASS_NAME_SIDEBAR_CLOSE)
    this._bodyClass.remove(CLASS_NAME_SIDEBAR_OPEN)
    this._bodyClass.remove(CLASS_NAME_SIDEBAR_COLLAPSE)

    if (this._bodyClass.contains(CLASS_NAME_SIDEBAR_HORIZONTAL)) {
      this.menusClose()
    }

    setTimeout(() => {
      if (this._element !== null) {
        const event = new CustomEvent(EVENT_COLLAPSED)
        this._element.dispatchEvent(event)
      }
    }, 1000)
  }

  sidebarHover(): void {
    const selSidebar = document.querySelector(SELECTOR_SIDEBAR)

    if (selSidebar) {
      selSidebar.addEventListener('mouseover', () => {
        this._bodyClass.add(CLASS_NAME_SIDEBAR_IS_HOVER)
      })

      selSidebar.addEventListener('mouseout', () => {
        this._bodyClass.remove(CLASS_NAME_SIDEBAR_IS_HOVER)
      })
    }
  }

  addSidebaBreakPoint(): void {
    const bodyClass = document.body.classList
    const widthOutput = window.innerWidth

    if (widthOutput < Defaults.onLayouMobile) {
      bodyClass.add(CLASS_NAME_LAYOUT_MOBILE)
    }

    if (widthOutput >= Defaults.onLayouMobile) {
      bodyClass.remove(CLASS_NAME_LAYOUT_MOBILE)
      this.expand()
    }
  }

  removeOverlaySidebar(): void {
    const bodyClass = document.body.classList
    if (bodyClass.contains(CLASS_NAME_LAYOUT_MOBILE)) {
      bodyClass.remove(CLASS_NAME_SIDEBAR_OPEN)
      bodyClass.remove(CLASS_NAME_SIDEBAR_COLLAPSE)
      bodyClass.add(CLASS_NAME_SIDEBAR_CLOSE)
    }
  }

  closeSidebar(): void {
    const widthOutput: number = window.innerWidth
    if (widthOutput < Defaults.onLayouMobile) {
      document.body.classList.add(CLASS_NAME_SIDEBAR_CLOSE)
    }
  }

  toggleFull(): void {
    if (this._bodyClass.contains(CLASS_NAME_SIDEBAR_CLOSE)) {
      this.expand()
    } else {
      this.close()
    }

    if (this._bodyClass.contains(CLASS_NAME_SIDEBAR_MINI)) {
      this._bodyClass.remove(CLASS_NAME_SIDEBAR_MINI)
      this._bodyClass.add(CLASS_NAME_SIDEBAR_MINI_HAD)
    }
  }

  toggleMini(): void {
    if (this._bodyClass.contains(CLASS_NAME_SIDEBAR_MINI_HAD)) {
      this._bodyClass.remove(CLASS_NAME_SIDEBAR_MINI_HAD)
      this._bodyClass.add(CLASS_NAME_SIDEBAR_MINI)
    }

    if (this._bodyClass.contains(CLASS_NAME_SIDEBAR_COLLAPSE)) {
      this.expand()
    } else {
      this.collapse()
    }
  }

  init() {
    this.addSidebaBreakPoint()
    this.sidebarHover()

    const selSidebarSm = document.querySelector(SELECTOR_SIDEBAR_SM)
    const selContentWrapper = selSidebarSm?.querySelector(SELECTOR_CONTENT_WRAPPER)

    if (selContentWrapper) {
      selContentWrapper.addEventListener('touchstart', this.removeOverlaySidebar)
      selContentWrapper.addEventListener('click', this.removeOverlaySidebar)
    }

    this.closeSidebar()
  }
}

/**
 * ------------------------------------------------------------------------
 * Data Api implementation
 * ------------------------------------------------------------------------
 */

domReady(() => {
  const data = new PushMenu(null, null)
  data.init()

  window.addEventListener('resize', () => {
    data.init()
  })

  const fullBtn = document.querySelectorAll(SELECTOR_FULL_TOGGLE)

  for (const btn of fullBtn) {
    btn.addEventListener('click', event => {
      event.preventDefault()

      let button = event.currentTarget as HTMLElement | null | undefined

      if (button?.dataset.lteToggle !== 'sidebar-full') {
        button = button?.closest(SELECTOR_FULL_TOGGLE)
      }

      if (button) {
        const data = new PushMenu(button, null)
        data.toggleFull()
      }
    })
  }

  const miniBtn = document.querySelectorAll(SELECTOR_MINI_TOGGLE)

  for (const btn of miniBtn) {
    btn.addEventListener('click', event => {
      event.preventDefault()

      let button = event.currentTarget as HTMLElement | null | undefined
      if (button?.dataset.lteToggle !== 'sidebar-mini') {
        button = button?.closest(SELECTOR_FULL_TOGGLE)
      }

      if (button) {
        const data = new PushMenu(button, null)
        data.toggleMini()
      }
    })
  }
})

export default PushMenu
