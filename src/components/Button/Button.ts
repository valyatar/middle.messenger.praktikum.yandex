import Block, { BlockProps } from '../../framework/Block';

export interface ButtonProps extends BlockProps {
  id: string;
  text?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export default class Button extends Block {
  constructor(props: ButtonProps) {
    super({
      ...props,
      events: {
        // click: (e: Event) => {
        //   console.log(e);
        // },
      },
    });
  }

  render() {
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
