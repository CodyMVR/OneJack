const express = require('express')
const app = express()
const fs = require('fs')
const path = require("path");
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/HTML/index.html"));
});

app.get("/accueil", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/HTML/index.html"));
});

// app.get("/images", (req, res) => {
//     const directory = 'public/images/card';
// const images = [];

// fs.readdirSync(directory).forEach(file => {
//     if(file.match(/\.(jpg|jpeg|png|gif)$/i)){
//         images.push({
//             title: file.split('.')[0],
//             url: path.join(directory, file)
//         });
//     }
// });

// res.send(JSON.stringify(images));
// });


app.use('/public', express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.post('/form', async function (req, res) {
    console.log(req.body);

    var transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
            ciphers: 'SSLv3'
        },
        auth: {
            user: 'fouda.wong@outlook.fr',
            pass: 'NavbarBurgermenu62'
        }
    });


    let info = await transporter.sendMail({
        from: '"Foudawong" <fouda.wong@outlook.fr>', // sender address
        to: "enzoguignier40@gmail.com, xavierpascal.roberttg2@gmail.com", // list of receivers
        subject: req.body.objet + ", de " + req.body.email, // Subject line
        text: req.body.message, // plain text body
        // html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou.
    res.redirect('/contact')
}),

app.listen(3000, () => {
    console.log('Server started on port 3000')
})