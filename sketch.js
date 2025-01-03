let interval = 10;
let lastUpdate = 0;
let bg = 0;

// Variables to store previous counts for rate of change
let norPrev = 0,
  squPrev = 0,
  triPrev = 0,
  sinPrev = 0;

let norRate, sinRate, squRate, triRate;

let norViz = [];
let squViz = [];
let triViz = [];
let sinViz = [];
let points = [norViz, sinViz, squViz, triViz];
let pOffset = 0;
let x = 0;

function setup() {
  createCanvas(720, 720);
  background(bg);

  strokeWeight(8);
  millis();
  frameRate(30); 
  noCursor(); 
}

function draw() {
  background(bg);

  let mil = new Date().getMilliseconds();

  let actualSec = second() * 1000 + mil;
  let normalizedTime = map(actualSec, 0, 60000, 0, 1);

  // normal clock
  stroke("red");
  sx = map(normalizedTime, 0, 1, 0, width);
  sy = map(normalizedTime, 0, 1, height, 0);
  norInc = 1;
  norCount = normalizedTime * 60;
  // point(sx, sy);

  // square clock
  stroke("black");
  if (normalizedTime < 0.5) {
    squInc = 0;
  } else {
    squInc = 2;
  }
  squCount = ((actualSec - 30000) * squInc) / 1000;
  // squY = map(squCount, 0, 60, height, 0);
  // point(sx, squY);

  // half sinewave
  stroke("green");
  triInc = map(normalizedTime, 0, 1, 0, PI / 2);
  triVal = sin(triInc);
  triIncViz = map(triVal, 0, 1, 2, 0);

  triCount = map(triVal, 0, 1, 0, 60);
  // triY = map(triCount, 0, 60, height, 0);
  // point(sx, triY);

  // full sinewave
  stroke("blue");
  sinInc = map(normalizedTime, 0, 1, 0, PI * 2);

  sinVal = map(sin(sinInc), -1, 1, 5, -5);
  sinIncViz = map(sinVal, 5, -5, 2, 0);

  sinCount = actualSec / 1000 + sinVal;

  let counts = [norCount, sinCount, squCount, triCount];
  let incs = [norInc, sinIncViz, squInc, triIncViz];

  fill(255);
  stroke(255);

  for (let i = 0; i < counts.length; i++) {
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(40);
    textX = width/15;
    textY = (height / 4) * (i + 0.5);
    text(nf(counts[i], 2, 3), textX, textY);

    let y = map(incs[i], 0, 5, 0, -height / 4) + height / 20;
    stroke(255);

    /////////////////
    x += 0.0001;
    // x += 0.002;
    pointX = map(x, 0, 2, 180, width - 75);

    /////////////////

    if (pointX > width * 0.85) {
      pointX = width * 0.85;
      // at the end
      for (let j = 0; j < points[i].length; j++) {
        // x stays the same
        points[i][j][0] = points[i][j][0];
        // y moves
        if (j == points[i].length - 1) {
          points[i][j][1] = pointY = textY + y;
        } else {
          points[i][j][1] = points[i][j + 1][1];
        }
      }
    } else {
      pointY = textY + y;
      points[i].push([pointX, pointY]);
    }

    beginShape();
    for (let j = 0; j < points[i].length; j++) {
      noFill();
      strokeWeight(3);
      vertex(points[i][j][0], points[i][j][1]);
    }
    endShape();
    fill(255);
    textSize(15);
    textAlign(LEFT, TOP);

    strokeWeight(12);
    point(pointX, pointY);
    noStroke();

    text(nf(incs[i], 1, 3), pointX + 10, pointY - 20);
  }
}
