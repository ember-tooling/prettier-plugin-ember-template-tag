import Component from '@glimmer/component';

export interface Signature {
  Element: HTMLElement,
  Args: {}
  Yields: []
}

/** It's a component */
class MyComponent extends Component<Signature> {
  <template>
    ✓
  </template>
}

function hello() {
  return 'Hello';
}

function world() {
  return 'World';
}