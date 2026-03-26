import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]


    if (!token) {
        return res.status(401).json({ error: 'Token ausente' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido' })
        }

        req.userId = decoded.id
        req.userName = decoded.name

        next()
    })
}