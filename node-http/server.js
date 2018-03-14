const http = require('http');
const fs = require('fs');

const server = http.createServer();

const PORT = 8000
const dataFile = 'data.json'

const getData = () => {
  let buffer = fs.readFileSync(dataFile)

  return JSON.parse(buffer.toString())
}

const setData = (newItem) => {
  let data = getData()

  data.push(newItem)

  fs.writeFileSync(dataFile, JSON.stringify(data))
  return data
}

server.on('request', (request, response) => {
  console.log(request.method, request.url)

  switch (request.method) {
    case 'GET':
      response.end(JSON.stringify(getData()))
      break;

    case 'POST':
      let bodyData = '';

      request.on('data', (data) => {
        bodyData += data;
      });

      request.on('end', () => {
        let data = setData(bodyData)
        response.end(JSON.stringify(data))
      });
      break;

    default:
      response.end('Could not process HTTP method');
      break;
  }
});

server.listen(PORT, (err) => {
  if (err) {
    console.error(err);
    return
  }

  console.log('Connected on', PORT);
});
