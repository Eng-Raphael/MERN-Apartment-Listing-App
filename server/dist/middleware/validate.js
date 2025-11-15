import { validationResult } from 'express-validator';
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ success: false, errors: errors.array() });
        return;
    }
    next();
};
export default validate;
//# sourceMappingURL=validate.js.map