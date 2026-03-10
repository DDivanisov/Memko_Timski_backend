const {httpStatus} = require('../config/http.config');
const { AppError } = require('../utils/appError');
const { z } = require('zod');

const errorHandler = (err, req, res, next) => {
    console.error(`Error on PATH ${req.path} --->: ${err.message}`);  

    if(err instanceof SyntaxError){
      return res.status(httpStatus.BAD_REQUEST).json({
         message: 'Syntax Error',
         error: 'Invalid JSON format. Please check your request body.',
      });
    }

    if(err instanceof z.ZodError){

        const formattedErrors = err.issues.map(error => ({
            field: error.path.join('.'),
            message: error.message,
            code: error.code
        }));

        return res.status(httpStatus.BAD_REQUEST).json({
            message: 'Validation Error',
            errors: formattedErrors,
        });
    }

    if (err instanceof AppError){
        return res.status(err.statusCode).json({
            message:"An error occurred",
            errors: err.message,
        });
    }

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        error: err.message || 'An unexpected error occurred',
    });
};

module.exports = { errorHandler };