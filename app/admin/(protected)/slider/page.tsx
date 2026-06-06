import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { ConfirmDeleteForm } from '../_components/ConfirmDeleteForm'
import { createSlide, updateSlide, deleteSlide } from './actions'

export default async function SliderPage() {
  const supabase = await createClient()
  const { data: slides } = await supabase
    .from('slider_images')
    .select('*')
    .order('sort_order')

  return (
    <div className="px-8 py-8 max-w-3xl">
      <h1 className="text-xl font-semibold text-[--text] mb-6">Slider Images</h1>

      <div className="bg-white border border-[--border] p-6 mb-8">
        <p className="font-mono-chem text-[9px] tracking-widest uppercase text-brand mb-4">Add Slide</p>
        <form action={createSlide} className="grid grid-cols-3 gap-4 items-end">
          <div className="col-span-2">
            <label className="field-label">Image</label>
            <input type="file" name="image" accept="image/*" required className="field" />
          </div>
          <div>
            <label className="field-label">Sort Order</label>
            <input type="number" name="sort_order" defaultValue={0} className="field" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="active" id="slide-active" defaultChecked />
            <label htmlFor="slide-active" className="field-label mb-0">Active</label>
          </div>
          <button type="submit" className="btn-primary text-[12px] py-2 px-4 col-span-2">Upload Slide</button>
        </form>
      </div>

      <div className="space-y-3">
        {slides?.map((slide) => (
          <div key={slide.id} className="bg-white border border-[--border] p-4 flex items-center gap-4">
            <div className="w-32 h-20 relative shrink-0 bg-surface overflow-hidden">
              <Image src={slide.image_url} alt="Slide" fill className="object-cover" unoptimized />
            </div>
            <form action={updateSlide} className="flex items-center gap-4 flex-1">
              <input type="hidden" name="id" value={slide.id} />
              <div>
                <label className="field-label">Order</label>
                <input type="number" name="sort_order" defaultValue={slide.sort_order} className="field w-20 text-[13px] py-1.5" />
              </div>
              <div className="flex items-center gap-2 pt-4">
                <input type="checkbox" name="active" id={`active-${slide.id}`} defaultChecked={slide.active} />
                <label htmlFor={`active-${slide.id}`} className="field-label mb-0">Active</label>
              </div>
              <button type="submit" className="btn-outline text-[11px] py-1.5 px-3 mt-4">Save</button>
            </form>
            <div className="pt-4">
              <ConfirmDeleteForm id={slide.id} action={deleteSlide} message="Delete this slide?" />
            </div>
          </div>
        ))}
        {(!slides || slides.length === 0) && (
          <p className="text-[--subtle] text-[13px]">No slides yet. Upload one above.</p>
        )}
      </div>
    </div>
  )
}
