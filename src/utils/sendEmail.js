const nodemailer = require("nodemailer");

// Configura o transporter do Nodemailer
const sendMail = async (userData, linkResetPassword, res) => {
  try {
    let smtpConfig = {
      host: process.env.AUTH_EMAIL_HOST || "smtp.gmail.com",
      port: process.env.AUTH_EMAIL_PORT || 465,
      secure: true,
      auth: {
        user: process.env.AUTH_EMAIL_USER,
        pass: process.env.AUTH_EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    const mailOptions = {
      from: process.env.AUTH_EMAIL_USER,
      to: userData.email,
      subject: "reset password",
      text: linkResetPassword,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        // return res.status(500).send("Erro ao enviar o email");
        // throw error;
        return res
          .status(200)
          .json({ status: "success", message: "Email enviado com sucesso." });
      } else {
        console.log("Email enviado: " + info.response);
        return res
          .status(200)
          .json({ status: "success", message: "Email enviado com sucesso." });
        // return "Email enviado com sucesso";
      }
    });
  } catch (error) {
    throw error;
  }
};

module.exports = sendMail;
