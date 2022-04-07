import inquirer from 'inquirer';
import chalk from 'chalk';
import { readFile } from 'fs/promises';
import { existsSync, fstat, mkdir } from 'fs';
import spinner from 'nanospinner'

const VERSION='0.0.1'

function printError(msg) {
    console.log(chalk.redBright('error:') + ' ' + msg);
}

function printWarning(msg) {
    console.log(chalk.yellow('warning:') + ' ' + msg);
}

let specFile = {
    "Regular": {
        "songs_dir": "songs",
        "playlists_dir": "playlists",
        "support": true,
        "api": "v1"
    },
    "Mono": {
        "songs_dir": "songs",
        "playlists_dir": "playlists",
        "support": true,
        "api": "v2"
    },
    "JS": {
        "songs_dir": "songs",
        "playlists_dir": "playlists",
        "support": false,
        "api": "v2"
    },
    "Andro": {
        "songs_dir": "songs",
        "playlists_dir": "playlists",
        "support": false,
        "api": "v2"
    }
}

let spec = "Regular"

console.log("using the NSS version " + chalk.yellowBright(VERSION.toString()))

async function get_info(vn, df, msg) {
    let pr = await inquirer.prompt({
        'name': vn,
        "default": df,
        "message": msg
    })

    return pr
}

var timeout = (ms = 2000) => new Promise((r) => setTimeout(r, ms))

async function SetupDirDaemon(sd, pd, pds) {
    console.log("Running setup dir daemon")
    let sp = spinner.createSpinner(`Checking for ${sd}/`).start();

    await timeout();
    if (existsSync(sd)) {
        sp.success({
            text: "songs directory looks good!" 
        })
    } else {
        sp.error({
            text: "No song dir, creating one!"
        })

        mkdir(sd);
    }

    if (pds) {
        console.log("checking playlists...")

        if (existsSync(pd)) {
            console.log("Found playlists, ok!")
        } else {
            console.log("No playlists dir, creating dir")
            mkdir(pd)
        }
    }
}

async function testForNFy() {
    if (spec == "Regular") return existsSync("NFy.exe")
    if (spec == "Mono") return existsSync("njmono.exe")
    if (spec == "nfyjs") return existsSync("NFY.exe")
    if (spec == "Andro") return existsSync("NFy Andro.apk")
}

let client_prompt = await get_info("nfy_client", "nfy_regular", "Which NFy Client would you like to configure?")

let Client = client_prompt.nfy_client

console.log("\n")

if (Client === 'nfy_regular') {
    console.log(chalk.bold("Configuring settings for Regular NFy Spec..."))

} else if (Client === 'nfy_mono') {

    console.log(chalk.bold("Configuring settings for NFy Mono..."))
    spec = "Mono"

} else if (Client === 'nfyjs') {

    console.log(chalk.bold("Configuring settings for NFy.JS ..."))
    spec = "JS"

} else if (Client === 'andro') {
    console.log(chalk.bold("Configuring settings for NFy Andro..."))
    printWarning("NFy Andro support is experimental!, and NFy Andro is excluded from being behind two standards.\nUse at own risk.");
    spec = "Andro"
}

if (specFile[spec] !== null) {
    console.log("found requested spec... Starting daemon.")
    
    
    let spin = spinner.createSpinner('Testing for NFy...').start();
    await timeout(3000);
    if (testForNFy() == true) {
       

        spin.success({text: "NFy found for spec!"})
    } else {
        spin.error({text: "Directory is not an NFy directory."})
        process.exit(1)
    }

    let confprompt = await get_info("mod", "all", "What would you like to configure/modify?")

    if (confprompt.mod === "all") {
        await SetupDirDaemon(specFile[spec].songs_dir, specFile[spec].playlists_dir, specFile[spec].support);
    } 
    else if (confprompt.mod === "dirs") {
        await SetupDirDaemon(specFile[spec].songs_dir, specFile[spec].playlists_dir, specFile[spec].support);
    } else {
        printError("That is not an option, either 'all | dirs'")
    }
    
} else {
    printError("Could not find a spec for '" + spec + "'")
}

// console.log(pr)