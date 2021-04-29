
function draw_one_frame(vocal, drum, bass, other) {
  background(100, 200, 100);
  fill(100, 255, 100);

  let stripeWidth = map(other, 40, 100, 40, 80, true);

  let numStripes = height / stripeWidth;
  for(let i=0; i<numStripes; i=i+2) {
    let cury = map(i, 0, numStripes-1, 0, height);
    rect(0, cury, width, stripeWidth);
  }

  let triangleHeight = map(bass, 40, 100, 100, 400, true);
  fill(100, 100, 255);
  for(let i=0; i<3; i++) {
    let cur_x = map(i, 0, 4, 0, width);
    let next_x = map(i+1, 0, 3, 0, width);
    let mid_x = (cur_x + next_x) / 2.0;
    let cur_y = 4 * height / 5;
    triangle(cur_x, cur_y, mid_x, cur_y - triangleHeight, next_x, cur_y);
  }


  let drumSize = map(drum, 30, 100, 30, 300, true);
  fill(200, 200, 200);
  rect(0, 0, drumSize, drumSize);
  rect(width, 0, -drumSize, drumSize);
  rect(0, height, drumSize, -drumSize);
  rect(width, height, -drumSize, -drumSize);

  let ovalPlace = map(vocal, 20, 100, height-50, 50, true);
  let ovalSize = map(vocal, 20, 100, 60, 150, true);
  fill(200, 150, 150);
  ellipse(width/2, ovalPlace, ovalSize);
}
