const sp = require("schemapack")

const toServerSchema = sp.build({
    angle: "float64",
    angularVelocity: "float64",
    velocity: {
        0: "float64",
        1: "float64"
    },
    x: "float64",
    y: "float64"
})

const toClientSchema = sp.build({
    angle: "float64",
    angularVelocity: "float64",
    id: "string",
    velocity: {
        0: "float64",
        1: "float64"
    },
    x: "float64",
    y: "float64"
})

module.exports = {
    toServerSchema,
    toClientSchema
}
