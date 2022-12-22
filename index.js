const express = require("express")
const jwt = require("jsonwebtoken")
require('dotenv').config()

const secret = process.env.SECRET
const app = express()

app.post("/token", (req, res) => {
    //datos usuario desde base de datos
    const { id: sub, name } = { id: "josemi", name: "Josemi Correa" }
    const token = jwt.sign({
        //payload y claims
        sub,
        name,
        exp: Date.now() + 60 * 1000
    }, secret)
    res.send({ token })
})

app.get("/public", (req, res) => {
    res.send("Soy publico")
})

app.get("/private", (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const payload = jwt.verify(token, secret)

        if (Date.now() > payload.exp) {
            return res.status(401).send({ error: "Token expirado" })
        }

        res.send("Soy privado")
    } catch (error) {
        res.status(401).send({ error: error.message })
    }
})

app.listen(3000)


