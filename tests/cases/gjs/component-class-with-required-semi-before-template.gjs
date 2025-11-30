import Component from '@glimmer/component';

/** It's a component */
class MyComponent extends Component {
  get rows() {
    return 5;
  }

  historyBack = () => history.back();

  <template>
    <h1>Class top level template.</h1>
  </template>
}