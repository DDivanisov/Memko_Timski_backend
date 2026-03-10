const {z} = require('zod');


const createTaskSchema = z.object({
      title: z.string().min(1).max(255),
      description: z.string().optional(),
      priority: z.enum(['Low', 'Medium', 'High']),
      type: z.enum(['Bug', 'Feature', 'Improvement', 'Task', 'Sub Task']),
      status: z.enum(['Backlog' , 'Todo', 'In Progress', 'In Review' , 'Done']),
      assignedTo: z.string().nullable().optional(),
      dueDate: z.string().optional().refine(
            (val)=>{
                  return !val || !isNaN(Date.parse(val));
            },
            {
                  message: "Invalid date format."
            }
      )
});


const updateTaskSchema = z.object({
      title: z.string().min(1,"Task titile is required").max(255),
      description: z.string().optional(),
      priority: z.enum(['Low', 'Medium', 'High']),
      type: z.enum(['Bug', 'Feature', 'Improvement', 'Task', 'Sub Task']),
      status: z.enum(['Backlog' , 'Todo', 'In Progress', 'In Review' , 'Done']),
      assignedTo: z.string().nullable().optional(),
      dueDate: z.string().optional().refine(
            (val)=>{
                  return !val || !isNaN(Date.parse(val));
            },
            {
                  message: "Invalid date format."
            }
      )
});


const TaskIdSchema = z.string().min(1,"Task id is required");
module.exports = {createTaskSchema, updateTaskSchema, TaskIdSchema}
