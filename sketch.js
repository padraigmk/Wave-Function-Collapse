let tiles = [];
const tileImages = [];

let grid = [];

const DIM = 30;

const scanGrid = 5

var top_c = []
var right_c = []
var bottom_c = []
var left_c = []
var c_edges = []

const c_threshold = 10;

function preload() {
  // const path = 'rail';
  // for (let i = 0; i < 7; i++) {
  //   tileImages[i] = loadImage(`${path}/tile${i}.png`);
  // }

  const path = 'tiles/circuit-coding-train';
  for (let i = 0; i < 13; i++) {
    tileImages[i] = loadImage(`${path}/${i}.png`);
  }
}

function removeDuplicatedTiles(tiles) {
  const uniqueTilesMap = {};
  for (const tile of tiles) {
    const key = tile.edges.join(','); // ex: "ABB,BCB,BBA,AAA"
    uniqueTilesMap[key] = tile;
  }
  return Object.values(uniqueTilesMap);
}

function setup() {
  createCanvas(800, 800);
  //randomSeed(15);

  // tiles[0] = new Tile(tileImages[0], ['AAA', 'AAA', 'AAA', 'AAA']);
  // tiles[1] = new Tile(tileImages[1], ['ABA', 'ABA', 'ABA', 'AAA']);
  // tiles[2] = new Tile(tileImages[2], ['BAA', 'AAB', 'AAA', 'AAA']);
  // tiles[3] = new Tile(tileImages[3], ['BAA', 'AAA', 'AAB', 'AAA']);
  // tiles[4] = new Tile(tileImages[4], ['ABA', 'ABA', 'AAA', 'AAA']);
  // tiles[5] = new Tile(tileImages[5], ['ABA', 'AAA', 'ABA', 'AAA']);
  // tiles[6] = new Tile(tileImages[6], ['ABA', 'ABA', 'ABA', 'ABA']);



  var domC = [];
  let varEdge = [];
  background(0);

  for (let i = 0; i < 13; i++) {
    domC[i] = splitImage(tileImages[i])
    // image(tileImages[i], 0, 0, width, height)
    // console.log(domC[i])
    for (let ie = 0; ie < scanGrid; ie++) {
      // Top
      top_c[ie] = domC[i][ie]
      right_c[ie] = domC[i][ie * scanGrid + (scanGrid - 1)]
      left_c[ie] = domC[i][ie * scanGrid]
      bottom_c[ie] = domC[i][scanGrid * scanGrid - (scanGrid - ie)]
    }
    c_edges[i] = [top_c, right_c, bottom_c.reverse(), left_c.reverse()]
    top_c = []
    right_c = []
    left_c = []
    bottom_c = []

  }



  // Loaded and created the tiles
  // tiles[0] = new Tile(tileImages[0], ['AAA', 'AAA', 'AAA', 'AAA']);
  // tiles[1] = new Tile(tileImages[1], ['BBB', 'BBB', 'BBB', 'BBB']);
  // tiles[2] = new Tile(tileImages[2], ['BBB', 'BCB', 'BBB', 'BBB']);
  // tiles[3] = new Tile(tileImages[3], ['BBB', 'BDB', 'BBB', 'BDB']);
  // tiles[4] = new Tile(tileImages[4], ['ABB', 'BCB', 'BBA', 'AAA']);
  // tiles[5] = new Tile(tileImages[5], ['ABB', 'BBB', 'BBB', 'BBA']);
  // tiles[6] = new Tile(tileImages[6], ['BBB', 'BCB', 'BBB', 'BCB']);
  // tiles[7] = new Tile(tileImages[7], ['BDB', 'BCB', 'BDB', 'BCB']);
  // tiles[8] = new Tile(tileImages[8], ['BDB', 'BBB', 'BCB', 'BBB']);
  // tiles[9] = new Tile(tileImages[9], ['BCB', 'BCB', 'BBB', 'BCB']);
  // tiles[10] = new Tile(tileImages[10], ['BCB', 'BCB', 'BCB', 'BCB']);
  // tiles[11] = new Tile(tileImages[11], ['BCB', 'BCB', 'BBB', 'BBB']);
  // tiles[12] = new Tile(tileImages[12], ['BBB', 'BCB', 'BBB', 'BCB']);




  for (let i = 0; i < 12; i++) {
    tiles[i] = new Tile(tileImages[i], c_edges[i]);
    tiles[i].index = i;
  }

  const initialTileCount = tiles.length;
  for (let i = 0; i < initialTileCount; i++) {
    let tempTiles = [];
    for (let j = 0; j < 4; j++) {
      tempTiles.push(tiles[i].rotate(j));
    }
    tempTiles = removeDuplicatedTiles(tempTiles);
    tiles = tiles.concat(tempTiles);
  }
  // console.log(tiles.length);

  // Generate the adjacency rules based on edges
  for (let i = 0; i < tiles.length; i++) {
    const tile = tiles[i];
    tile.analyze(tiles);
  }

  startOver();
}

