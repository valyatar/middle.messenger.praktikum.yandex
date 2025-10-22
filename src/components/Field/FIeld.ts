import Block from '../../framework/Block';

import './field.pcss';
import Input from "../Input/Input";

export class Field extends Block {
    constructor(props: any) {
        super({
            ...props,
            FieldInput: new Input({
                id: props.id,
                name: props.name,
                type: "",
                placeholder: props.label,
                value: props.value
            }),
        });
    }

    render(): string {
        return `
{{#if readonly}}
  <div class="info-row" role="group" aria-label="{{label}}">
    <span class="info-row__label">{{label}}</span>
    <div class="info-row__control">
      {{#if href}}
        <a class="info-row__value" href="{{href}}">{{value}}</a>
      {{else}}
        <span class="info-row__value">{{value}}</span>
      {{/if}}
    </div>
  </div>
{{else}}
  <div class="info-row">
    <label class="info-row__label" for="{{id}}">{{label}}</label>
    <div class="info-row__control">
      {{{ FieldInput }}}
    </div>
  </div>
{{/if}}
`
    }
}