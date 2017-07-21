var introCanvas,introContext;
introCanvas = document.getElementById("intro");
introContext = introCanvas.getContext("2d");
var introWidth = introCanvas.width;
var introHeight = introCanvas.height;
var introGradient = introContext.createLinearGradient(0,0,introWidth,introHeight);
introGradient.addColorStop(0,"#ff0000");
introGradient.addColorStop(1,"#303030");