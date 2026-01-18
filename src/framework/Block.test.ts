import { expect } from 'chai';
import Block, { BlockProps } from './Block';

class Child extends Block<BlockProps & { text: string }> {
  render(): string {
    return '<span class="child">{{text}}</span>';
  }
}

class ParentWithChild extends Block<BlockProps> {
  render(): string {
    return '<div class="parent">before {{{ Child }}} after</div>';
  }
}

class ParentWithList extends Block<BlockProps> {
  render(): string {
    return '<ul class="list">{{{ Items }}}</ul>';
  }
}

class ParentWithAttrsAndEvents extends Block<
BlockProps & { title: string; onClick: () => void }
> {
  render(): string {
    return '<button class="btn">{{title}}</button>';
  }
}

describe('Block', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders initial markup', () => {
    class Cmp extends Block<BlockProps & { text: string }> {
      render(): string {
        return '<div id="cmp">{{text}}</div>';
      }
    }

    const c = new Cmp({ text: 'hello' });
    document.body.appendChild(c.getContent());

    const el = document.querySelector('#cmp');
    expect(el?.textContent).to.equal('hello');
  });

  it('re-renders on setProps()', () => {
    class Cmp extends Block<BlockProps & { text: string }> {
      render(): string {
        return '<div id="cmp">{{text}}</div>';
      }
    }

    const c = new Cmp({ text: 'hello' });
    document.body.appendChild(c.getContent());

    c.setProps({ text: 'world' });

    const el = document.querySelector('#cmp');
    expect(el?.textContent).to.equal('world');
  });

  it('renders a child block into stub', () => {
    const child = new Child({ text: 'child-text' });
    const parent = new ParentWithChild({ Child: child });

    document.body.appendChild(parent.getContent());

    const childEl = document.querySelector('.child');
    expect(childEl?.textContent).to.equal('child-text');
  });

  it('renders list blocks into list stub', () => {
    const items = [new Child({ text: 'one' }), new Child({ text: 'two' })];
    const parent = new ParentWithList({ Items: items });

    document.body.appendChild(parent.getContent());

    const rendered = Array.from(document.querySelectorAll('.child')).map((n) => n.textContent);
    expect(rendered).to.deep.equal(['one', 'two']);
  });

  it('updates list via setLists()', () => {
    const parent = new ParentWithList({ Items: [new Child({ text: 'one' })] });
    document.body.appendChild(parent.getContent());

    parent.setLists({ Items: [new Child({ text: 'two' }), new Child({ text: 'three' })] });

    const rendered = Array.from(document.querySelectorAll('.child')).map((n) => n.textContent);
    expect(rendered).to.deep.equal(['two', 'three']);
  });

  it('sets attributes from attr prop', () => {
    class Cmp extends Block<BlockProps> {
      render(): string {
        return '<div class="box"></div>';
      }
    }

    const c = new Cmp({
      attr: { 'data-test': 'ok', tabindex: 0 },
    });

    document.body.appendChild(c.getContent());

    const el = document.querySelector('.box');
    expect(el?.getAttribute('data-test')).to.equal('ok');
  });

  it('adds and triggers DOM events from props.events', () => {
    let called = 0;

    const c = new ParentWithAttrsAndEvents({
      title: 'Click',
      onClick: () => {
        called += 1;
      },
      events: {
        click: () => {
          called += 1;
        },
      },
    });

    document.body.appendChild(c.getContent());

    const btn = document.querySelector('button');
    btn?.click();

    expect(called).to.equal(1);
  });

  it('removes events on re-render (no duplicate listeners)', () => {
    let called = 0;

    class Cmp extends Block<BlockProps & { text: string }> {
      render(): string {
        return '<button class="btn">{{text}}</button>';
      }
    }

    const c = new Cmp({
      text: 'A',
      events: {
        click: () => {
          called += 1;
        },
      },
    });

    document.body.appendChild(c.getContent());

    c.setProps({ text: 'B' });

    const btn = document.querySelector('button');
    btn?.click();

    expect(called).to.equal(1);
  });

  it('destroy() clears element and destroys children', () => {
    let childDestroyed = 0;

    class ChildWithDestroy extends Block<BlockProps> {
      destroy(): void {
        childDestroyed += 1;
        super.destroy();
      }

      render(): string {
        return '<span>c</span>';
      }
    }

    const child = new ChildWithDestroy({});
    const parent = new ParentWithChild({ Child: child });

    document.body.appendChild(parent.getContent());

    parent.destroy();

    expect(childDestroyed).to.equal(1);
  });
});
