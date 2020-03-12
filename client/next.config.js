const withCSS = require('@zeit/next-css')
require('dotenv').config();
const prod = process.env.NODE_ENV === 'production'
module.exports = withCSS(
    {
        env: {
            API_URL: prod ? 'https://otog.cf' : 'http://localhost:8000'
        }
    }
)