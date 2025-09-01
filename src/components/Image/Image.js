import './image.pcss';

export default `
<div class="img-circle {{class}}" style="--size: {{size}};">
  {{#if src}}
    <img src="{{src}}" alt="{{alt}}" loading="lazy">
  {{/if}}
</div>
`;
