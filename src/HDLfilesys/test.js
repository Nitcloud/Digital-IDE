const fs = require("./index");

let list = ["init first"];
console.log(fs.files.getHDLFiles("D:/Project/ASIC/FFT_IFFT_IP", list, ["D:/Project/ASIC/FFT_IFFT_IP/user/src"]));