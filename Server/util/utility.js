const Log = require('./Logger');
const pc = require('ara-persian-cal')
const fs = require('fs');
const jwt = require('jsonwebtoken');
const AES = require('crypto-js/aes');
const { tokenHashKey, jwtSecret, jwtExpireTime } = require('../app-setting');

map = (source, dest, excludeList = []) => {
    let propertyList = Object.getOwnPropertyNames(source).filter(m => !excludeList.includes(m));
    propertyList.forEach(p => {
        dest[p] = source[p];
    })
}

sendResponse = (req, res, data, result = true, code = 200) => {

    req.body.status = code;
    req.body.to = req.body.from;
    req.body.data = data;
    delete req.body.from;
    const a = req.user ? generateAuthToken(req.user) : null;
    Log({ type: result ? 'info' : 'error', res: req.body })
    res.status(code).json(
        Object.assign(req.base, {
            result: result,
            data: Array.isArray(data) ? data : [data],
            token: a
        }))
}

loadText = (filePath) => {
    return fs.readFileSync(filePath, { encoding: 'utf-8' })
}

generateInvoiceNo = (number, prefix) => {
    let currentYear = pc.ToPersian(new Date()).substring(2, 4);
    if (number) {
        console.log("generateInvoiceNo -> number", number)
        let lastYear = number.InvoiceNo.substring(2, 4);
        if (lastYear == currentYear)
            return prefix + (parseInt(number.InvoiceNo.substring(2, 12)) + 1)
    }
    return prefix + currentYear + '00000001'
}

toPersian = (garegorianDate) => {
    let cleanedDate = garegorianDate
        .toISOString()
        .replace('T', ' ')
        .replace('Z', ' ');
    return pc.ToPersian(cleanedDate, 'YYYY/MM/DD HH:mm')
}

convertProperties = (object, keys, method) => {
    keys.forEach(key => {
        object[key] = method(object[key])
    });
    return object;
}

generateAuthToken = (user) => {
    //console.log('generateAuthToken',user)
    const token = jwt.sign({
        _id: user._id,
        lastName: user.lastName,
        firstName: user.firstName,
        userType: user.userType
    }, jwtSecret, { expiresIn: jwtExpireTime });

    const tokenCrypted = AES.encrypt(
        token,
        tokenHashKey
    ).toString();

    return tokenCrypted
}

module.exports = {
    Map: map,
    LoadText: loadText,
    SendResponse: sendResponse,
    GenerateInvoiceNo: generateInvoiceNo,
    ToPersian: toPersian,
    ConvertProperties: convertProperties,
    GenerateAuthToken:generateAuthToken
}