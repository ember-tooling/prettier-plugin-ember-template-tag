import Component from '@glimmer/component';

export default class PooComponent extends Component {
  <template>
                  Testing line, incorrectly indented.
    {{#if true}}
      {{#if true}}
        <link href="/////styles/" />
        /* hi */
      {{else}}
        <link href="/////styles/" />
      {{/if}}
    {{/if}}
  </template>
}