$(document).ready(function() {
});

var red = [241,111,81];
var green = [71,189,114];
var blue = [84,168,231];
var yellow = [233,217,100];
var purple = [151,84,157];
var heart = [230,71,165];

var pixelBuffer = 40;

function analyse (canvas, ctx) {
  var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var data = imgd.data;
  
  var cells = initCells();
  var testCells = initTestCells();
  
  function initTestCells() {
    return [['r', 'p', 'p', 'y', 'b', 'y'],
            ['p', 'h', 'b', 'r', 'b', 'r'],
            ['y', 'y', 'b', 'b', 'r', 'y'],
            ['b', 'p', 'g', 'g', 'r', 'r'],
            ['y', 'y', 'p', 'r', 'g', 'y']];
  }  
  
  function initCells() {
    return [['?', '?', '?', '?', '?', '?'],
            ['?', '?', '?', '?', '?', '?'],
            ['?', '?', '?', '?', '?', '?'],
            ['?', '?', '?', '?', '?', '?'],
            ['?', '?', '?', '?', '?', '?']];
  }
  
  
  segment(canvas, ctx);

	function segment(canvas, ctx) {
		var height = canvas.height;
		var width = canvas.width;
		var heightRatio = 0.45;
    
    var boardStart = heightRatio * height;
		var boardHeight = height - (height * heightRatio);
    var boardWidth = width;
		
		var boardRows = 5;
		var boardCols = 6;

    var cellHeight = Math.floor(boardHeight / boardRows);
    var cellWidth = Math.floor(width / boardCols);
    
    var cellPadding = Math.floor(cellHeight * 0.3); 

    var length  = (cellWidth - (cellPadding*2)) * (cellHeight- (cellPadding*2));
    
    for(var col = 0; col < boardCols; ++col) {
      for(var row = 0; row < boardRows; ++row) {
        var avg = [0, 0, 0];
        var tot = [0, 0, 0];
        
        for(var x = (cellWidth * col) + cellPadding; x < (cellWidth * (col+1)) - cellPadding; ++x) {   
          for(var y = (boardStart + (cellHeight * row)) +cellPadding; y < (boardStart + (cellHeight * (row+1))) - cellPadding; ++y) {
            var index = ((y * width) + x) * 4;

            var r = data[index  ];
            var g = data[index+1];
            var b = data[index+2];
            
            //data[index  ] = 255;
            //data[index+1] = 0;
            //data[index+2] = 255;
            
            tot[0] += r;
            tot[1] += g;
            tot[2] += b;
            
          }
        }
        avg[0] = Math.round(tot[0]/length);
        avg[1] = Math.round(tot[1]/length);
        avg[2] = Math.round(tot[2]/length);
        
        cells[row][col] = calculateColor(avg[0], avg[1], avg[2]);
        
        //alert(cells[row][col]);
        
        //write(testCells[row][col] + ": " + avg);
        
      }
    }

    //ctx.putImageData(imgd, 0, 0);   
    
    for(var row = 0; row < boardRows; ++row) {
      var buffer = '';
      for(var col = 0; col < boardCols; ++col) {
        buffer += cells[row][col];
      }
      $('#output').val(function(i, text) {
        return text + buffer + "\n";
      });
      //write(buffer + "<br/>");
    }
	}
}

function calculateColor(r, g, b) {
  
  if(isRed(r, g, b)) {
    return 'r';
  }
  
  if(isGreen(r, g, b)) {
    return 'g';
  }
  
  if(isBlue(r, g, b)) {
    return 'b';
  }
  
  if(isYellow(r, g, b)) {
    return 'y';
  }
  
  if(isPurple(r, g, b)) {
    return 'p';
  }
  
  if(isHeart(r, g, b)) {
    return 'h';
  }
  
  return '?';
}

function isRed(r, g, b) {
  return inRange(r, red[0], pixelBuffer) &&
         inRange(g, red[1], pixelBuffer) &&
         inRange(b, red[2], pixelBuffer);
}

function isGreen(r, g, b) {
  return inRange(r, green[0], pixelBuffer) &&
         inRange(g, green[1], pixelBuffer) &&
         inRange(b, green[2], pixelBuffer);
}

function isBlue(r, g, b) {
  return inRange(r, blue[0], pixelBuffer) &&
         inRange(g, blue[1], pixelBuffer) &&
         inRange(b, blue[2], pixelBuffer);
}

function isYellow(r, g, b) {
  return inRange(r, yellow[0], pixelBuffer) &&
         inRange(g, yellow[1], pixelBuffer) &&
         inRange(b, yellow[2], pixelBuffer);
}

function isPurple(r, g, b) {
  return inRange(r, purple[0], pixelBuffer) &&
         inRange(g, purple[1], pixelBuffer) &&
         inRange(b, purple[2], pixelBuffer);
}

function isHeart(r, g, b) {
  return inRange(r, heart[0], pixelBuffer) &&
         inRange(g, heart[1], pixelBuffer) &&
         inRange(b, heart[2], pixelBuffer);
}

function inRange(val, target, range) {
  return (val < target + range) && (val > target - range);
}


function write(msg) {
  var p = document.createElement('div');
  p.innerHTML = msg;
  document.body.appendChild(p);
}

function loadImage() {
  var input, file, fr, img;
  
  $("#output").val("");

  if (typeof window.FileReader !== 'function') {
    write("The file API isn't supported on this browser yet.");
    return;
  }

  input = document.getElementById('imgfile');
  if (!input) {
    alert("Um, couldn't find the imgfile element.");
  }
  else if (!input.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
  }
  else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");
  }
  else {
    file = input.files[0];
    fr = new FileReader();
    fr.onload = createImage;
    fr.readAsDataURL(file);
  }

  function createImage() {
    img = new Image();
    img.onload = imageLoaded;
    img.src = fr.result;
  }

  function imageLoaded() {
    var canvas = document.getElementById("canvas")
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img,0,0);
    analyse(canvas, ctx);
  }


	

}



