var args = {
    '-h': displayHelp,
    '-r': readFile
}

function displayHelp () {
    console.log('Argument processor:', args)
}

function readFile (file) {
    console.log('Reading', file)
    require('fs').createReadStream(file).pipe(process.stdout)
}

if (process.argv.length) {
    process.argv.forEach(function (arg, index) {
        if (arg.indexOf('-') > -1) {
            args[arg].apply(this, process.argv.slice(index + 1))
        }
    })
}
