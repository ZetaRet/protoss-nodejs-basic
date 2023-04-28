"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PremiseData_1 = require("./api/PremiseData");
async function refExe() {
    const ref = await new PremiseData_1.Premise((resolve) => {
        setTimeout(() => {
            resolve(new PremiseData_1.Refutation());
        }, 1000);
    });
    return ref;
}
console.log(refExe());
