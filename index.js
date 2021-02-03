// Need this because html colour pickers use hex colour codes but javascript requires RGB format 
function hexToRGB(h){
  let r = "0x" + h[1] + h[2];
  let g = "0x" + h[3] + h[4];
  let b = "0x" + h[5] + h[6];
  return "rgb("+ +r + ", " + +g + ", " + +b + ")"; 
}

function randomHexColour(){
  let colourString = "#";
  for(let i = 0; i < 6; i++){
    let x = Math.floor(Math.random() * 16);
    colourString += x.toString(16);
  }
  return colourString;
}

function makeCollageBoard(){
  let x = 0;
  while(x < numberOfCells){
    grid.children[x].style.background = randomHexColour();
    x++;
  }
}

function setLineColour(givenColour){
  for(let eachCell of grid.children){
    // Listen for both single clicks and dragging while mouse button is down
    eachCell.addEventListener("mousedown", () => { 
      eachCell.style.background = givenColour;
    }); 
    eachCell.addEventListener("mouseenter", function(event){
      if(event.buttons==1){  
        event.target.style.background = givenColour;
      }
    });
  }
  const rainbowState = document.getElementById("rainbowState");
  rainbowState.textContent = "OFF";
  const eraserState = document.getElementById("eraserState");
  eraserState.textContent = "OFF";
  previousLineColour = currentLineColour; 
  currentLineColour = givenColour; 
}

function setRainbowLine(){
  for (let eachCell of grid.children){
    eachCell.addEventListener("mousedown", () => { 
      eachCell.style.background = randomHexColour();
    }); 
    eachCell.addEventListener("mouseenter", function(event){
      if(event.buttons == 1){  
        event.target.style.background = randomHexColour();
      }
    });
  }
  if(eraserState.textContent === "ON"){
    eraserState.textContent = "OFF"
  }
}

function makeGridTemplate(numberOfColumns, numberOfRows){
  let templateString = "";
  let columnIndex = 0;
  let rowIndex = 0;
  let cellIndex = 0;
  while(rowIndex < numberOfRows){
    while(columnIndex < numberOfColumns){
      if(columnIndex === 0 ){
        templateString += "\n\'"; // At start of each row, add a new line and opening quote
      }
      templateString += "cell" + cellIndex; // Add the cell name concatenated with the cell index
      cellIndex++; // Increment the cell index for next cell
      if(columnIndex < numberOfColumns-1){
        templateString += " "; // Add space between each cell
      }
      columnIndex++; 
    }
    templateString += "\'"; // Add closing quote
    rowIndex++;
    columnIndex = 0;
  }
  return templateString;
}

function fillGrid(givenColour){
  for(let eachCell of grid.children){
    eachCell.style.background = givenColour;
  }
  previousFillColour = currentFillColour; 
  currentFillColour = givenColour; 
} 

function fillBackOnly(givenColour){
  for(let eachCell of grid.children){
    if(eachCell.style.background === hexToRGB(currentFillColour)){
      eachCell.style.background = givenColour;
    }
  }
  previousFillColour = currentFillColour; 
  currentFillColour = givenColour; 
  if(eraserState.textContent==="ON"){
    setLineColour(currentFillColour);
    eraserState.textContent="ON";
  }
}

function updateGrid(){
  numberOfRows = 100 - slider.value;
  numberOfColumns = Math.ceil(numberOfRows * 1.3); 
  numberOfCells = numberOfRows * numberOfColumns;
  grid.setAttribute("style", 
    `grid-template-areas: ${makeGridTemplate(numberOfColumns, numberOfRows)};`); 
  htmlString = ``;
  for(let i = 0; i < numberOfCells; i++){
    htmlString += `<div id="cell${i}" style="grid-area: cell${i}; border: 1px solid blue; "></div>`
  } 
  grid.innerHTML = htmlString; 
  setLineColour(currentLineColour); 
  fillGrid(currentFillColour);
}

const grid = document.getElementById("grid");
const fillColourPicker = document.getElementById("fillColourPicker");
const randomizeFillColour = document.getElementById("fillColourRandomize");
const slider = document.getElementById("slider"); 
const sliderLabel = document.getElementById("sliderLabel");
const reset = document.getElementById("reset");
const clearButton = document.getElementById("clearButton");
const collageBoard = document.getElementById("collageBoard");
const rainbowToggle = document.getElementById("rainbowToggle");
const rainbowState = document.getElementById("rainbowState");
rainbowState.textContent = "OFF";
const eraserToggle = document.getElementById("eraserToggle");
const eraserState = document.getElementById("eraserState");
eraserState.textContent = "OFF"
const lineColourPicker = document.getElementById("lineColourPicker");
const randomizeLineColour = document.getElementById("lineColourRandomize");
let defaultLineColour = "#383838";
let defaultFillColour = "#DEDEDE";
lineColourPicker.value = defaultLineColour;
fillColourPicker.value = defaultFillColour;
let currentLineColour = defaultLineColour;
let currentFillColour = defaultFillColour; 
let previousLineColour; 
let previousFillColour; 
let numberOfRows;
let numberOfColumns;
let numberOfCells;
updateGrid();

fillColourPicker.addEventListener("input", ()=>{ 
  fillBackOnly(fillColourPicker.value);
});

randomizeFillColour.addEventListener("click", ()=>{
  fillColourPicker.value = randomHexColour();
  fillBackOnly(fillColourPicker.value);
});

slider.addEventListener('input', ()=>{
  updateGrid();
});

reset.addEventListener("click", ()=>{
  slider.value = 50;
  fillColourPicker.value = defaultFillColour;
  lineColourPicker.value = defaultLineColour;
  currentLineColour = defaultLineColour;
  currentFillColour = defaultFillColour;
  updateGrid();
});

clearButton.addEventListener("click", ()=>{
  fillGrid(currentFillColour);
})

collageBoard.addEventListener("click", ()=>{
  makeCollageBoard();
});

rainbowToggle.addEventListener("click", ()=>{
  if (rainbowState.textContent === "OFF"){
    setRainbowLine();
    rainbowState.textContent = "ON";
  } else if (rainbowState.textContent === "ON"){
    setLineColour(lineColourPicker.value);
    rainbowState.textContent = "OFF";
  }
});

eraserToggle.addEventListener("click", ()=>{
  if (currentLineColour !== currentFillColour){
    setLineColour(currentFillColour);
    eraserState.textContent = "ON";
  } else if (currentLineColour === currentFillColour){
    setLineColour(previousLineColour);
    eraserState.textContent = "OFF";
  }  
});

lineColourPicker.addEventListener("input", function(){ 
  setLineColour (lineColourPicker.value);
});

randomizeLineColour.addEventListener("click", ()=>{
  lineColourPicker.value = randomHexColour();
  setLineColour(lineColourPicker.value);
});











