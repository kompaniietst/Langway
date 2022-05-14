const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../model/user');

module.exports = function (app) {
    app.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email && !password) {
                res.status(400).send("allinput required!");
            }

            const user = await User.findOne({ email });
            const userExists = await User.findOne({ email });
            const userValid = bcrypt.compare(password, user.password);

            if (userExists && userValid) {
                const token = jwt.sign(
                    { user_id: user.id, email },
                    process.env.TOKEN_KEY,
                    { expiresIn: '2h' }
                );
                user.token = token;
                res.status(200).json(user);
            }

            res.status(400).send("Invalid Credentials");
        }
        catch (err) {
            console.log(err);
        }

    })

    app.post('/register', async (req, res) => {
        try {
            console.log(req.body);
            const { first_name, last_name, email, password } = req.body;

            if (!(email && password && first_name && last_name)) {
                res.status(400).send("All inputs are required");
            }

            const userExists = await User.findOne({ email });

            if (userExists) {
                return res.status(409).send("User Already Exist. Please Login");
            }

            encryptedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                first_name,
                last_name,
                email: email.toLowerCase(),
                password: encryptedPassword
            });

            const token = jwt.sign(
                { user_id: user.id, email },
                process.env.TOKEN_KEY,
                { expiresIn: '2h' }
            );

            user.token = token;

            res.status(201).json(user);
        }
        catch (err) {
            console.log(err);
        }
    })

    app.get("/welcome", (req, res) => {
        res.status(200).send("Welcome 🙌 ");
    });
}
