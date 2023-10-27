require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cookiePerser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const connectDB = require('./db/connect')
require('express-async-errors')
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const orderRouter = require('./routes/orderRoutes')
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const authenticationMiddleware = require('./middleware/authentication')
const cors = require('cors')
const xssClean = require('xss-clean')
const helmet = require('helmet')
const rateLimiter = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')

app.set('trust proxy',1)
app.use(rateLimiter({
    windowMs:15 * 60 * 1000,
    max:60
}))
app.use(cookiePerser(process.env.JWT_SECRET))
app.use(express.static('./public'))
app.use(fileUpload())
app.use(morgan('tiny'))
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(xssClean())
app.use(mongoSanitize())
app.use(cors())


app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',authenticationMiddleware,userRouter)
app.use('/api/v1/products',productRouter)
app.use('/api/v1/reviews',reviewRouter)
app.use('/api/v1/orders',orderRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const PORT = process.env.PORT || 5000




connectDB()
app.listen(PORT,()=>{
    console.log(`Server listening at port ${PORT}`);
})
