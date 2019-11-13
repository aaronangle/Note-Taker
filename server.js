const express = require("express")
const app = express()
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("public"))

app.get("/api/notes", function (req, res) {
    res.json([
        {
            id: 1,
            text: "hello",
            title: "heyyooo"
        },
    ])
})

app.post("/api/notes", function (req, res) {
    const note = { ...req.body, id: randID }
    res.json(note)
})

app.get("*", function (res, req) {
    res.redirect("/")
})
app.listen(PORT)