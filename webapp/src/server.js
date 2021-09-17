let express = require('express')
let app = express()

app.use(express.static(__dirname  + '/public'))

const PORT  = process.env.PORT || 3050
app.listen(PORT,()=> console.info(`Server has started on ${PORT}`))