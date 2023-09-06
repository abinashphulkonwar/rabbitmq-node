import { data } from "./data";
import { writeFileSync } from "fs";

const textData: string[] = [];

data.analyzeResult.readResults.map((text) => {
  text.lines.map((val) => {
    textData.push(val.text);
  });
});
const text = textData.join("\n");
console.log(text);
writeFileSync("text.txt", text);
