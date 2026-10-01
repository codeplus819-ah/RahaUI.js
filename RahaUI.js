class ComponentManager {
  #Component = class Component {
    constructor(name, filePath, javascript, css) {
      this.name = name;
      this.filePath = filePath;
      this.css = css;
      this.javascript = javascript;
    }
    rendered = false;
    state = {};
    getState = () => {
      return this.state;
    }
    addToState = (key, value) => {
      this.state[key] = value;
    }
    getStateByKey = (key) => {
      return this.state[key];
    }
    changeStateByKey = (key, value) => {
      this.state[key] = value;
    }
    containsInState = (key) => {
      if (Object.hasOwn(this.state, key)) {
        return true;
      }
      return false;
    }
    render = async (originQuery) => {
      if (this.rendered) {
        return;
      }
      await fetch(this.filePath)
      .then(res => { if (res.ok) { return res.text(); } else { throw new Error(`error: ${this.filePath} didn\`t found.`) } })
      .then(data => {
        const origin = document.querySelector(String(originQuery));
        if (origin) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data, 'text/html');
          this.javascript.forEach(info => {
            const script = document.createElement('script');
            script.src = info.src;
            script.classList.add(`${this.name}-script`);
            if (info.isModule) script.type = "module";
            let scriptOrigin = info.inHead ? document.head : document.body;
            scriptOrigin.appendChild(script);
          });
          this.css.forEach(src => {
            const style = document.createElement('link');
            style.rel = 'stylesheet';
            style.href = src;
            style.classList.add(`${this.name}-style`);
            document.head.appendChild(style);
          });
          doc.querySelectorAll('*').forEach(e => e.classList.add(`${this.name}`));
          origin.append(...doc.body.childNodes);
          this.rendered = true;
        } else {
          throw new Error(`error: ${originQuery} didn\`t found in this page`);
        }
      })
      .catch(err => {
        console.error(err);
      });
    }
    remove = () => {
      document.querySelectorAll(`.${this.name}, .${this.name}-script, .${this.name}-style`).forEach(e => e.remove());
    };
  }
  components = {};
  addComponent = (name, filePath, javascript, css) => {
    this.components[name] = new this.#Component(name, filePath, javascript, css);
  };
  render = (name, originQuery) => {
    if (this.components[name]) {
      this.components[name].render(originQuery);
    }
  };
  getState = (name) => {
    if (this.components[name]) {
      return this.components[name].getState();
    }
  }
  addToState = (name, key, value) => {
    if (this.components[name]) {
      this.components[name].addToState(key, value);
    }
  }
  getStateByKey = (name, key) => {
    if (this.components[name]) {
      return this.components[name].getStateByKey(key);
    }
  }
  changeStateByKey = (name, key, value) => {
    if (this.components[name]) {
      this.components[name].changeStateByKey(key, value);
    }
  }
  containsInState = (name, key) => {
    if (this.components[name]) {
      return this.components[name].containsInState(key);
    }
  }
  removeComponent = (name) => {
    if (this.components[name]) {
      this.components[name].remove();
      delete this.components[name];
    }
  }
}
