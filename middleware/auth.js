const Customer = require('../models/Customer');
const authCustomer = (req, res, next) => {
    next();
}
module.export = authCustomer;