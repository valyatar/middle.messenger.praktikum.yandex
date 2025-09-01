export default `<button 
  id="{{id}}" 
  class="button"  
  type="{{#if type}}{{type}}{{else}}button{{/if}}"
  {{#if disabled}}disabled{{/if}}
>
  {{text}}
</button>`;
