import Block from "../../framework/Block";

export default class Input extends Block {
    constructor(props: any) {
        super({
            ...props,
            events: {
                click: (e: Event) => {
                    // this.changeStyles();
                    props.onClick?.(e);
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
        return `<input name="{{name}}" type="{{type}}" placeholder="{{placeholder}}" value="{{value}}" class="input">`;
    }
}