import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';

import { task } from 'ember-concurrency';
import perform from 'ember-concurrency/helpers/perform';

import Button from 'okapi/components/button';
import Icon from 'okapi/components/icon';

export default class ProjectStatusComponent extends Component {



  <template>
    <Button
      data-test-project-status={{@project.id}}
      class='Button--theme-action'
            {{on 'click' (perform this.restartProject)}}
    >
        <Icon @type={{this.iconType}} @id={{this.iconId}} />
      {{@project.status}}{{if this.restartProject.isRunning '...'}}
    </Button>
  </template>

  @service server;

  private get iconType() {
    return 'mini';
  }

  private get iconId() {
    switch (this.args.project.status) {
      case 'starting':
      case 'stopping':
        return 'ellipsis-horizontal-circle';

      case 'started':
        return 'play-circle';
      case 'stopped':
        return 'stop-circle';
    }
  }

  restartProject = task({ drop: true },
  async () => {
    await this.server.restartProject(this.args.project);
  });
}
