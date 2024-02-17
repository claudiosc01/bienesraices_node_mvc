import bcrypt from 'bcrypt';

const usuarios = [
    {
        nombre: 'pepe',
        email: 'pepe@gmail.com',
        confirmado: 1,
        password: bcrypt.hashSync('password', 10)
    }
]

export default usuarios