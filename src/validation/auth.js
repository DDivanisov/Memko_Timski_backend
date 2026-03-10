const {z} = require('zod');

const registrationSchema = z.object({
    name: z.string().min(3,"Name to short, must be more than 3 characters").max(255,"Name to long, must be less than 255 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6,"Password to short, must be more than 6 characters").max(255,"Password to long, must be less than 255 characters"),
});

const loginSchema = z.object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(6,"Password to short, must be more than 6 characters").max(255,"Password to long, must be less than 255 characters"),
})

module.exports = {
    registrationSchema,
    loginSchema,
}