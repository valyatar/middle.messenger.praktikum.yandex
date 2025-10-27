import Block, { BlockProps } from '../../framework/Block';
import Input from '../Input/Input';

import './field.pcss';

export interface FieldProps extends BlockProps {
  id: string;
  name: string;
  label: string;
  value: string;
  readonly?: boolean;
  href?: string;
}

export class Field extends Block<FieldProps> {
  constructor(props: FieldProps) {
    super({
      ...props,
      FieldInput: new Input({
        name: props.name,
        type: '',
        placeholder: props.label,
        value: props.value,
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
    `;
  }
}
