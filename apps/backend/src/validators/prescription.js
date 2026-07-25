const { z } = require('zod');

exports.listSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: z.enum(['UPLOADED', 'PROCESSING', 'DONE', 'FAILED']).optional(),
});

exports.idSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id'),
});
