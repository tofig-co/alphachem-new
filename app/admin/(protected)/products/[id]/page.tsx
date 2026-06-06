import { createClient } from '@/lib/supabase/server'
import { getCategories } from '@/lib/supabase/queries'
import { notFound } from 'next/navigation'
import { ProductForm } from '../ProductForm'

type Props = { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const [supabase, categories] = await Promise.all([createClient(), getCategories()])

  const { data: product } = await supabase
    .from('products')
    .select('*, translations:product_translations(*)')
    .eq('id', id)
    .single()

  if (!product) notFound()

  return (
    <div className="px-8 py-8">
      <h1 className="text-xl font-semibold text-[--text] mb-6">Edit Product</h1>
      <ProductForm categories={categories} product={product} />
    </div>
  )
}
