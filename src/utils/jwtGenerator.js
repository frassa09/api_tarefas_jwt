import jwt from 'jsonwebtoken'

export default function generateJwtToken(payload){

    const jwtSecret = process.env.JWT_SECRET
    const expiresIn = {expiresIn: process.env.JWT_EXPIRESIN}

    const jwtToken = jwt.sign(payload, jwtSecret, expiresIn)

    return jwtToken
}