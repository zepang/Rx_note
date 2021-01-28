const getFileSha256 = file => {
    return new Promise((resolve) => {
        let reader = new FileReader();
        reader.readAsArrayBuffer(file)
        reader.onload = function () {
            let wordArray = CryptoJS.lib.WordArray.create(reader.result)
            let hash = CryptoJS.SHA256(wordArray).toString()
            resolve(hash)
        }
    })
}