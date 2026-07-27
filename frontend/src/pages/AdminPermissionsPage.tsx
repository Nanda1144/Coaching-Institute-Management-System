import { useState } from 'react'
import { motion } from 'framer-motion'
import { MdSave, MdClose, MdSecurity, MdSearch, MdCheck } from 'react-icons/md'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } }
}

const ALL_PERMISSIONS = [
  { group: 'Faculty', perms: ['create:faculty', 'read:faculty', 'update:faculty', 'delete:faculty'] },
  { group: 'Students', perms: ['create:student', 'read:student', 'update:student', 'delete:student'] },
  { group: 'Parents', perms: ['create:parent', 'read:parent', 'update:parent', 'delete:parent'] },
  { group: 'Attendance', perms: ['create:attendance', 'read:attendance', 'update:attendance', 'delete:attendance'] },
  { group: 'Timetable', perms: ['create:timetable', 'read:timetable', 'update:timetable', 'delete:timetable'] },
  { group: 'Assignments', perms: ['create:assignment', 'read:assignment', 'update:assignment', 'delete:assignment'] },
  { group: 'Exams', perms: ['create:exam', 'read:exam', 'update:exam', 'delete:exam'] },
  { group: 'Fees', perms: ['create:fee', 'read:fee', 'update:fee', 'delete:fee'] },
  { group: 'Materials', perms: ['create:material', 'read:material', 'update:material', 'delete:material'] },
  { group: 'Notifications', perms: ['send:notification', 'read:notification'] },
  { group: 'Payments', perms: ['create:payment', 'read:payment', 'update:payment', 'delete:payment', 'process:refund'] },
  { group: 'Certificates', perms: ['create:certificate', 'read:certificate', 'update:certificate', 'delete:certificate'] },
  { group: 'Branches', perms: ['create:branch', 'read:branch', 'update:branch', 'delete:branch'] },
  { group: 'Reports', perms: ['read:dashboard', 'read:analytics', 'read:report'] },
  { group: 'System', perms: ['manage:roles', 'manage:settings'] },
]

export default function AdminPermissionsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [editPerms, setEditPerms] = useState<string[]>([])

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data } = await api.get('/admin/users')
      return (data as any)?.data ?? []
    },
  })

  const selectedUser = Array.isArray(users) ? users.find((u: any) => u.id === selectedUserId) : null

  const saveMutation = useMutation({
    mutationFn: async ({ id, permissions }: { id: string; permissions: string[] }) => {
      await api.put(`/admin/users/${id}/permissions`, { permissions })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setSelectedUserId(null)
      setEditPerms([])
    },
  })

  const openEditor = (user: any) => {
    setSelectedUserId(user.id)
    setEditPerms(user.permissions ?? [])
  }

  const togglePerm = (perm: string) => {
    setEditPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    )
  }

  const isPermissionGroupGranted = (perms: string[]) => {
    return perms.every((p) => editPerms.includes(p))
  }

  const toggleGroup = (perms: string[]) => {
    const allGranted = isPermissionGroupGranted(perms)
    if (allGranted) {
      setEditPerms((prev) => prev.filter((p) => !perms.includes(p)))
    } else {
      setEditPerms((prev) => {
        const next = new Set(prev)
        perms.forEach((p) => next.add(p))
        return [...next]
      })
    }
  }

  const userList = Array.isArray(users)
    ? users.filter((u: any) =>
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      )
    : []

  const sortOrder = ['SUPER_ADMIN', 'ADMIN', 'HOD', 'FACULTY']
  userList.sort((a: any, b: any) => {
    const ai = sortOrder.indexOf(a.role) ?? 99
    const bi = sortOrder.indexOf(b.role) ?? 99
    return ai - bi || (a.fullName || '').localeCompare(b.fullName || '')
  })

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="skeleton h-9 w-64 mb-2" />
        <div className="skeleton h-4 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={'sk' + i} className="skeleton h-96 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants} className="page-header">
          <div>
            <h1 className="gradient-text">Permission Management</h1>
            <p>Manage role-based access for all users</p>
          </div>
        </motion.div>

        <div className="relative mb-6 max-w-md">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-1 card overflow-hidden">
            <div className="p-4 border-b border-neutral-100">
              <h3 className="font-semibold text-neutral-800">Users ({userList.length})</h3>
            </div>
            <div className="divide-y divide-neutral-50 max-h-[600px] overflow-y-auto">
              {userList.length === 0 ? (
                <div className="p-6 text-center text-sm text-neutral-400">No users found</div>
              ) : (
                userList.map((user: any) => (
                  <button
                    key={user.id}
                    onClick={() => openEditor(user)}
                    className={`w-full text-left p-3.5 hover:bg-neutral-50 transition-colors flex items-center justify-between ${
                      selectedUserId === user.id ? 'bg-primary-50 ring-1 ring-primary-200' : ''
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-800 truncate">{user.fullName}</p>
                      <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className={`badge ${user.role === 'SUPER_ADMIN' ? 'badge-warning' : user.role === 'ADMIN' ? 'badge-success' : user.role === 'HOD' ? 'badge-primary' : 'badge-neutral'}`}>
                        {user.role}
                      </span>
                      <MdSecurity className="text-neutral-300" size={16} />
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:col-span-2 card p-5">
            {!selectedUser ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <MdSecurity className="text-neutral-200" size={64} />
                <h3 className="text-lg font-semibold text-neutral-500 mt-4">Select a user</h3>
                <p className="text-sm text-neutral-400 mt-1">Choose a user from the list to manage their permissions</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800">{selectedUser.fullName}</h3>
                    <p className="text-sm text-neutral-400">{selectedUser.email} &middot; {selectedUser.role}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedUserId(null); setEditPerms([]) }}
                    className="btn btn-ghost btn-sm"
                  >
                    <MdClose size={16} /> Close
                  </button>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {ALL_PERMISSIONS.map((group) => {
                    const allGranted = isPermissionGroupGranted(group.perms)
                    const someGranted = group.perms.some((p) => editPerms.includes(p))
                    return (
                      <div key={group.group} className="rounded-xl border border-neutral-100 overflow-hidden">
                        <button
                          onClick={() => toggleGroup(group.perms)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors ${
                            allGranted ? 'bg-primary-50 text-primary-700' : someGranted ? 'bg-neutral-50 text-neutral-700' : 'bg-white text-neutral-700'
                          }`}
                        >
                          <span>{group.group}</span>
                          <span className={`w-5 h-5 rounded flex items-center justify-center text-xs ${
                            allGranted ? 'bg-primary text-white' : someGranted ? 'bg-neutral-300 text-white' : 'border-2 border-neutral-300'
                          }`}>
                            {allGranted ? <MdCheck size={12} /> : ''}
                          </span>
                        </button>
                        <div className="px-4 py-2 space-y-1.5 bg-neutral-50/50">
                          {group.perms.map((perm) => (
                            <label
                              key={perm}
                              className="flex items-center gap-2.5 py-1 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={editPerms.includes(perm)}
                                onChange={() => togglePerm(perm)}
                                className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary/30"
                              />
                              <span className="text-xs text-neutral-600 group-hover:text-neutral-800 font-mono">
                                {perm}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-neutral-100">
                  <button
                    onClick={() => { setSelectedUserId(null); setEditPerms([]) }}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveMutation.mutate({ id: selectedUserId!, permissions: editPerms })}
                    disabled={saveMutation.isPending}
                    className="btn btn-primary"
                  >
                    <MdSave size={16} />
                    {saveMutation.isPending ? 'Saving...' : 'Save Permissions'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
