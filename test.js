let parser = require("HDLparser");
let fs = require("HDLfilesys");

let parse = new parser.vlogParser();
let code = fs.files.readFile("D:/Project/Code/.prj/Extension/Owner/Digital-IDE/lib/com/Hardware/Math/Cordic.v")
const res = parse.sym(code);
console.log(res.sym);




