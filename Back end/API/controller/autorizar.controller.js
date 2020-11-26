const User = require('../models/user.model');
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email
    });
    if (!user) {
        const { name, lastName, userName, email, password } = req.body;
        const user = new User({
            name,
            lastName,
            userName,
            email,
            password
        });
        user.save((err, newUser) => {
            if (err) {
                console.log(err);
                res.status(500).send({ error: 'error al conectar a la base de datos' })
            } else {
                newUser.HashedPassword = undefined;
                newUser.Salt = undefined;
                res.send(newUser);
            }
        });
    } else {
        res.status(400).send({
            error: 'Email is taken'
        })
    }
};

exports.signin = async (req, res, next) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email})
    if (user) {
        if(!user.authenticated(password)){
            return res.status(400).send({error: 'no se puede auntentificar'})
        }
        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: '1d',
        });

        const { _id, name, lastName, email, userName, role} = user;
        return res.send({
            token,
            user: {
                _id,
                name,
                lastName,
                email,
                userName,
                role
            }
        })
    } else {
        return res.status(400).send({error: 'no se puede auntentificar'})
    }
};

exports.requireSignin = expressJWT({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256']
});

exports.adminMiddleWare = async (req, res, next) =>{
    const adminUser = req.user._id;
    const user = await User.findById(adminUser, '-HashedPassword -Salt');
    if (user) {
        if(user.role !=1){
            return res.status(403).send({error: "Tu no puedes pasar"});
        }

        req.profile = user;
        next();
    }else {
        return res.status(400).send({
            error: 'User not found'
        })
    }
}
