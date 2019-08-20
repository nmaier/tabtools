"use strict";

const {menus} = browser;


const ALLOWED_PROPS = new Set([
  "checked", "command", "contexts", "documentUrlPatterns", "enabled", "icons",
  "parentId", "targetUrlPatterns", "title", "type", "viewtype", "visible"
]);

export class MenuItem {
  async update(props) {
    Object.assign(this, props);
    await menus.update(this.id, this.props());
  }

  async refresh() {
    await menus.refresh();
  }

  props() {
    const desc = {};
    for (const k of ALLOWED_PROPS) {
      if (typeof this[k] === "undefined") {
        continue;
      }
      desc[k] = this[k];
    }
    return desc;
  }
}

export function menu_init(...items) {
  const desc = new Map();

  function dispatch_menu(id, type, tab) {
    const action = desc.get(id);
    if (!action || !action[type]) {
      return;
    }
    action[type](id, tab);
  }

  async function handle_menu_click(e, tab) {
    try {
      await dispatch_menu(e.menuItemId, "click", tab);
    }
    catch (ex) {
      console.error();
    }
  }

  async function handle_menu_shown(e, tab) {
    try {
      const dispatched = Array.from(e.menuIds).
        map(id => dispatch_menu(id, "shown", tab));
      await Promise.all(dispatched);
    }
    catch (ex) {
      console.error(ex.toString());
    }
  }

  menus.onClicked.addListener(handle_menu_click);
  menus.onShown.addListener(handle_menu_shown);

  for (const item of items) {
    const {id} = item;
    desc.set(id, item);
    menus.create(Object.assign({id}, item.props()));
  }
}
