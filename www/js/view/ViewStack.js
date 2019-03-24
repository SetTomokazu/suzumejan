// This is a JavaScript file

class ViewStack {
  constructor() {
    this.stack = [];
  }
  push(view) {
    if (this.stack.length > 0) {
      this.stack[this.stack.length - 1].hide();
    }
    view.setStack(this);
    this.stack.push(view);
    this.stack[this.stack.length - 1].show();
  }
  pop() {
    if (this.stack.length > 0) {
      this.stack[this.stack.length - 1].hide();
      this.stack.pop();
      this.stack[this.stack.length - 1].show();
    }
  }
}