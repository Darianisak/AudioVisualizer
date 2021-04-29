//  Code written for DSDN142 Project 3 by Darian Culver
//
//  This code is a visualiser for the song 'Run' by the artist Joji, off of his
//  album, Nectar.

/*
  Note on how this visualiser operates:
  As there are a lot of manipulations directly key framed in the code, slow loads
  or in some cases, repeat loads, can throw the key framing out by a large margin.

  The easiest way to tell if the key frames are lining is by reading the numbers printed
  to console to check if the drum track comes in at around simTime 550.
*/

/*
  draw_one_frame is essentially the draw loop of this framework.
  With this framework, there is no initialization phase, meaning that
  a first run test must be applied if there are systems or settings that
  need to be run initially.
*/

//  Global variables
let firstRun = true;  //  Used to determine run status
let vocalVol = 0;   //  Stores normalized volume for current run
let drumVol = 0;    //  Ditto
let bassVol = 0;    //  Ditto
let otherVol = 0;   //  Ditto
let simTime = 0;  //  Keep track of the current simulation time


//  Shape variables
let bottomWidth = 30;   //  How wide the coloumns effected by bass data are
let bottomSep = 3;    //  How much seperation there is between the coloumns
let bottomAmount = 0; //  Placeholder assignment for value that determines amount of coloumns for bass
let bottomHeight = 0; //  Height at which coloumns on the within doBottom() are drawn
let bottomScale = 0;  //  Enables easier height control

//  <-----  Draw loop ----->  //

function draw_one_frame(vocal, drum, bass, other) {
  //  Nothing is drawn if repainted at the end, for some reason
  repaintBackground();

  //  Code section that implements first run settings
  if (firstRun) {
    background(80, 40, 40); //  Color used matches album artwork background besides lumos level
    rectMode(CENTER);
    frameRate(12);

    //  Determines bottom cols cols; this can be used to taper off the bottom col height better
    let i = 0;

    while (i < ( width + bottomWidth ))  {  //  Refer to prev. comment
      i += bottomSep + bottomWidth;
      bottomAmount++;
    }

    bottomHeight = ( 100 / bottomAmount ) / 2;  //  The defacto step down rate left to right of bass col height

    firstRun = false;
  }

  //  Colors based on album artwork and use of https://www.sessions.edu/color-calculator/
  let vocalCol = color(230, 40, 45);
  let drumColor = color(40, 160, 160);
  let bassColor = color(40, 40, 160);
  let otherCol = color(160, 160, 40);

  //  Section of code normalises volumes prior to drawing
  vocalVol =  normaliseVolume(vocal);
  drumVol =   normaliseVolume(drum);
  bassVol =   normaliseVolume(bass);
  otherVol =  normaliseVolume(other);

  //  Draws imagery to the screen
  if (doLimit('bass'))  {
    doBottom(bassVol, -1, bassColor, true, 5); //  Draws wave form corresponding with bass volume
  }

  if (doLimit('vox')) {
    doVox(vocalVol, vocalCol, 10);  //  Draws wave form of vocal volume
  }
  if (doLimit('other')) {
    doFlatResponse(otherVol, otherCol, 3);
  }
  if (doLimit('drums')) {
    doBottom(drumVol, -1, drumColor, false, 5);  // Draws wave of drum volume
  }

  simTime++;
  console.log(simTime); //  Logs current sim time for easier debugging
}


// <----- Draw Methods  ----->  //

/*
  Function doBottom(), which was originally doBass() handles the coloumns that run
  from the bottom of the screen up. As two audio channels use near identical processes,
  it makes sense to consolidate them into a singular function with more parameters.

  doBottom() handles the graphical output of coloumns drawn at the bottom of the screen.
  currentVol determines what height these cols will reach,
  scoop controls the peak wave,
  colorVar sets the fill color and
  tailRight is a boolean that determines from which side of the screen it is drawn.
*/

function doBottom(currentVol, scoop, colorVar, tailRight, heightScale) {
  //  Local variables
  let i = 0;
  let k = scoop; //  Counter value that manipulates the scoop of the layer
  let tempHeight = currentVol;

  fill(colorVar);
  if (tailRight) {
    //  Tail right
    while (i < ( width + bottomWidth) )  {  //  Continues to run until the screen is filled horizontally
      if (tempHeight < 0) {return;}
      //  Determines height value to be drawn for current rect
      tempHeight = ( tempHeight - ( bottomHeight * k ) ) + random(0, 2);

      //  Draws and increments
      rect(i, height, bottomWidth, tempHeight * heightScale);
      i += bottomSep + bottomWidth;
      k += 0.2;
    }
  } else {
    //  Tails left
    i = width;
    while (i > ( 0 - bottomWidth) )  {  //  Continues to run until the screen is filled horizontally
      if (tempHeight < 0) {return;}
      //  Determines height value to be drawn for current rect
      tempHeight = ( tempHeight - ( bottomHeight * k ) ) + random(0, 2) ;

      //  Draws and increments
      rect(i, height, bottomWidth, tempHeight * heightScale );
      i = i - (bottomSep + bottomWidth);
      k += 0.2;
    }
  }
}

