const jwt = require('jsonwebtoken')
const tokenModel = require('../models/models')

class  TokenService{
    generateToken(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn:'30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn:'30d'})
        return{
            accessToken,
            refreshToken
        }
    }
    validateAccessToken(token){
        try {
            const userData = jwt.verify(token,process.env.JWT_ACCESS_SECRET)
            return userData;
        } catch (error) {
            console.log(error)
        }
    }
    validateRefrashToken(token){
        try {
            const userData = jwt.verify(token,process.env.JWT_REFRESH_SECRET)
            return userData;
        } catch (error) {
            console.log(error)
        }
    }
    async saveToken(userId,refreshToken){
        const tokenData = await tokenModel.Token.findOne({where:{userId:userId }})
        if(tokenData){
            tokenData.refreshToken = refreshToken;
            return tokenData.save()
        }else{
            const token = await tokenModel.Token.create({userId: userId, refreshToken:refreshToken})
            return token;
        }
    }
    async removeToken(refreshToken){
        const tokenData = await tokenModel.Token.destroy({where:{refreshToken:refreshToken}})
        return tokenData;
    }
    async findTokenDb(refreshToken){
        const tokenData = await tokenModel.Token.findOne({where:{refreshToken:refreshToken}})
        return tokenData;
    }
}

module.exports = new TokenService();