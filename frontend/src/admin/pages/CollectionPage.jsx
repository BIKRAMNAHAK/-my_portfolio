import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/apis/api_config'

const configs = {
  projects: {
    title: 'Projects',
    endpoint: '/projects',
    fields: [
      ['title', 'Title'],
      ['description', 'Description'],
      ['technologies', 'Technologies (comma-separated)'],
      ['githubUrl', 'GitHub URL'],
      ['liveUrl', 'Live URL'],
      ['featured', 'Featured (true/false)'],
    ],
  },
  skills: {
    title: 'Skills',
    endpoint: '/skills',
    fields: [
      ['name', 'Skill name'],
      ['category', 'Category'],
      ['icon', 'Icon'],
      ['displayOrder', 'Display order'],
    ],
  },
  experiences: {
    title: 'Experience',
    endpoint: '/experiences',
    fields: [
      ['company', 'Company'],
      ['position', 'Position'],
      ['startDate', 'Start date'],
      ['endDate', 'End date'],
      ['description', 'Description'],
      ['technologies', 'Technologies (comma-separated)'],
    ],
  },
}

export default function CollectionPage({ kind }) {
  const cfg = configs[kind]

  const [items, setItems] = useState([])
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = () => {
    api.get(cfg.endpoint).then(response => {
      setItems(response.data.data)
    }).catch(() => {
      toast.error('Could not load content')
    })
  }

  useEffect(() => {
    load()
  }, [kind])

  const fields = useMemo(() => cfg.fields, [cfg])

  const save = async event => {
    event.preventDefault()
    setBusy(true)

    const raw = Object.fromEntries(new FormData(event.currentTarget))

    if (raw.technologies) {
      raw.technologies = raw.technologies.split(',').map(item => item.trim()).filter(Boolean)
    }

    if (raw.featured) {
      raw.featured = raw.featured === 'true'
    }

    try {
      if (editing?._id) {
        await api.put(`${cfg.endpoint}/${editing._id}`, raw)
      } else {
        await api.post(cfg.endpoint, raw)
      }

      toast.success(`${cfg.title.slice(0, -1)} saved`)
      setEditing(null)
      load()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save')
    } finally {
      setBusy(false)
    }
  }

  const remove = async id => {
    if (!confirm('Delete this item?')) return

    try {
      await api.delete(`${cfg.endpoint}/${id}`)
      toast.success('Deleted')
      load()
    } catch {
      toast.error('Could not delete')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center gap-4">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="text-3xl font-black mt-3">{cfg.title}</h1>
        </div>

        <button className="action-primary" onClick={() => setEditing({})}>
          <Plus size={17} />
          Add
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto">
          <form onSubmit={save} className="glass-card max-w-xl mx-auto my-10 p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">{editing._id ? 'Edit' : 'Add'} {cfg.title.slice(0, -1)}</h2>

              <button type="button" onClick={() => setEditing(null)}>
                <X />
              </button>
            </div>

            <div className="grid gap-4 mt-6">
              {fields.map(([key, label]) => (
                <label key={key} className="field-label">
                  {label}

                  {key === 'description' ? (
                    <textarea name={key} required={key === 'description'} defaultValue={editing[key] || ''} className="field" rows="3" />
                  ) : (
                    <input name={key} required={['title', 'name', 'company', 'position'].includes(key)} defaultValue={Array.isArray(editing[key]) ? editing[key].join(', ') : editing[key] || ''} className="field" />
                  )}
                </label>
              ))}
            </div>

            <button type="submit" disabled={busy} className="action-primary mt-6 w-full justify-center">
              {busy ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </div>
      )}

      <div className="mt-8 glass-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-[var(--text-secondary)] border-b border-[var(--border-color)]">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Details</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items?.map(item => (
              <tr key={item._id} className="border-b border-[var(--border-color)] last:border-0">
                <td className="p-4 font-semibold">{item.title || item.name || item.company}</td>

                <td className="p-4 text-[var(--text-secondary)] max-w-sm truncate">
                  {item.description || item.position || item.category}
                </td>

                <td className="p-4 flex gap-2">
                  <button onClick={() => setEditing(item)} className="p-2 hover:text-primary">
                    <Pencil size={16} />
                  </button>

                  <button onClick={() => remove(item._id)} className="p-2 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}

            {!items?.length && (
              <tr>
                <td colSpan="3" className="p-8 text-center text-[var(--text-muted)]">
                  No {cfg.title.toLowerCase()} yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}