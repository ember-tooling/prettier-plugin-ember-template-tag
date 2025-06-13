import type { TemplateOnlyComponent } from '@ember/component/template-only';

export interface Signature {
  Element: HTMLElement,
  Args: {


  }
  Yields: []
}

const ModVar1 = <template>

  <h1>   Module variable template. Module variable template. Module variable template. Module variable template. Module variable template. Module variable template. Module variable template. Module variable template.   </h1>
</template> as TemplateOnlyComponent<Signature>,
ModVar2 = <template>
  Second module variable template.
</template> as TemplateOnlyComponent<Signature>,
    num = 1;
    /*AMBIGUOUS*/


const bool: boolean = false, ModVar3  = <template>

  <h1>   Module variable template. Module variable template. Module variable template. Module variable template. Module variable template. Module variable template. Module variable template. Module variable template.   </h1>
</template> as TemplateOnlyComponent<Signature>,
ModVar4 = <template>
  Second module variable template.
</template> as TemplateOnlyComponent<Signature>
/*AMBIGUOUS*/