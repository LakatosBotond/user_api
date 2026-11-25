const bcrypt = require('bcrypt')
const userRepository = require('../repositories/user.repository');
const AppError = require('../utils/AppError')

const SALT_BOUND = 10;

const pick = (obj, keys) => Object.fromEntries(keys.filter((k) => obj[k] !== undefined).map((k)=>[k, obj[k]]));

module.exports = {
    getAll(){
        return userRepository.findAll();
    },

    async GetById(id){
        const user = await userRepository.findById(id);
        if (!user) throw new AppError('Felhasznalo nem talalhato', 404)
    },

    async create({name, email, password, role}){
        if(!name || !email || !password) throw new AppError('A név, az email, a jelszo kötelezo' , 400);
        if(password.length  < 6 ) throw new AppError('A jelszo legalabb 6 karakter legyen' , 400);
        if(await userRepository.findByEmail(email)) throw new AppError('email foglalt' , 400);


        const hash = await bcrypt.hash(password, SALT_BOUND);
        return userRepository.create({name, email, password:hash, role})

    },

    async update(id, data, currentUser){
        const isAdmin = currentUser.role === 'admin';
        if(!isAdmin && currentUser.id !== Number(id)) throw new AppError ('nincs jogosultsagod', 403);

        const changes = pick(data, isAdmin ? ['name', 'email', 'password', 'role'] : ['name', 'email', 'password']

        );

        if(changes.email){
            const existing = await userRepository.findByEmail(changes.email);
            if(existing && existing.id !== Number(id)) throw new AppError('Ez az email mar foglalt' , 409)
        };
        if (changes.password){
            if(changes.password.length < 6) throw new AppError('A jelszo legalabb 6 karakter legyen' , 400);
            changes.password = await bcrypt.hash(changes.password, SALT_BOUND)
        }

        const user = await userRepository.update(id, changes);
        if(!user ) throw new AppError ('felhasznalo nem talalhato', 404);
        return user;
        
    },


    async remove(id){

        if(!(await userRepository.remove(id))) throw new AppError ('felhasznalo nem talalhato' , 400)
    },




};
