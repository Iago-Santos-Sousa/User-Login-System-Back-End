const nodemailer = require("nodemailer");

// Configura o transporter do Nodemailer
const sendMail = async (userData, linkResetPassword, res) => {
  try {
    let smtpConfig = {
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "iago.santos.sousa@gmail.com",
        pass: "hmiu yxlu skjf hgen",
      },
      tls: {
        rejectUnauthorized: false,
      },
    };

    const transporter = nodemailer.createTransport(smtpConfig);

    // const transporter = nodemailer.createTransport({
    //   // Opção com gmail
    //   service: "gmail",
    //   auth: {
    //     user: "iago.santos.sousa@gmail.com",
    //     pass: "hmiu yxlu skjf hgen",
    //   },
    // });

    const mailOptions = {
      from: "iago.santos.sousa@gmail.com",
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
