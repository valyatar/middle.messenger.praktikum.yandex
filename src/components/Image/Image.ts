import Block, {BlockProps} from '../../framework/Block';

import './image.pcss';

export interface ImageProps extends BlockProps {
  class?: string,
  size?: string | number,
  src?: string,
  alt?: string,
}

export class Image extends Block {
  constructor(props: ImageProps) {
    super({
      ...props,
    });
  }

  render(): string {
    return `
      <div class="img-circle {{class}}" style="--size: {{size}};">
        {{#if src}}
          <img src="{{src}}" alt="{{alt}}" loading="lazy">
        {{/if}}
      </div>
    `;
  }
}