function startOver() {
  // Create cell for each spot on the grid
  for (let i = 0; i < DIM * DIM; i++) {
    grid[i] = new Cell(tiles.length);
  }
}

function checkValid(arr, valid) {
  //console.log(arr, valid);
  for (let i = arr.length - 1; i >= 0; i--) {
    // VALID: [BLANK, RIGHT]
    // ARR: [BLANK, UP, RIGHT, DOWN, LEFT]
    // result in removing UP, DOWN, LEFT
    let element = arr[i];
    // console.log(element, valid.includes(element));
    if (!valid.includes(element)) {
      arr.splice(i, 1);
    }
  }
  // console.log(arr);
  // console.log("----------");
}

function mousePressed() {
  redraw();
}

function draw() {
  background(0);

  // ***** Debugging color matching ********

  // noLoop()
  // var imageToScan = tileImages[7]
  // image(imageToScan, 0, 0, height, width)
  // // debugger;
  // const scan_thickness = 20
  // const segmentWidth = Math.floor(imageToScan.width / scanGrid);
  // const segmentHeight = Math.floor(imageToScan.height / scanGrid);
  // const segments = [];
  // for (let j = 0; j < scanGrid; j++) {
  //   for (let i = 0; i < scanGrid; i++) {
  //     const x = i * segmentWidth;
  //     const y = j * segmentHeight;
  //     if ((i == 0 && j == 0) || (i == scanGrid - 1 && j == scanGrid - 1) || (i == 0 && j == scanGrid - 1) || (i == scanGrid - 1 && j == 0)) {
  //       segmentImageData = imageToScan.get(x, y, segmentWidth, segmentHeight);
  //       strokeWeight(4);

  //       stroke(255)

  //       rect(x, y, segmentWidth, segmentHeight);
  //       image(segmentImageData, x, y, segmentWidth, segmentHeight)

  //     } else {
  //       if (j == 0) { // top
  //         segmentImageData = imageToScan.get(x, y, segmentWidth, scan_thickness);
  //         stroke(255)
  //         rect(x, y, segmentWidth, scan_thickness);
  //         image(segmentImageData, x, y, segmentWidth, scan_thickness)
  //       } else if (j == scanGrid - 1) { // bottom
  //         segmentImageData = imageToScan.get(x, y + segmentHeight - scan_thickness, segmentWidth, scan_thickness);
  //         stroke(255)
  //         rect(x, y + segmentHeight - scan_thickness, segmentWidth, scan_thickness);
  //         image(segmentImageData, x, y + segmentHeight - scan_thickness, segmentWidth, scan_thickness)
  //       } else if (i == scanGrid - 1) { // right
  //         segmentImageData = imageToScan.get(x + segmentWidth - scan_thickness, y, scan_thickness, segmentHeight);
  //         stroke(255)
  //         rect(x + segmentWidth - scan_thickness, y, scan_thickness, segmentHeight);
  //         image(segmentImageData, x + segmentWidth - scan_thickness, y, scan_thickness, segmentHeight)
  //       } else if (i == 0) { // left
  //         segmentImageData = imageToScan.get(x, y, scan_thickness, segmentHeight);
  //         stroke(255)
  //         rect(x, y, scan_thickness, segmentHeight);
  //         image(segmentImageData, x, y, scan_thickness, segmentHeight)
  //       } else { // middle points
  //         segmentImageData = imageToScan.get(x, y, 1, 1);
  //       }
  //     }
  //     // const segmentImageData = imageToScan.get(x, y, segmentWidth, segmentHeight);
  //     segmentImageData.loadPixels()
  //     segments.push(segmentImageData);
  //   }
  // }

  // // Calculate the dominant color of each segment
  // const dominantColors = [];
  // // console.log(segments)
  // for (let i = 0; i < segments.length; i++) {
  //   const pixels = segments[i].pixels;
  //   const colorCounts = {};
  //   let maxCount = 0;
  //   let dominantColor = [0, 0, 0];
  //   for (let j = 0; j < pixels.length; j += 4) {
  //     const r = pixels[j];
  //     const g = pixels[j + 1];
  //     const b = pixels[j + 2];
  //     const color = `rgb(${r},${g},${b})`;
  //     if (i == 1) {
  //       // console.log(color)
  //     }
  //     if (colorCounts[color]) {
  //       colorCounts[color]++;
  //     } else {
  //       colorCounts[color] = 1;
  //     }
  //     if (colorCounts[color] > maxCount) {
  //       maxCount = colorCounts[color];
  //       dominantColor = [r, g, b];
  //     }
  //   }
  //   if (i == 1) {
  //     // debugger;
  //   }
  //   // console.log(dominantColor)
  //   dominantColors.push(dominantColor);
  //   // fill(dominantColor)
  //   // stroke(255)
  //   // let xp = i % scanGrid
  //   // let yp = floor(i / scanGrid)
  //   // circle((segmentWidth / 2) + segmentWidth * xp, (segmentWidth / 2) + segmentWidth * yp, 50)
  // }
  // console.log(dominantColors)


  // **********

  const w = width / DIM;
  const h = height / DIM;
  for (let j = 0; j < DIM; j++) {
    for (let i = 0; i < DIM; i++) {
      let cell = grid[i + j * DIM];
      if (cell.collapsed) {
        let index = cell.options[0];
        image(tiles[index].img, i * w, j * h, w, h);
      } else {
        noFill();
        stroke(51);
        // rect(i * w, j * h, w, h);
      }
    }
  }

  // Pick cell with least entropy
  let gridCopy = grid.slice();
  gridCopy = gridCopy.filter((a) => !a.collapsed);
  // console.table(grid);
  // console.table(gridCopy);

  if (gridCopy.length == 0) {
    return;
  }
  gridCopy.sort((a, b) => {
    return a.options.length - b.options.length;
  });

  let len = gridCopy[0].options.length;
  let stopIndex = 0;
  for (let i = 1; i < gridCopy.length; i++) {
    if (gridCopy[i].options.length > len) {
      stopIndex = i;
      break;
    }
  }

  if (stopIndex > 0) gridCopy.splice(stopIndex);
  const cell = random(gridCopy);
  cell.collapsed = true;
  const pick = random(cell.options);
  if (pick === undefined) {
    startOver();
    return;
  }
  cell.options = [pick];

  const nextGrid = [];
  for (let j = 0; j < DIM; j++) {
    for (let i = 0; i < DIM; i++) {
      let index = i + j * DIM;
      if (grid[index].collapsed) {
        nextGrid[index] = grid[index];
      } else {
        let options = new Array(tiles.length).fill(0).map((x, i) => i);
        // Look up
        if (j > 0) {
          let up = grid[i + (j - 1) * DIM];
          let validOptions = [];
          for (let option of up.options) {
            let valid = tiles[option].down;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }
        // Look right
        if (i < DIM - 1) {
          let right = grid[i + 1 + j * DIM];
          let validOptions = [];
          for (let option of right.options) {
            let valid = tiles[option].left;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }
        // Look down
        if (j < DIM - 1) {
          let down = grid[i + (j + 1) * DIM];
          let validOptions = [];
          for (let option of down.options) {
            let valid = tiles[option].up;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }
        // Look left
        if (i > 0) {
          let left = grid[i - 1 + j * DIM];
          let validOptions = [];
          for (let option of left.options) {
            let valid = tiles[option].right;
            validOptions = validOptions.concat(valid);
          }
          checkValid(options, validOptions);
        }

        // I could immediately collapse if only one option left?
        nextGrid[index] = new Cell(options);
      }
    }
  }

  grid = nextGrid;
  // noLoop()
}

function splitImage(imageToScan) {
  // Draw the image onto the canvas
  // image(imageToScan, 0, 0);

  // Split the image into 9 equal segments
  const scan_thickness = 10
  const segmentWidth = Math.floor(imageToScan.width / scanGrid);
  const segmentHeight = Math.floor(imageToScan.height / scanGrid);
  const segments = [];
  for (let j = 0; j < scanGrid; j++) {
    for (let i = 0; i < scanGrid; i++) {
      const x = i * segmentWidth;
      const y = j * segmentHeight;
      if ((i == 0 && j == 0) || (i == scanGrid - 1 && j == scanGrid - 1) || (i == 0 && j == scanGrid - 1) || (i == scanGrid - 1 && j == 0)) {
        segmentImageData = imageToScan.get(x, y, segmentWidth, segmentHeight);
        strokeWeight(4);

        stroke(255)

        rect(x, y, segmentWidth, segmentHeight);
        image(segmentImageData, x, y, segmentWidth, segmentHeight)

      } else {
        if (j == 0) { // top
          segmentImageData = imageToScan.get(x, y, segmentWidth, scan_thickness);
          stroke(255)
          rect(x, y, segmentWidth, scan_thickness);
          image(segmentImageData, x, y, segmentWidth, scan_thickness)
        } else if (j == scanGrid - 1) { // bottom
          segmentImageData = imageToScan.get(x, y + segmentHeight - scan_thickness, segmentWidth, scan_thickness);
          stroke(255)
          rect(x, y + segmentHeight - scan_thickness, segmentWidth, scan_thickness);
          image(segmentImageData, x, y + segmentHeight - scan_thickness, segmentWidth, scan_thickness)
        } else if (i == scanGrid - 1) { // right
          segmentImageData = imageToScan.get(x + segmentWidth - scan_thickness, y, scan_thickness, segmentHeight);
          stroke(255)
          rect(x + segmentWidth - scan_thickness, y, scan_thickness, segmentHeight);
          image(segmentImageData, x + segmentWidth - scan_thickness, y, scan_thickness, segmentHeight)
        } else if (i == 0) { // left
          segmentImageData = imageToScan.get(x, y, scan_thickness, segmentHeight);
          stroke(255)
          rect(x, y, scan_thickness, segmentHeight);
          image(segmentImageData, x, y, scan_thickness, segmentHeight)
        } else { // middle points
          segmentImageData = imageToScan.get(x, y, 1, 1);
        }
      }
      // const segmentImageData = imageToScan.get(x, y, segmentWidth, segmentHeight);
      segmentImageData.loadPixels()
      segments.push(segmentImageData);
    }
  }

  // Calculate the dominant color of each segment
  const dominantColors = [];
  // console.log(segments)
  for (let i = 0; i < segments.length; i++) {
    const pixels = segments[i].pixels;
    const colorCounts = {};
    let maxCount = 0;
    let dominantColor = [0, 0, 0];
    for (let j = 0; j < pixels.length; j += 4) {
      const r = pixels[j];
      const g = pixels[j + 1];
      const b = pixels[j + 2];
      const color = `rgb(${r},${g},${b})`;
      if (i == 1) {
        // console.log(color)
      }
      if (colorCounts[color]) {
        colorCounts[color]++;
      } else {
        colorCounts[color] = 1;
      }
      if (colorCounts[color] > maxCount) {
        maxCount = colorCounts[color];
        dominantColor = [r, g, b];
      }
    }
    if (i == 1) {
      // debugger;
    }
    // console.log(dominantColor)
    dominantColors.push(dominantColor);
    // fill(dominantColor)
    // stroke(255)
    // let xp = i % scanGrid
    // let yp = floor(i / scanGrid)
    // circle((segmentWidth / 2) + segmentWidth * xp, (segmentWidth / 2) + segmentWidth * yp, 50)
  }

  // Log the dominant color of each segment
  // console.log(dominantColors);
  return dominantColors
}