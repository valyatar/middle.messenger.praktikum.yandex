import Block, { BlockProps } from '../../framework/Block';
import './button.pcss';
export interface ButtonProps extends BlockProps {
  id: string;
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: string;
}

export default class Button extends Block<ButtonProps> {
  constructor(props: ButtonProps) {
    super({
      ...props,
      events: {},
    });
  }

  render() {
    const { icon } = this.props;

    if (icon) {
      return (
        `<button
            id="{{id}}"
            class="button button--icon-round"
            type="{{#if type}}{{type}}{{else}}button{{/if}}"
            {{#if disabled}}disabled{{/if}}
            aria-label="Кнопка с иконкой"
          >
            <span class="button__icon">${icon}</span>
          </button>`
      );
    }

    return (
      `<button
          id="{{id}}"
          class="button"
          type="{{#if type}}{{type}}{{else}}button{{/if}}"
          {{#if disabled}}disabled{{/if}}
        >
          {{text}}
        </button>`
    );
  }
}