/*
  doFlatResponse() is a function that operates similiarly to doBottom(), except without the fall off
  in volume representation.
  currentVol is the current channel value from the csv document, colorVar is the fill color and heightScale
  is how much the height should be manipulated.
*/

function doFlatResponse(currentVol, colorVar, heightScale)  {
  //  Local vars
  let rectCentre = 0;

  fill(colorVar);

  for (let i = 0; i < bottomAmount; i++)  { //  Draws flat response curve
    let tempHeight = currentVol;
    tempHeight -= random(0,5);

    rect(rectCentre, height, bottomWidth, tempHeight * heightScale);
    rectCentre += bottomWidth + bottomSep;
  }
}

/*
  doVox() is responsible for the illustration of data from the vocal channel.
  In addition to vocals, it also carries the bulk of guitar content as I guess
  the algorithm didn't mesh too well with the songs mixing.
*/

function doVox(currentVol, colorVar, heightScale) {
  //  Local vars
  let rectCentre = width / 2;
  let tempHeight = currentVol;
  let taperAmount = 4; //  Adjusts how quickly the bars fall off from the centre

  fill(colorVar);

  if (simTime >= 1775 && simTime <= 2340) { //  Changes drop of rate for guitar solo
    taperAmount = 10;
  }

  for (let i = 0; i < bottomAmount / 2; i++)  { //  Produces graphics
    if (i === 0)  { //  Ensures that the first col is the mid and is a peak
      tempHeight = tempHeight + random(0, 1);
      if (tempHeight > height)  {tempHeight = height;}
      rect(rectCentre, height, bottomWidth, tempHeight * heightScale);
    } else if (tempHeight < 0){ //  No point executing if you aren't going to see the coloumn anyway
      return;
    } else {
      tempHeight -= taperAmount + random(0, 5); //  Fall off bars; not the central one
      rect(rectCentre - (i * (bottomWidth + bottomSep)), height, bottomWidth, tempHeight * heightScale);  //  Left col
      rect(rectCentre + (i * (bottomWidth + bottomSep)), height, bottomWidth, tempHeight * heightScale);  //  Right col
    }
  }
}


// <----- Helper Methods  ----->


/*
  Function normaliseVolume operates on the current channel volume level, manipulating
  it so that it produces a much more noticeable effect. Makes it so there are 10 volume levels
*/

function normaliseVolume(channelVol)  {
  let tempVol = channelVol;
  tempVol = tempVol / 10;
  return parseInt(tempVol) * 10;
}

/*
  doLimit() is a boolean function that allows more control over when an audio track
  is actually expressed to screen. This is done by matching the global variable simTime to
  a manually set boundary condition for what frames certain tracks should be expressed at.

  This function is responsible for audio/visual keyframing.

  THIS SYSTEM IS NOT ROBUST; CHANGING FRAME RATES WILL BREAK THIS
  THIS SYSTEM IS NOT ROBUST; SUB OPTIMAL LOAD TIMES WILL BREAK THIS
*/

function doLimit(audioType) {
  switch (audioType)  {
    case 'vox': //  Manipulates expression for vox channel
      if (simTime >= 165 && simTime <= 2365)  {   //  Initially determines if expression is needed
        if (simTime >= 1777 && simTime <= 2340) { //  Amplifies guitar solo
          vocalVol = map(vocalVol, 0, 100, 100, 150);
        } else if ((simTime >= 548 && simTime <= 975) || ( simTime >= 1350 && simTime <= 1777)) {
          vocalVol = map(vocalVol, 0, 100, 50, 125);
        }
        return true;
      } else {
        return false;
      }
      break;
    case 'other': //  Manipulates expression for other channel - Other is always expressed to some level
      if (simTime >= 64 && simTime <= 2365) {
        otherVol = map(otherVol, 0, 150, 0, 40);
      } else {
        otherVol = map(otherVol, 0, 100, 0, 100);
      }
      return true;
      break;
    case 'bass':  //  Manipulates expression for bass channel
      if (simTime >= 63 && simTime <= 2365) {
        if ((simTime >= 548 && simTime <= 975) || ( simTime >= 1350 && simTime <= 1777)) {
          bassVol = map(drumVol, 0, 100, 50, 165);  //  Boosts for choruses
        }
        return true;
      } else {
        return false;
      }

      break;
    case 'drums': //  Manipulates expression for drums channel
      if (simTime >= 548 && simTime <= 2365)   {
        if ((simTime >= 548 && simTime <= 975) || ( simTime >= 1350 && simTime <= 1777)) {
          drumVol = map(drumVol, 0, 100, 50, 165);  //  Boosts for choruses
        }
        return true;
      } else {
        return false;
      }
      break;
    default:
      throw 'audioType is not valid for function doLimit().';
  }
}

/*
  Self explanatory helper function that repaints the background when called
*/

function repaintBackground()  {
  background(80, 40, 40);
}
