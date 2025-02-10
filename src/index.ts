import { config } from 'dotenv'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { corsOptions } from './config/cors.config'
import './database'
import useRouter from './router'
import logger from './config/winston.config'
import favicon from 'serve-favicon'
import path from 'node:path'
import i18n from './i18n'
import cookieParser from 'cookie-parser'
import { db } from './database'


config();

//init()

const app = express()
const PORT = process.env.PORT || 3300
export const isProductionEnv = process.env.NODE_ENV === 'production'


app.set('trust proxy', 1)

app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(favicon(path.resolve('public', 'favicon.ico')))
app.use('/primeicons', express.static(path.resolve('node_modules', 'primeicons')));
app.use(helmet())

app.use(i18n.init)
app.use((req, res, next) => {
  res.locals.__ = res.__
  res.locals.currentLocale = req.getLocale()

  const lang = req.query.lang || req.cookies.locale || "ko"
  res.cookie("locale", lang, { 
    maxAge: 900000, 
    httpOnly: true, 
    secure: isProductionEnv,  // Only use secure cookies in production
    sameSite: isProductionEnv ? 'none' : 'lax' // None for cross-site, Lax for normal use
  })
  req.setLocale(lang)
  next()
})

app.set('view engine', 'ejs')
app.set('views', path.resolve('src/views'))

useRouter(app)

app.post('/listings', async (req, res) => {
  const listings: Record<string, string | number>[] = req.body.data
  
  if (!listings) {
    res.status(400).json({ message: 'No Data Provided', success: false })
    return
  }
  const data = await db.Listing.insertMany(listings)
  res.status(200).json({ message: 'Successful', data, success: true })
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((req, res, next) => {
  res.status(404).render("pages/not-found")
})

app.listen(PORT, () => {
  if (!isProductionEnv) {
    console.log(`Server running on http://localhost:${PORT}`)
  } else {
    logger.info(`Server running on port ${PORT}`)
  }
})
