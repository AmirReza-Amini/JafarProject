const Log = require('./Logger');
const pc = require('ara-persian-cal')
const fs = require('fs');
const jwt = require('jsonwebtoken');
const AES = require('crypto-js/aes');
const { tokenHashKey, jwtSecret, jwtExpireTime } = require('../app-setting');

exports.Map = (source, dest, excludeList = []) => {
    let propertyList = Object.getOwnPropertyNames(source).filter(m => !excludeList.includes(m));
    propertyList.forEach(p => {
        dest[p] = source[p];
    })
}

exports.SendResponse = (req, res, data, result = true, code = 200) => {

    req.body.status = code;
    req.body.to = req.body.from;
    req.body.data = data;
    delete req.body.from;
    const a = req.user ? this.GenerateAuthToken(req.user) : null;
    Log({ type: result ? 'info' : 'error', res: req.body })
    res.status(code).json(
        Object.assign(req.base, {
            result: result,
            data: Array.isArray(data) ? data : [data],
            token: a
        }))
}

exports.LoadText = (filePath) => {
    return fs.readFileSync(filePath, { encoding: 'utf-8' })
}

exports.GenerateInvoiceNo = (number, prefix) => {
    let currentYear = pc.ToPersian(new Date()).substring(2, 4);
    if (number) {
        let lastYear = number.InvoiceNo.substring(2, 4);
        if (lastYear == currentYear)
            return prefix + (parseInt(number.InvoiceNo.substring(2, 12)) + 1)
    }
    return prefix + currentYear + '00000001'
}

exports.ToPersian = (garegorianDate) => {
    if (!garegorianDate) return '---'
    let cleanedDate = garegorianDate
        .toISOString()
        .replace('T', ' ')
        .replace('Z', ' ');
    return pc.ToPersian(cleanedDate, 'YYYY/MM/DD HH:mm')
}

exports.ConvertProperties = (object, keys, method) => {
    keys.forEach(key => {
        console.log("exports.ConvertProperties -> key", object[key])
        object[key] = method(object[key])
    });
    return object;
}

exports.GenerateAuthToken = (user) => {
    const token = jwt.sign({
        _id: user._id,
        lastName: user.lastName,
        firstName: user.firstName,
        userType: user.userType,
        permissions:user.permissions
    }, jwtSecret, { expiresIn: jwtExpireTime });

    const tokenCrypted = AES.encrypt(
        token,
        tokenHashKey
    ).toString();

    return tokenCrypted
}

exports.FormatNumber = (number) => {
    return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : number;
}
