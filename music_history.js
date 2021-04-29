let vocal_history = [];
let drum_history = [];
let bass_history = [];
let other_history = [];

function draw_history_line(history) {
  beginShape(LINES);
  for(let i=0; i<history.length; i++) {
    let x = i*4;
    let y = map(history[i], 0, 100, height, 0, true);
    vertex(x, y);
  }
  endShape();
}

function add_to_history(history, d) {
  history.push(d);
  if(history.length >= (width-1)/4) {
    history.shift();
  }
}

function draw_one_frame(vocal, drum, bass, other) {
  background(20);

  add_to_history(vocal_history, vocal);
  add_to_history(drum_history, drum);
  add_to_history(bass_history, bass);
  add_to_history(other_history, other);

  strokeWeight(10);  

  // vocal bar is red
  stroke(200, 0, 0);
  draw_history_line(vocal_history);

  // drum bar is green
  stroke(0, 200, 0);
  draw_history_line(drum_history);

  // bass bar is blue
  stroke(0, 0, 200);
  draw_history_line(bass_history);

  // other bar is white
  stroke(200, 200, 200);
  draw_history_line(other_history);
}

function reset_music() {
  vocal_history = [];
  drum_history = [];
  bass_history = [];
  other_history = [];
}