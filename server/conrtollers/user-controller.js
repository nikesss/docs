const userService = require('../service/user-service')
const {validationResult} = require('express-validator')

class UserController{
    async registration(req,res,next){
        try {
            const erorrs = validationResult(req)
            if(!erorrs.isEmpty()){
                return res.json("Некоректные данные");
            }
            const {email, password} = req.body;
            const userData = await userService.registration(email,password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge:30*24*60*60*1000,httpOnly:true})
            return res.json(userData)
        } catch (error) {
            console.log(error)
        }
    }
    async login(req,res,next){
        try {
            const {email,password} = req.body;
            const userData = await userService.login(email,password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge:30*24*60*60*1000,httpOnly:true})
            return res.json(userData)

        } catch (error) {
            console.log(error)
        }
    }
    async logout(req,res,next){
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token);
        } catch (error) {
            console.log(error)
        }
    }
    async activate(req,res,next){
        try {
            
        } catch (error) {
            
        }
    }
    async refresh(req,res,next){
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge:30*24*60*60*1000,httpOnly:true})
            return res.json(userData)
        } catch (error) {
            
        }
    }
    async getUsers(req,res,next){
        try {
            res.json([123,123,123])
        } catch (error) {
            
        }
    }
}

module.exports = new UserController();