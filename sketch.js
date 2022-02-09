/*
L-system tree generator with p5.js

Author: Adam Gardell, 2022

Program for testing different l-systems for generation of geometry, trees in particular.
The program can run in a browser and has a gui including some presets.
Tree is redrawn for each frame, which can cause the web browser to hang if too many iterations are made.

Functions for generating the l-system and the turtle graphics based on functions from The Coding Train (https://github.com/CodingTrain/website/blob/main/CodingChallenges/CC_016_LSystem/P5/sketch.js) 

*/

// Variables for rules
let sentence;
let sentences = []
let currentRules = []

// To store some random numbers for 3D rotations
let randomNumbers = []

// For displaying generated sentence 
let sentenceDisplayed = false


// Gui class
class guiVariables {
  constructor() {
    this.iterations
    this.angle
    this.angle2
    this.length
    this.width
    this.leavesOn
    this.leaf_Length = 5
    this.leaf_Width = 2
  }
}

// Another Gui class for the rules
class guiRules {
  constructor() {
    this.axiom
    this.rule0a
    this.rule0b
    this.rule1a
    this.rule1b
    this.display = false;
  }
}

// Function to generate sentence for l-system
function generate() {

  var nextSentence = ""

  for (var i = 0; i < sentence.length; i++) {
    var current = sentence.charAt(i)
    var found = false
    for (var j = 0; j < currentRules.length; j++) {
      if (current == currentRules[j].a) {
        found = true
        nextSentence += currentRules[j].b
        break;
      }
    }
    if (!found) {
      nextSentence += current
    }
  }
  sentence = nextSentence

  sentences.push(sentence)
}

// Function for drawing the tree. Goes through the selected generated sentence
function turtle() {

  branchSize = guiVar.width
  len = guiVar.length
  leafLength = guiVar.leaf_Length
  leafWidth = guiVar.leaf_Width
  let currentAngle = guiVar.angle
  let currentSentence = sentences[guiVar.iterations] // Select the sentence that corresponds to current iterations set

  if (rules.display) {
    if (sentenceDisplayed == false) {
      sentenceDiv.html(currentSentence)
      sentenceDisplayed = true
    }
  }
  else {
    sentenceDiv.html("")
    sentenceDisplayed = false
  }

  stroke(70, 40, 20) // Color of branches

  for (var i = 0; i < currentSentence.length; i++) {

    strokeWeight(branchSize);

    var current = currentSentence.charAt(i);

    // Forward
    if (current == "F") {
      line(0, 0, 0, 0, -len, 0)
      translate(0, -len, 0)
    }
    // Left (And then random angle around other axes)
    else if (current == "+") {
      rotateZ(-currentAngle)
      rotateY(randomNumbers[i % 50])
      rotateX(randomNumbers[(i + 1) % 50])
    }
    // Right (And then random angle around other axes)
    else if (current == "-") {
      rotateZ(currentAngle)
      rotateY(randomNumbers[(i + 3) % 50])
      rotateX(randomNumbers[(i + 4) % 50])
    }
    // Save position
    else if (current == "[") {
      push();
    }
    // Draw leaf and then go back to last saved position
    else if (current == "]") {
      if (guiVar.leavesOn) {
        fill(0, 100, 20)
        stroke(0, 100, 20)
        strokeWeight(leafWidth)
        line(0, 0, 0, 0, -leafLength, 0);
      }
      pop()
    }

  }
}

// Pre-generate the sentences for the different iterations based on the current rules
function generateSentences() {
  sentences = [];
  sentence = rules.axiom;
  sentences.push(sentence)
  for (var i = 0; i <= 5; i++) {
    generate()
  }
}

// Set rules to new values and generate sentences based on them
function recalculateSystem() {
  currentRules[0] = { a: rules.rule0a, b: rules.rule0b }
  currentRules[1] = { a: rules.rule1a, b: rules.rule1b }
  generateSentences()
}

// Create some different random angles in given interval from gui
function random3Dangle() {
  randomNumbers = []
  for (var i = 0; i <= 50; i++) {
    randomNumber = random(-guiVar.angle2, guiVar.angle2)
    randomNumbers.push(randomNumber)
  }
}

// Reset paragraph for displaying sentence on the page
function resetParagraph() {
  sentenceDisplayed = false
  sentenceDiv.html("")
}

