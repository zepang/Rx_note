console.log(process.cwd())
console.log(__dirname)

const http = require('http')
const port = 3000
debugger
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'})
  debugger  
  res.end('Hello World\n')
}).listen(3000, () => {
  console.log(`Server running at http://localhost:${port}`)
})