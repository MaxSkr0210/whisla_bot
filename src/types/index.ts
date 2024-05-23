import {z} from "zod"

const Supplie = z.object({
  incomeId: z.number(),
  number: z.string(),
  date: z.string(),
  lastChangeDate: z.string(),
  supplierArticle: z.string(),
  techSize: z.string(),
  barcode: z.string(),
  quantity: z.number(),
  totalPrice: z.number(),
  dateClose: z.string(),
  warehouseName: z.string(),
  nmId: z.number(),
  status: z.string()
})

export type SupplieType = z.infer<typeof Supplie>;
