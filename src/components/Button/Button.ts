import Block from '../../framework/Block';

export default class Button extends Block {
  constructor(props: any) {
    super({
      ...props,
      events: {
        click: (e: Event) => {
          // this.changeStyles();
          // props.onClick(e);
          console.log(e);
        },
      },
      // attr: {
      //     // class: 'footer-link',
      // },
    });
  }

  changeStyles() {
    this.setProps({ attr: {
      class: '',
    } });
  }

  render() {
    return `<button 
  id="{{id}}" 
  class="button"  
  type="{{#if type}}{{type}}{{else}}button{{/if}}"
  {{#if disabled}}disabled{{/if}}
>
  {{text}}
</button>`;
  }
}