import chalk from 'chalk'
import { existsSync , mkdirSync } from 'fs'

let clean = true
let sp = "NFy"
let st = process.argv[2]
let debug = process.argv[3]


if (st != null) {
    let kv = st.split("=")

    if (kv[0] == 'spec')
        sp = kv[1]
}

if (st != null) {
    let kv = st.split("=")

    if (kv[0] == 'debug')
        debug = eval(kv[1]);
}

var timeout = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

console.log(chalk.yellowBright("checking spec for: " + sp + "\n"))

if (!existsSync("songs")) {

    console.log(chalk.bold("No songs found, creating..."))
    mkdirSync("songs")
    clean = false
    timeout(1000)
}

if (sp === "NFy" || sp === "NFyMono") {
    if (debug) {
        console.log(chalk.blueBright("-> NFy & NFyMono support sub-lists")) 
        await timeout(700)

    }
    if (debug) {
        console.log(chalk.blueBright("-> Checking for playlists...")) 
        await timeout(700)

    }
    if (!existsSync("playlists")) {
        timeout(3000);
        console.log(chalk.bold("No playlists found, creating..."))
        mkdirSync("playlists")
        clean = false
        
    }
}

if (clean) {
    console.log(chalk.greenBright("Clean build! everything is up to spec."))
    timeout(700)
} else {
    console.log(chalk.redBright("There were directories that needed to be created. Everything now up to date."))
    timeout(700)
}
