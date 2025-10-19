import './field.pcss';

export default `
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
      {{> Input id=id name=name type=type placeholder=placeholder value=value }}
    </div>
  </div>
{{/if}}
`;
