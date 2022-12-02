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
  let pythonCompleted = false
  pythonProcess.on("error", function (err) {
    console.error("Oh noez, teh errurz: " + err)
    res.send(err)
    pythonCompleted = true
  })
  pythonProcess.stdout.on("data", (result) => {
    // Do something with the data returned from python script
    console.log(result.toString())
    app.use(express.json())
    // res.sendFile(`/app/${outputFilePath}`)
    res.sendFile(outputFilePath, { root: __dirname }, (err) => {
      fs.unlinkSync(path.join(__dirname, inputFilePath))
      fs.unlinkSync(path.join(__dirname, outputFilePath))
    })

    pythonCompleted = true
  })
  pythonProcess.on("exit", function () {
    if (!pythonCompleted) {
      res.send("python exited without output")
    }
    pythonCompleted = true
  })
})

//Launch listening server on port 3000
app.listen(3001, () => {
  console.log("app listening on port http://localhost:3000!")
})
