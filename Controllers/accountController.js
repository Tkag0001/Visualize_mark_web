const accounts = require('../Models/accountModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const convertQuery = (query, schema) => {
    const converted = {};
    // Loop through the query fields
    for (let key in query) {
        // Get the value of the query field
        let value = query[key];
        // Get the type of the schema field
        let type = schema.paths[key].instance;
        // Convert the value to the correct type
        switch (type) {
            case "Number":
                value = Number(value);
                break;
            case "Boolean":
                value = Boolean(value);
                break;
            case "Date":
                value = new Date(value);
                break;
            // Add more cases for other types as needed
        }
        // Assign the converted value to the new object
        converted[key] = value;
    }
    // Return the new object
    return converted;
}

//creating endpoint for userlogin
exports.loginAccount = async (req, res) => {
    const { username, password } = convertQuery(req.body, accounts.schema)
    let user = await accounts.findOne({ username });
    if (user) {
        // const passCompare = req.body.password === user.password;
        if (user && bcrypt.compareSync(password, user.password)) {
            const data = {
                user: {
                    id: user._id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success: true, token });
        }
        else {
            res.json({ success: false, errors: "Wrong Password" });
        }
    }
    else {
        res.json({ success: false, errors: "Wrong user Id" });
    }
}

//creating endpoint for registering the user
exports.registerAccount = async (req, res) => {

    const account = convertQuery(req.body, accounts.schema)
    const hashedPsw = await bcrypt.hash(account.password, 12)
    let check = await accounts.findOne({ username: account.username })
    if (check) {
        return res.status(400).json({ success: false, errors: "Exising username" })
    }

    const user = new accounts({
        username: account.username,
        password: hashedPsw,
        role: 'student',
    })

    await user.save();
    res.status(201).json({ success: true, data: user })
}

exports.checkUser = async (req, res) => {
    const token = req.body.auth_token
    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }

    //Verify token
    jwt.verify(token, 'secret_ecom', async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        //Get user form mongoDB by ID of decoded
        const userId = decoded.user.id;
        const user = await accounts.findOne({ "_id": userId }, { "role": 1, "username": 1 })
        res.status(200).json(user);
    })
}