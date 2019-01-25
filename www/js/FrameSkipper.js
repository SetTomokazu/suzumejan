// This is a JavaScript file

class FrameSkipper {
  constructor() {
    this.count = 0;
    this.max = 0;
  }
  init(time){
    this.count = 0;
    this.max = time;
  }
  get hasSkipped(){
    return ++this.count >= this.max;
  }
}

