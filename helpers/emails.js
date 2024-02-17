import nodemailer from 'nodemailer';

//confirmar cuenta
const emailRegistro = async (datos) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
      });

    //   console.log(datos); //pasa los datos de usuario, nombre,email,token
    const { email, nombre, token } = datos

    // Enviar el email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Confirma tu cuenta en BienesRaices.com',
        text: 'Confirma tu cuenta en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, comprueba tu cuenta en BienesRaices.com</p>
            <p>Tu cuenta ya esta lista, solo debes confirmala en el siguente enlace:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a>
            </p>

            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje</p>
        `
    })
}


//confirmar cuenta
const emailOlvidePassword = async (datos) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
      });

    //   console.log(datos); //pasa los datos de usuario, nombre,email,token
    const { email, nombre, token } = datos

    // Enviar el email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Restablece tu password en BienesRaices.com',
        text: 'Restablece tu password en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, Has solicitado restablecer tu password en BienesRaices.com</p>
            <p>Sigue el siguente enlace para generar un password nuevo:
            <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Restablecer Password</a>
            </p>

            <p>Si tu no solicitaste el cambio de password, puedes ignorar el mensaje</p>
        `
    })
}

 

export {
    emailRegistro,
    emailOlvidePassword
}