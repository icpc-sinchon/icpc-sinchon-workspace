import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "config.json");

// 현재 학기의 정보를 저장하고 있는 JSON 파일을 읽어오거나 업데이트하는 API
export default function handler(req, res) {
  if (req.method === "GET") {
    // Read the JSON file
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);
    res.status(200).json(data);
  } else if (req.method === "POST") {
    // Update the JSON file
    const fileContent = fs.readFileSync(filePath, "utf8");
    const currentData = JSON.parse(fileContent);

    const newSemester = req.body.currentSemester;
    const updatedData = { ...currentData, currentSemester: newSemester };
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
    res.status(200).json(updatedData);
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
