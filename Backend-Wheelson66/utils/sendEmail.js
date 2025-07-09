const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // ou ton fournisseur (Outlook, Mailjet, etc.)
    auth: {
      user: process.env.EMAIL_USER, // exemple : senthoo@gmail.com
      pass: process.env.EMAIL_PASS, // mot de passe ou "App Password"
    },
  });

  await transporter.sendMail({
    from: `"WheelsOn66 🚗" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Vérification de ton e-mail ✔️',
    text: `Voici ton code de vérification : ${code}`,
    html: `<p>Ton code de vérification est :</p><h2>${code}</h2>`,
  });
};

module.exports = sendVerificationEmail;