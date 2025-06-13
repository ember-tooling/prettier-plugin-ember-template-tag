import Component from '@glimmer/component';

export interface Signature {
  Element: HTMLElement,
  Args: {

    myArg: string
  }
  Yields: []
}

/** It's a component */
class MyComponent
  extends Component<Signature> {
    // prettier-ignore
        <template>


    <h1 ...attributes>   {{@myArg}} Class top level template. Class top level template. Class top level template. Class top level template. Class top level template. </h1>
  </template>

  what = `template literal that is not a template`
}