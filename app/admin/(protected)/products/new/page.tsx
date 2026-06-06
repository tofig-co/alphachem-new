import { getCategories } from '@/lib/supabase/queries'
import { ProductForm } from '../ProductForm'

export default async function NewProductPage() {
  const categories = await getCategories()
  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold text-[--text] mb-6">New Product</h1>
      <ProductForm categories={categories} />
    </div>
  )
}
