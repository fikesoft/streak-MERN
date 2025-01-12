import jwt from 'jsonwebtoken'

//Generate JWT Token
export const generateToken = (payload) =>{
    return jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
}