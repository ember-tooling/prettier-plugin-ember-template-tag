import Component from '@glimmer/component';

/**
 * This component contains a multi-byte character
 */
export default class MultiByteCharComponent extends Component {
    get rows() {
        console.log('abc다윤6')
        return []
    }
    <template>
  {{#each this.rows as |row|}}
                  {{row.id}}
  {{/each}}
    </template>
}