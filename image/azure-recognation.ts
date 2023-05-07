import { ComputerVisionClient } from "@azure/cognitiveservices-computervision";
import { CognitiveServicesCredentials } from "@azure/ms-rest-azure-js";
import { writeFileSync } from "fs";

async function main() {
  const computerVisionKey = process.env["computerVisionKey"] || "";
  const computerVisionEndPoint = process.env["computerVisionEndPoint"] || "";
  const cognitiveServiceCredentials = new CognitiveServicesCredentials(
    computerVisionKey
  );
  const client = new ComputerVisionClient(
    cognitiveServiceCredentials,
    computerVisionEndPoint
  );

  const url =
    "https://fam-development.s3.ap-south-1.amazonaws.com/posts/images/633c1eb32fb5768910bebc0a-643249dd2dc26784fd5bef39-9316b11d-13b0-4d70-bd3f-4d284611e364.jpg" ||
    "https://learn.microsoft.com/en-us/azure/cognitive-services/computer-vision/images/red-shirt-logo.jpg" ||
    "https://abinashphulkonwar.vercel.app/_next/image?url=%2Fbanner%2F1.png&w=1080&q=100";

  client
    .analyzeImage(url, {
      maxCandidates: 1,
      language: "en",
      visualFeatures: [
        "Categories",
        "Description",
        "Tags",
        "Brands",
        "Adult",
        "Faces",
        "ImageType",
        "Objects",
        "Color",
      ],
    })
    .then((result) => {
      console.log("The result is:");
      console.log(result);
      writeFileSync("data.json", JSON.stringify(result));
    })
    .catch((err) => {
      console.log("An error occurred:");
      console.error(err);
    });
}

main();
