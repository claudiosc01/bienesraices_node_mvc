import { DataTypes } from 'sequelize'
import bcrypt from 'bcrypt'
import db from '../config/db.js'

const Usuario = db.define('usuarios',{
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN
},{
    hooks: { //el hook se ejecuta en determinados momentos, cuando se agrega, cuando se actualiza, etc. puede ser antes o despues
        beforeCreate: async function(usuario) { //antes de crear el usuario.

            const salt = await bcrypt.genSalt(10) //genera el hash para hashear el password
            usuario.password = await bcrypt.hash(usuario.password, salt) //mandamos salt para poder hashear el password con esa encriptacion. y estaria hasheado el password.
            
        }
    },
    scopes: { // sirve para eliminar ciertos campos a un modelo en expecifico.
        eliminarPassword: {
            attributes: {
                exclude: ['password',"token","confimado",'createdAt','updatedAt'] //eliminar estos campos
            }
        }
    }
})

// Metodos Personalizados
Usuario.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password) //comparar los password
}

export default Usuario;
