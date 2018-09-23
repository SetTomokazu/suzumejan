// This is a JavaScript file

var setBound = () => {
  var bound = {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    zoom: 1
  };
  switch (getUa()) {
    case "Android":
    case "iPad":
    case "iPhone":
      bound.height = screen.availHeight * (bound.width / screen.availWidth);
      bound.width = screen.availWidth * (bound.width / screen.availWidth);
      bound.zoom = screen.availWidth / bound.width;
      //console.log(JSON.stringify(bound));
      //console.log(screen.availWidth + ',' + screen.availHeight);
      //console.log(screen.width + ',' + screen.height);
      break;
    default:
      bound.height = window.innerHeight;
      bound.width = window.innerWidth;
      //bound.zoom = Math.Min(CANVAS_WIDTH / bound.width, CANVAS_HEIGHT / bound.height);
      break;
  }
  return bound;
}

var setScale = (bound) => {
  switch (getUa()) {
    case "Android":
    case "iPad":
    case "iPhone":
      document.getElementsByTagName("canvas")[0].style["-webkit-transform"] = "scale(" + bound.zoom + "," + bound.zoom + ")";
      break;
    default:
      break;
  }
  return bound;
}

const getUa = () => {
  if ((navigator.userAgent.indexOf('iPhone') > 0 && navigator.userAgent.indexOf('iPad') == -1) || navigator.userAgent.indexOf('iPod') > 0) {
    return 'iPhone';
  } else if (navigator.userAgent.indexOf('iPad') > 0) {
    return 'iPad';
  } else if (navigator.userAgent.indexOf('Android') > 0) {
    return 'Android';
  } else return false;
}

