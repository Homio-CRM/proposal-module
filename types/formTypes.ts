import { z } from 'zod'
import { FormDataSchema } from './formSchema'

export type FormData = z.infer<typeof FormDataSchema> 