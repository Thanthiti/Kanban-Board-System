const {login, register, getProfile} = require("../../services/user.service");


async function registerUser(req, res, next) {
    try{
        const {name, email, password} = req.body;
        const user = await register(name, email, password);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }   
}

async function loginUser(req, res, next) {
    try{
        const {email, password} = req.body;
        const user = await login(email, password);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}
    
async function ProfileUser(req, res, next) {
    try{
        const profile = await getProfile(req.user.id);
        res.status(200).json(profile);
    } catch (error) {
        next(error);
    }
}


module.exports = {registerUser, loginUser, ProfileUser};