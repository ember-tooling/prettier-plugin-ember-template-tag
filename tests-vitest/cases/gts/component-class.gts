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
        <template>


    <h1>   Class top level template. Class top level template. Class top level template. Class top level template. Class top level template. </h1>
  </template>
  /*AMBIGUOUS*/
}