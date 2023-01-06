const { createCanvas } = require("canvas");
const fs = require("fs");

// function genCanvas(name,affiliation) {
//     console.log("canvas"+name+affiliation)
//     const post = {
//         title:
//           "This is to certify that\n" +
//           name + "\nfrom\n" + affiliation+
//           "\nhas successfully completed the FDP on" +
//           "\nBlockchain and Distributed Ledger Technology" +
//           "\nFrom: 2-7 January" +
//           "\nconducted at" +
//           "\nXavier Institute of Engineering, Mumbai"
//       };
//       const width = 500;
//       const height = 500;
//       const titleY = 170;

//       const canvas = document.getElementById("certificate");
//       const context = canvas.getContext("2d");

//       context.fillStyle = "#764abc";
//       context.fillRect(0, 0, width, height);

//       context.font = "bold 20pt 'PT Sans'";
//       context.textAlign = "center";
//       context.fillStyle = "#fff";

//       const text = post.title;

//       context.fillText(text,600,titleY)
//       wrapText(name,affiliation)
// }
function genCanvas(canvas, context, name, affiliation, id) {
  var maxWidth = 400;
  var lineHeight = 25;
  var x = (canvas.width - maxWidth) / 2;
  var y = 60;
  var text =
    "NFT ID:" +
    id +
    "This is to certify that " +
    name +
    " from " +
    affiliation +
    "has successfully completed the FDP on " +
    "Blockchain and Distributed Ledger Technology " +
    " From: 2-7 January " +
    "conducted at" +
    " Xavier Institute of Engineering, Mumbai";

//   context.fillStyle = "##153f82";
//   context.fillRect(0, 0, 450, 200);

  context.font = "16pt Calibri";
  context.fillStyle = "#000000";
  var words = text.split(" ");
  var line = "";

  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + " ";
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

export default genCanvas;
