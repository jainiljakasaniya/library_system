const Validators = require('../validators/index')

module.exports = (validator) => (req, res, next) => {
    try {
      const validated = Validators[validator].validate(req)
      if (validated.error) {
        return res.status(400).json(validated.error.details);
      }
      next()
    } catch (err) {
      /* istanbul ignore next */
      next(err)
    }
  }