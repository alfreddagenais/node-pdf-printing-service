const express = require('express')
const ptp = require('pdf-to-printer')
const fs = require('fs')
const path = require('path')
const cryptoRandomString = require('crypto-random-string')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

app.use(bodyParser.raw({ type: 'application/pdf' }))
app.post('', async (request, response) => {
  const options = {}
  if (request.query.printer) {
    options.printer = request.query.printer
  }

  const randomString = cryptoRandomString({ length: 10, type: 'url-safe' })
  const tmpFilePath = path.join(`./tmp/${randomString}.pdf`)

  try {
    fs.writeFileSync(tmpFilePath, request.body, 'binary')
    await ptp.print(tmpFilePath, options)
    fs.unlinkSync(tmpFilePath)
  } catch (error) {
    console.error('Error print to PDF', error)
  }

  response.status(204)
  response.send()
})

app.listen(port, () => {
  console.log(`PDF Printing Service listening on port ${port}`)
})
