import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, // ej: puntolan@gmail.com
    pass: process.env.MAIL_PASS  // contraseña de app de Gmail
  }
});

export const sendPurchaseEmail = async (to, ticket) => {
  const mailOptions = {
    from: '"Punto LAN 🛒" <' + process.env.MAIL_USER + '>',
    to,
    subject: '🎉 ¡Gracias por tu compra en Punto LAN!',
    html: `
      <h2>¡Compra confirmada!</h2>
      <p>Gracias por confiar en <strong>Punto LAN</strong>.</p>
      <p><strong>N° Ticket:</strong> ${ticket.code}</p>
      <p><strong>Fecha:</strong> ${new Date(ticket.purchase_datetime).toLocaleString()}</p>
      <p><strong>Monto Total:</strong> $${ticket.amount}</p>
      <p>Esperamos que disfrutes tus productos. ¡Te esperamos pronto de nuevo!</p>
      <hr>
      <small>Este correo es automático, por favor no respondas.</small>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📨 Correo enviado a ${to}`);
  } catch (err) {
    console.error('❌ Error al enviar el correo:', err);
  }
};