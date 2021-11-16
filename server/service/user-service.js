const bcrypt = require('bcrypt')
const models = require('../models/models')
const uuid = require('uuid')
const mailService = require('../service/mail-service')
const tokenService = require('../service/token-service')
const UserDto = require('../dtos/user-dtos')


class  UserService{
    async registration(email, password){
        console.log('................................')
        const candidate = await models.User.findOne({where: {
            email: email
          }})
        if(candidate){
            throw new Error(`Пользователь с почтовым адресом ${email} уже сужествует `)
        }
        const hashPass = await bcrypt.hash(password,3)
        const activationLink = uuid.v4();

        const user = await models.User.create({email, password: hashPass, activationLink})
        await mailService.sendActivationMail(email,`${process.env.API_URL}api/activate/${activationLink}`)

        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return{...tokens, user}
    }
    async login(email,password){
        const user = await models.User.findOne({where:{email:email}})
        if(!user){
            return "Пользователь с таким email не существует";
        }
        const isPassEqual = await bcrypt.compare(password, user.password)
        if(!isPassEqual){
            return "Пороль не верен"
        }
        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return{...tokens, user}

    }

    async logout(refreshToken){
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }
    async refresh(refreshToken){
        if(!refreshToken){
            return "user no auth"
        }
        const userData = tokenService.validateRefrashToken(refreshToken);
        const tokenFromDb = tokenService.findTokenDb(refreshToken)

        if(!userData || !tokenFromDb){
            return "user no auth"
        }
        const user = await models.User.findOne({where:{id:userData.id}})
        const userDto = new UserDto(user)
        const tokens = tokenService.generateToken({...userDto})
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return{...tokens, user}
    }
}

module.exports = new UserService();