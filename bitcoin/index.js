import fetch from 'node-fetch';
import express from 'express';
import morgan from 'morgan';

const app = express()
app.use(morgan('combined'))

const url = "https://api.coinbase.com/v2/prices/spot?currency="
const currency = process.env.CURRENCY || "EUR"

app.get('/metrics', (req, res) => {
fetch(`${url}${currency}`)
  .then(result => result.json())
  .then(data => {
    res.send("# HELP btc_eur_amount bitcoin price in EUR.\n" +
    "# TYPE btc_eur_amount summary\n" +
    `BTC_${currency}_AMOUNT ` + data.data.amount
    )})
  .catch(err => {
    console.error(err)
  })
})

const port = process.env.PORT || 9100

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
