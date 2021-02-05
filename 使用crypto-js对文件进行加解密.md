```js
//加密操作
Encode() {
    //载入库
    let CryptoJS = require("crypto-js");
    //获得文件的MIME类型
    this.file_mime = this.file.type;
    //获得文件名
    this.file_name = this.file.name;

    let reader = new FileReader();
    reader.onload = () => {
        //设置key和iv
        let key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
        let iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
        // 进行加密操作
        let encrypted = CryptoJS.AES.encrypt(reader.result, key, {
            mode: CryptoJS.mode.CTR,
            iv: iv
        }).toString();
        //生成Blob对象 进行下载操作
        this.file2 = new Blob([encrypted], {
            type: this.file_mime
        });
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(this.file2);
        const filename = this.file_name;
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };
    //文件读取
    reader.readAsBinaryString(this.file);
},
//解密操作
Decode() {
    let CryptoJS = require("crypto-js");
    let reader = new FileReader();
    reader.onload = () => {
        //设置key和iv
        let key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
        let iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
        let decrypted = CryptoJS.AES.decrypt(reader.result, key, {
            mode: CryptoJS.mode.CTR,
            iv: iv
        }).toString(CryptoJS.enc.Utf8);
        //下载
        this.file2 = new Blob([decrypted], {type: this.file_mime});
        const a = document.createElement("a");
        const url = window.URL.createObjectURL(this.file2);
        const filename = this.file_name;
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };
    reader.readAsBinaryString(this.file);
}
```