import Block from '../../framework/Block';
import './image.pcss';
export class Image extends Block {
  constructor(props: any) {
    super({
      ...props,
    });
  }

  render(): string {
    return `<div class="img-circle {{class}}" style="--size: {{size}};">
  {{#if src}}
    <img src="{{src}}" alt="{{alt}}" loading="lazy">
  {{/if}}
</div>`;
  }
}