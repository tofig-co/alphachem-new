import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { ConfirmDeleteForm } from '../_components/ConfirmDeleteForm'
import { SubmitButton } from '../_components/SubmitButton'
import { createSlide, updateSlide, deleteSlide } from './actions'

const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-[13px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors bg-white'
const labelClass = 'block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5'

export default async function SliderPage() {
  const supabase = await createClient()
  const { data: slides } = await supabase
    .from('slider_images')
    .select('*')
    .order('sort_order')

  return (
    <div className="px-8 py-8 max-w-3xl">
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Slider</h1>
        <span className="ml-3 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[12px] font-medium">
          {slides?.length ?? 0} slides
        </span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-4">Add Slide</p>
        <form action={createSlide} className="grid grid-cols-3 gap-4 items-end">
          <div className="col-span-2">
            <label className={labelClass}>Image</label>
            <input type="file" name="image" accept="image/*" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Sort Order</label>
            <input type="number" name="sort_order" defaultValue={0} className={inputClass} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="active" id="slide-active" defaultChecked className="w-4 h-4 rounded accent-brand" />
            <label htmlFor="slide-active" className="text-[13px] text-slate-700 cursor-pointer">Active</label>
          </div>
          <div className="col-span-2">
            <SubmitButton>Upload Slide</SubmitButton>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {slides && slides.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {slides.map((slide) => (
              <div key={slide.id} className="flex items-center gap-4 p-4">
                <div className="w-32 h-20 relative shrink-0 bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                  <Image src={slide.image_url} alt="Slide" fill className="object-cover" unoptimized />
                </div>
                <form action={updateSlide} className="flex items-center gap-4 flex-1">
                  <input type="hidden" name="id" value={slide.id} />
                  <div>
                    <label className={labelClass}>Order</label>
                    <input type="number" name="sort_order" defaultValue={slide.sort_order} className={`${inputClass} w-20`} />
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <input type="checkbox" name="active" id={`active-${slide.id}`} defaultChecked={slide.active} className="w-4 h-4 rounded accent-brand" />
                    <label htmlFor={`active-${slide.id}`} className="text-[13px] text-slate-700 cursor-pointer">Active</label>
                  </div>
                  <div className="mt-4">
                    <SubmitButton className="py-1.5 px-3 text-[12px]">Save</SubmitButton>
                  </div>
                </form>
                <div className="mt-4 shrink-0">
                  <ConfirmDeleteForm id={slide.id} action={deleteSlide} message="Delete this slide?" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="px-4 py-10 text-center text-[13px] text-slate-400">No slides yet. Upload one above.</p>
        )}
      </div>
    </div>
  )
}
