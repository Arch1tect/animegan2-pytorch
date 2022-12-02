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
  const inputFilePath = path.join(__dirname, `animegan/input/${fileName}`)
  console.log(inputFilePath)
  const outputFilePath = path.join(__dirname, `animegan/output/${fileName}`)
  console.log(outputFilePath)

  fs.writeFileSync(inputFilePath, Buffer.from(arrayBuffer))

  const pythonProcess = spawn("python3", [
    path.join(__dirname, `animegan/main.py`),
    "--input",
    inputFilePath,
    "--output",
    outputFilePath,
  ])
  pythonProcess.on("error", function (err) {
    console.error("Python process error out", err)
    res.send(err.toString())
  })
  pythonProcess.stdout.on("data", (result) => {
    // Do something with the data returned from python script
    console.log(result.toString())
  })
  pythonProcess.stderr.on("data", (result) => {
    // Do something with the data returned from python script
    console.log(result.toString())
  })
  pythonProcess.on("exit", function () {
    console.log("python exited")
    res.sendFile(outputFilePath, (err) => {
      if (err) {
        res.send("failed")
      }
      fs.unlinkSync(inputFilePath)

      fs.unlinkSync(outputFilePath)
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
