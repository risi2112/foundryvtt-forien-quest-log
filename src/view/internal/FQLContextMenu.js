/**
 * Used to provides a fixed context menu used in QuestLog. With v13 it is handled by Foundry natively.
 *
 * V14 renamed the ContextMenuEntry fields (`name` -> `label`, `callback` -> `onClick`, `condition` -> `visible`) and
 * `onClick` now receives `(event, target)` with a plain HTMLElement. FQL menu items are still authored in the V13
 * shape, so they are adapted here based on the running core generation. The container is also unwrapped from jQuery
 * as FQL views are ApplicationV1 and pass jQuery to `activateListeners`.
 */
export class FQLContextMenu extends foundry.applications.ux.ContextMenu
{
   /**
    * @inheritDoc
    * @override
    */
   constructor(element, selector, menuItems, options = {})
   {
      const container = typeof jQuery !== 'undefined' && element instanceof jQuery ? element[0] : element;

      const isV14 = (game.release?.generation ?? 13) >= 14;

      super(container, selector, isV14 ? menuItems.map(FQLContextMenu.#toV14Entry) : menuItems, options);
   }

   /**
    * Converts a V13 style ContextMenuEntry to the V14 shape.
    *
    * @param {object}   entry - V13 style entry.
    *
    * @returns {object} V14 style entry.
    */
   static #toV14Entry(entry)
   {
      const { name, callback, condition, ...rest } = entry;

      const converted = { ...rest, label: rest.label ?? name };

      if (typeof callback === 'function') { converted.onClick = (event, target) => callback(target); }

      if (condition !== void 0) { converted.visible = condition; }

      return converted;
   }
}
