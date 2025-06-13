import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';

module('Render with template tag', function (hooks) {
	setupRenderingTest(hooks);

	  test('it has a template tag', async function (assert) {
			await render(<template>
              what
            </template>);
			assert.dom().hasText('what');
  });


	test('it has a template tag with a tag', async function (assert) {
			await render(<template>
              <h1>what</h1>
            </template>);
			assert.dom().hasText('what');
  });


	test('it has a template tag with a block', async function (assert) {
			await render(<template>
              {{#if true}}
							what
							{{/if}}
            </template>);
			assert.dom().hasText('what');
  });

	test('it has a template tag with a one-line block', async function (assert) {
			await render(<template>
              {{#if true}}what{{/if}}
            </template>);
			assert.dom().hasText('what');
  });

	test('it has a template tag with a one-line block', async function (assert) {
			await render(<template>
              {{if true 'what'}}
            </template>);
			assert.dom().hasText('what');
  });
});