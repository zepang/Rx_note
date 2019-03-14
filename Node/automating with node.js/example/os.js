const os = require('os')
const homeDirectory = os.homedir()
console.log(`you home directory is ${homeDirectory}`)

const osPlatform = os.platform();
console.log(`The OS platform is: ${osPlatform}`);

const cpuCores = os.cpus()
const coreCount = cpuCores.length
const cpuModel = cpuCores[0].model
console.log(`I can see you ${cpuModel} has ${coreCount} cores`)