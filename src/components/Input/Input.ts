import Block, { BlockProps } from '../../framework/Block';
import { validateField } from '../../helpers/validation';

import './input.pcss';

export interface InputProps extends BlockProps {
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  error?: boolean;
  onClick?: (e: Event) => void;
}

export default class Input extends Block<InputProps> {
  constructor(props: InputProps) {
    super({
      ...props,
      events: {
        blur: (e: Event) => this.handleBlur(e),
        click: (e: Event) => {
          props.onClick?.(e);
        },
      },
    });
  }

  private handleBlur(event: Event): void {
    const input = event.target as HTMLInputElement;
    const isValid = validateField(input.name, input.value);

    this.setAttributes({
      class: isValid ? 'input' : 'input input__error',
    });
  }

  render() {
    return '<input name="{{name}}" type="{{type}}" placeholder="{{placeholder}}" value="{{value}}" class="input">';
  }
}
