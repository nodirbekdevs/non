import mongoose from 'mongoose'
import { logger } from '../config/logger'
import config from '../config/config'

const db = mongoose.connection

db.on('error', () => {
    logger.error('DB: mongo db connection is not open')
    logger.info('DB: killing myself so that container restarts')
})

db.once('open', () => {
    logger.info('DB: mongo db connection is established')
})

console.log(config.Username)

export default class Database {
    // url = `mongodb://localhost:${config.MongoPort}/${config.MongoDatabase}`
    url = `mongodb+srv://${config.Username}:${config.Password}@${config.MongoDatabase}.ygnkhxi.mongodb.net/?retryWrites=true&w=majority`
    // url = mongodb+srv://nyunusov:necshuhrat@nonproject.ygnkhxi.mongodb.net/?retryWrites=true&w=majority


    constructor() {
        logger.info(`DB: DATABASE URL: ${this.url}`)
    }

    connect() {
        return mongoose.connect(
            this.url,
            {
                useCreateIndex: true,
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000
            },
            (error) => {
                if (error) {
                    logger.error('DB: MongoDB Connection error:', error)
                    process.exit(1)
                }
            }
        )
    }
}
