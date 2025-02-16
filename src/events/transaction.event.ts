import { EventEmitter } from 'node:events'
import { TransactionModel } from '../models/transaction.model'
import logger from '../config/winston.config'
import { sendTransactionNotifications } from '../controllers/api/services/transaction.service'

class TransactionEmitter extends EventEmitter {}

export const txnEmitter = new TransactionEmitter()

txnEmitter.on('error', (err) => {
  logger.error(`Transaction Emitter Error: ${err.message}`, err)
})

txnEmitter.on(
  'created',
  async (txn: TransactionModel) => {
    try {
      await sendTransactionNotifications(txn)
    } catch (error) {
      const err = error as Error
      logger.error(`Error sending transaction notifications: ${err.message}`, err)
    }
  }
)

