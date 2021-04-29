// vocal, drum, bass, and other are volumes ranging from 0 to 100
function draw_one_frame(vocal, drum, bass, other) {
  background(20);
  rectMode(CENTER);

  let bar_spacing = width/5;
  let bar_width = width/6;
  let bar_pos_y = height/2;

  // vocal bar is red
  fill(200, 0, 0);
  rect(1 * bar_spacing, bar_pos_y, bar_width, 4 * vocal);

  // drum bar is green
  fill(0, 200, 0);
  rect(2 * bar_spacing, bar_pos_y, bar_width, 4 * drum);

  // bass bar is blue
  fill(0, 0, 200);
  rect(3 * bar_spacing, bar_pos_y, bar_width, 4 * bass);

  // other bar is white
  fill(200, 200, 200);
  rect(4 * bar_spacing, bar_pos_y, bar_width, 4 * other);
}
