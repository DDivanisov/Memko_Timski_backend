const {z} = require('zod');

const createWorkSpaceSchema = z.object({
    name: z.string().min(1,"Name is required").max(255),
    description: z.string().optional(),
});

const updateWorkSpaceSchema = z.object({
      name: z.string().min(1,"Name is required").max(255),
      description: z.string().optional(),
})

const idWorkSpaceSchema = z.string().min(1,"workspace id required!");

const changeRoleSchema = z.object({
    roleId: z.string().min(1, "Role id is required"),
    memberId: z.string().min(1, "Member id is required")
});
module.exports = {
    createWorkSpaceSchema,
    updateWorkSpaceSchema,
    idWorkSpaceSchema,
    changeRoleSchema
}