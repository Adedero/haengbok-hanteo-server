import { Router } from 'express'
import Settings from '../../models/settings.model'
import logger from '../../config/winston.config'
import { formatDate } from '../../utils'
import sendEmail from "../../utils/mailer"
import { helpEmail } from "../../templates/email";
import { isProductionEnv } from '../..'

const router = Router()

router.get('/', (req, res) => {
  res.render('pages/index')
})

router.get('/about', (req, res) => {
  res.render('pages/about')
})

router.get('/contact-us', async (req, res) => {
  try {
    const settings = await Settings.findOne({}).lean()
    res.render('pages/contact', { contactAddress: settings?.contactAddress ?? 'info@haengbokhanteo.com'})
  } catch (e) {
    logger.error(e)
    res.status(500).render('pages/server-error', { ...(!isProductionEnv && { error: e }) })
  }
})

router.post('/contact-us', async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body
    if (!fullName || !email || !message) {
      throw new Error('Missing fields found')
    }
    
    const error = await sendEmail({
      to_email: process.env.EMAIL_USER ?? 'info@haengbokhanteo.com',
      from_email: email.toString(),
      subject: subject?.toString(),
      html: helpEmail({
        name: fullName.toString(),
        email: email.toString(),
        message: message.toString(),
        subject: subject?.toString()
      })
    })
    if (error) {
      console.log(error)
      throw error
    }
    res.render('pages/success')
  } catch(e) {
    logger.error(e)
    res.status(500).render('pages/server-error', { ...(!isProductionEnv && { error: e }) })
  }
})

router.get('/app-download', async (req, res) => {
  try {
    const settings = await Settings.findOne({}).lean()
    if (!settings) {
      throw new Error('No settings found')
    }

    const currentLocale: 'ko' | 'en' = res.locals.currentLocale || 'ko'
    const formattedDate = formatDate(settings.appDetails.releaseDate, currentLocale)

    const updatedSettings = {
      ...settings,
      appDetails: {
        ...settings.appDetails,
        releaseDate: formattedDate
      }
    }

    res.render('pages/app-download', { settings: updatedSettings })
  } catch(e) {
    logger.error(e)
    res.status(500).render('pages/server-error', { error: e })
  }
})


export default router