// Presets
function treePresets(chosenNr) {
  rules.rule1a = ""
  rules.rule1b = ""
  if (chosenNr == 1) {
    guiVar.leavesOn = true
    rules.axiom = "F"
    rules.rule0a = "F"
    rules.rule0b = "F[+F]F[-F]F"
    guiVar.iterations = 3
    guiVar.length = 14
    guiVar.angle = 25
    guiVar.angle2 = 15
    guiVar.width = 1.4

  }
  if (chosenNr == 2) {
    guiVar.leavesOn = true
    rules.axiom = "F"
    rules.rule0a = "F"
    rules.rule0b = "F[+F]F[-F][F]"
    guiVar.iterations = 3
    guiVar.length = 24
    guiVar.angle = 20
    guiVar.angle2 = 15
    guiVar.width = 1.4
  }
  if (chosenNr == 3) {
    rules.axiom = "X"
    rules.rule0a = "F"
    rules.rule0b = "FF"
    rules.rule1a = "X"
    rules.rule1b = "F[+X]F[-X]+X"
    guiVar.iterations = 4
    guiVar.length = 14
    guiVar.angle = 20
  }
  if (chosenNr == 4) {
    guiVar.leavesOn = true
    rules.axiom = "X"
    rules.rule0a = "X"
    rules.rule0b = "F-[[X]+X]+F[+FX]-X"
    rules.rule1a = "F"
    rules.rule1b = "FF"
    guiVar.iterations = 3
    guiVar.length = 20
    guiVar.angle = 23
    guiVar.angle2 = 5
    guiVar.width = 1.4
  }

  recalculateSystem()
  random3Dangle()
}

function setup() {

  createCanvas(windowWidth, windowHeight - 100, WEBGL)
  angleMode(DEGREES)

  guiVar = new guiVariables()
  rules = new guiRules()
  treePresets(1)

  // GUI setup
  let gui_tree = new dat.GUI()

  gui_tree.add(guiVar, 'iterations', 0, 5, 1).listen().onChange(function () { resetParagraph() })
  gui_tree.add(guiVar, 'angle', 1, 90, 1).listen()
  angleController3D = gui_tree.add(guiVar, 'angle2', 0, 45, 1).listen().onChange(function () { random3Dangle() })
  gui_tree.add(guiVar, 'length', 1, 100).listen()
  gui_tree.add(guiVar, 'width', 1, 50).listen()
  leavesController = gui_tree.add(guiVar, 'leavesOn').name('Leaves').listen().onChange(function () { !guiVar.leavesOn })
  gui_tree.add(guiVar, 'leaf_Length', 0, 50, 1).listen()
  gui_tree.add(guiVar, 'leaf_Width', 0, 25, 1).listen()

  const ruleFolder = gui_tree.addFolder("Rules")
  axiomController = ruleFolder.add(rules, 'axiom').listen().onChange(function () { generateSentences(), resetParagraph() })
  ruleController1 = ruleFolder.add(rules, 'rule0a').listen().onChange(function () { recalculateSystem(), resetParagraph() })
  ruleController2 = ruleFolder.add(rules, 'rule0b').listen().onChange(function () { recalculateSystem(), resetParagraph() })
  ruleController3 = ruleFolder.add(rules, 'rule1a').listen().onChange(function () { recalculateSystem(), resetParagraph() })
  ruleController4 = ruleFolder.add(rules, 'rule1b').listen().onChange(function () { recalculateSystem(), resetParagraph() })
  displaySentenceController = ruleFolder.add(rules, 'display').name('Display rules').listen().onChange(function () { !rules.display })
  ruleFolder.open()

  const presetFolder = gui_tree.addFolder("Presets");
  presetFolder.add({ Tree1: function () { treePresets(1), resetParagraph() } }, 'Tree1')
  presetFolder.add({ Tree2: function () { treePresets(2), resetParagraph() } }, 'Tree2')
  presetFolder.add({ Tree3: function () { treePresets(3), resetParagraph() } }, 'Tree3')
  presetFolder.add({ Tree4: function () { treePresets(4), resetParagraph() } }, 'Tree4')

  presetFolder.open()

  generateSentences()
  random3Dangle();

  sentenceDiv = createP("").position(30)
}

// Draw function, called every frame
function draw() {
  translate(0, 100, 0)
  background(175)
  turtle()
  orbitControl()
  //branch(100)
}

/*
recursive tree, old code
function branch(length) {

  strokeWeight(map(length, 10, 100, 0.7, 5))
  stroke(70, 40, 20)

  if (length > minLength) {
    line(0, 0, 0, 0, -length - 1, 0)

    push()
    
    translate(0, -length, 0)
    rotateY(120)
    rotateZ(angle)
    branch(length * scaleVal)

    pop()

    push()

    translate(0, -length, 0)
    rotateY(120)
    rotateZ(-angle)
    branch(length * scaleVal)

    pop()

  } else {

    translate(0, -length, 0)
    //translate(5, 0, 0)
    rotateZ(90)
    fill(0, 100, 20)
    stroke(0, 100, 20)
    sphere(1, 20, 20)
  }

}*/




