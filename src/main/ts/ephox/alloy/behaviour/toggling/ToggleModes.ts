import { Objects } from '@ephox/boulder';
import { Arr, Option } from '@ephox/katamari';
import { Attr, Node } from '@ephox/sugar';
import { AlloyComponent } from '../../api/component/ComponentApi';
import { AriaTogglingConfig } from '../../behaviour/toggling/TogglingTypes';

const updatePressed = function (component: AlloyComponent, ariaInfo: AriaTogglingConfig, status): void {
  Attr.set(component.element(), 'aria-pressed', status);
  if (ariaInfo.syncWithExpanded()) { updateExpanded(component, ariaInfo, status); }
};

const updateSelected = function (component: AlloyComponent, ariaInfo: AriaTogglingConfig, status): void {
  Attr.set(component.element(), 'aria-selected', status);
};

const updateChecked = function (component: AlloyComponent, ariaInfo: AriaTogglingConfig, status): void{
  Attr.set(component.element(), 'aria-checked', status);
};

const updateExpanded = function (component: AlloyComponent, ariaInfo: AriaTogglingConfig, status): void {
  Attr.set(component.element(), 'aria-expanded', status);
};

// INVESTIGATE: What other things can we derive?
const tagAttributes = {
  'button': [ 'aria-pressed' ],
  'input:checkbox': [ 'aria-checked' ]
};

const roleAttributes = {
  button: [ 'aria-pressed' ],
  listbox: [ 'aria-pressed', 'aria-expanded' ],
  menuitemcheckbox: [ 'aria-checked' ]
};

const detectFromTag = function (component: AlloyComponent): Option<string[]> {
  const elem = component.element();
  const rawTag = Node.name(elem);
  const suffix = rawTag === 'input' && Attr.has(elem, 'type') ? ':' + Attr.get(elem, 'type') : '';
  return Objects.readOptFrom(tagAttributes, rawTag + suffix);
};

const detectFromRole = function (component: AlloyComponent): Option<string[]> {
  const elem = component.element();
  if (! Attr.has(elem, 'role')) { return Option.none(); } else {
    const role = Attr.get(elem, 'role');
    return Objects.readOptFrom(roleAttributes, role);
  }
};

const updateAuto = function (component: AlloyComponent, _ariaInfo: void, status): void {
  // Role has priority
  const attributes = detectFromRole(component).orThunk(function () {
    return detectFromTag(component);
  }).getOr([ ]);
  Arr.each(attributes, function (attr) {
    Attr.set(component.element(), attr, status);
  });
};

export {
  updatePressed,
  updateSelected,
  updateChecked,
  updateExpanded,
  updateAuto
};