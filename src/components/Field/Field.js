import './field.pcss'

export default `
<div class="info-row">
  <label class="info-row__label" for="{{id}}">{{label}}</label>
  <div class="info-row__control">
    {{> Input id=id type=type placeholder=placeholder value=value }}
  </div>
</div>
`;