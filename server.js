const express = require("express")
const app = express()
const util = require("util")
const PORT = process.env.PORT || 3000;
const fs = require("fs")
const uuid = require("uuid/v4")
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static("Develop/public"))

const arrayDataBase = []

// GET /api/notes - Should read the db.json file and return all saved notes as JSON.
app.get("/api/notes", function (req, res) {
    readFile("./Develop/db/db.json", "utf8")
        .then((data) => res.json(JSON.parse(data)))
        .catch((err) => console.log(err))
})

// DELETE /api/notes/:id - Should recieve a query paramter containing the id of a note to delete. This means you'll need to find a way to give each note a unique id when it's saved. In order to delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file.
app.delete("/api/notes/:id", function (req, res) {
    const chosen = req.params.id
    readFile("./Develop/db/db.json", "utf8")
        .then(data => {
            arrayDataBase.forEach(element => {
                const { id } = element
                if (id === chosen) {
                    arrayDataBase.splice(element, 1)
                }
            })
            const newData = JSON.parse(data)
            return newData.filter(element => {
                const { id } = element
                return id !== chosen
            })
        })
        .then(data => {
            writeFile("./Develop/db/db.json", JSON.stringify(data, null, 2))
        })
        .then(data => {
            readFile("./Develop/db/db.json", "utf8")
                .then(data => {
                    res.json(data)
                })
        })
        .catch(err => {
            console.log(err)
        })
})

// POST /api/notes - Should recieve a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
app.post("/api/notes", function (req, res) {
    const note = { ...req.body, id: uuid() }
    arrayDataBase.push(note)
    fs.writeFile("./Develop/db/db.json", JSON.stringify(arrayDataBase, null, 2), function (err, data) {
    })
    res.json(note)
})

app.get("*", function (req, res) {
    res.redirect("/")
})
app.listen(PORT)