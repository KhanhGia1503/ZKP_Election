const express = require("express");
const app = express()

app.get("/", (req, res) => {
    res.send("This is election zkp")
})

const PORT = process.env.PORT || 5800

app.listen(PORT, () => console.log(`Project run on port ${PORT}`))