const express = require("express")
const fs = require("fs")

const app = express()
const spawn = require("child_process").spawn

//Define request response in root URL (/)
app.get("/", async (req, res) => {
  const url =
    "https://firebasestorage.googleapis.com/v0/b/topic-chat-30112.appspot.com/o/users%2F1jH4NLL94QPSNXnFW1s5cWMMFXP2%2Fprofile%2F05-140153_739.jpeg?alt=media&token=99450ee8-a836-4b33-9bc3-1b4d29ad2ac8"
  // TODO get url from request
  // File name doesn't really matter, we can use user id
  const userId = "uuid-123"

  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  const dateStr = new Date().toISOString().split("T")[0]
  fs.mkdirSync(`animegan/input/${dateStr}`, { recursive: true })
  const fileName = `${userId}.jpg`
  fs.writeFileSync(
    `animegan/input/${dateStr}/${fileName}`,
    Buffer.from(arrayBuffer)
  )
  console.log("hi")

  const pythonProcess = spawn("python3", ["./animegan/main.py"])
  let pythonCompleted = false
  pythonProcess.on("error", function (err) {
    console.error("Oh noez, teh errurz: " + err)
    res.send(err)
    pythonCompleted = true
  })
  pythonProcess.stdout.on("data", (result) => {
    // Do something with the data returned from python script
    console.log(result.toString())
    res.send("data")
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
