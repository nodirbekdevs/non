import dotenv from 'dotenv'

dotenv.config()

interface Config {
    HttpPort: string
    MongoPort: number
    MongoDatabase: string
    JwtSecret: string
    NodeEnv: string
}

let config: Config = {
    HttpPort: getConf('HTTP_PORT', '9001'),
    MongoPort: parseInt(getConf('MONGO_PORT', '27017')),
    MongoDatabase: getConf('MONGO_DATABASE', 'non_project'),
    JwtSecret: getConf('JWT_SECRET', 'non_secret'),
    NodeEnv: getConf('NODE_ENV', 'development')
}

function getConf(name: string, def: string = ''): string {

    return process.env[name] ? process.env[name] || '' : def

    // if (process.env[name]) {
    //     return process.env[name] || ''
    // }
    //
    // return def
}

export default config
