const {z} = require('zod');


const projectIdSchema = z.string().min(1,"Project id is required");

const createProjectSchema = z.object({
      emoji: z.string().optional(),
      name: z.string().min(1,"Project name is required").max(255),
      description: z.string().optional()
});

const updateProjectSchema = z.object({
      emoji: z.string().optional(),
      name: z.string().min(1,"Project name is required").max(255),
      description: z.string().optional()
});

module.exports = {createProjectSchema, updateProjectSchema, projectIdSchema}