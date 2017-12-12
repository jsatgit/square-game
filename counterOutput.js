export default class CounterOutput {
  constructor(labelText, padding=1) {
    this.node = document.createElement("div");
    this.label = document.createElement("div");
    this.counter = document.createElement("div");
    this.padding = padding;
    this._init(labelText);
  }

  _init(labelText) {
    this.node.className = "counter-output-container";
    this.label.append(labelText);
    this.setCount(0);
    this.counter.className = "counter";
    this.node.append(this.label);
    this.node.append(this.counter);
  }

  setCount(count) {
    this.counter.innerHTML = count.toString().padStart(this.padding, "0");
  }

  setLabel(label) {
    this.label.replaceChild(label, this.label.childNodes[0]);
  }
};
