const express = require("express")
const fs = require("fs")
const path = require("path")
const app = express()
app.use(express.json())
const spawn = require("child_process").spawn

//Define request response in root URL (/)
app.post("/api/v1/animate-photo", async (req, res) => {
  const { imageUrl, userId } = req.body
  const response = await fetch(imageUrl)
  const arrayBuffer = await response.arrayBuffer()

  const fileName = `${userId}.jpg`
  const inputFilePath = `animegan/input/${fileName}`
  const outputFilePath = `animegan/output/${fileName}`
  fs.writeFileSync(inputFilePath, Buffer.from(arrayBuffer))

  const pythonProcess = spawn("python3", [
    "./animegan/main.py",
    "--input",
    inputFilePath,
    "--output",
    outputFilePath,
  ])
  pythonProcess.on("error", function (err) {
    console.error("Python process error out", err)
    res.send(err.toString())
  })

  pythonProcess.on("exit", function () {
    res.sendFile(outputFilePath, { root: __dirname }, (err) => {
      fs.unlinkSync(path.join(__dirname, inputFilePath))
      fs.unlinkSync(path.join(__dirname, outputFilePath))
    })
  })
})

app.get("/health_check", (req, res) => {
  res.send("OK")
})

//Launch listening server on port 3000
app.listen(3000, () => {
  console.log("app listening on port http://localhost:3000!")
})
