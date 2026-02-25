import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Lock,
  Eye,
  EyeOff,
  User,
  Code2,
  Briefcase,
  FolderOpen,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  Wrench,
  Save,
  AlertCircle,
  KeyRound,
  RotateCcw,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

// ─── helpers ─────────────────────────────────────────────────────────────────
function encodePass(p) {
  try {
    return btoa(unescape(encodeURIComponent(p)));
  } catch {
    return btoa(p);
  }
}

const DEFAULT_HASH = "c2FtdWVsQGFkbTIwMjU="; // btoa('samuel@adm2025') — senha padrão

// ─── small shared ui ─────────────────────────────────────────────────────────
const Input = ({ label, value, onChange, type = "text", placeholder = "" }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-xs font-medium text-neutral-400 dark:text-neutral-400">
        {label}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-xl text-sm
        bg-neutral-100 dark:bg-neutral-800/80
        border border-neutral-200 dark:border-neutral-700
        text-neutral-900 dark:text-neutral-100
        placeholder-neutral-400 dark:placeholder-neutral-500
        focus:outline-none focus:ring-2 focus:ring-emerald-500/50
        transition"
    />
  </div>
);

const Textarea = ({ label, value, onChange, rows = 3, placeholder = "" }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-xs font-medium text-neutral-400 dark:text-neutral-400">
        {label}
      </label>
    )}
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-xl text-sm resize-none
        bg-neutral-100 dark:bg-neutral-800/80
        border border-neutral-200 dark:border-neutral-700
        text-neutral-900 dark:text-neutral-100
        placeholder-neutral-400 dark:placeholder-neutral-500
        focus:outline-none focus:ring-2 focus:ring-emerald-500/50
        transition"
    />
  </div>
);

const Btn = ({ onClick, children, variant = "primary", className = "", type = "button" }) => {
  const base =
    "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-500/50 " +
    className;
  const variants = {
    primary:
      "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20",
    secondary:
      "bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100",
    danger:
      "bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20",
    ghost:
      "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300",
  };
  return (
    <button type={type} onClick={onClick} className={base + " " + variants[variant]}>
      {children}
    </button>
  );
};

const Select = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label className="text-xs font-medium text-neutral-400">{label}</label>
    )}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-xl text-sm
        bg-neutral-100 dark:bg-neutral-800/80
        border border-neutral-200 dark:border-neutral-700
        text-neutral-900 dark:text-neutral-100
        focus:outline-none focus:ring-2 focus:ring-emerald-500/50
        transition"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

// List of strings editor (for highlights, points)
const StringListEditor = ({ label, items, onChange }) => {
  const [newItem, setNewItem] = useState("");

  const add = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    onChange([...items, trimmed]);
    setNewItem("");
  };

  const remove = (idx) => onChange(items.filter((_, i) => i !== idx));
  const update = (idx, val) =>
    onChange(items.map((it, i) => (i === idx ? val : it)));

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-xs font-medium text-neutral-400">{label}</label>
      )}
      <div className="space-y-1.5">
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => update(idx, e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-lg text-sm
                bg-neutral-100 dark:bg-neutral-800/80
                border border-neutral-200 dark:border-neutral-700
                text-neutral-900 dark:text-neutral-100
                focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
            />
            <button
              type="button"
              onClick={() => remove(idx)}
              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Adicionar item..."
          className="flex-1 px-3 py-1.5 rounded-lg text-sm
            bg-neutral-100 dark:bg-neutral-800/80
            border border-dashed border-neutral-300 dark:border-neutral-600
            text-neutral-900 dark:text-neutral-100
            placeholder-neutral-400
            focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition text-sm"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ─── Section editors ──────────────────────────────────────────────────────────

// ── Personal Info ─────────────────────────────────────────────────────────────
function PersonalEditor({ data, onChange }) {
  const p = data.personal;
  const set = (key, val) => onChange({ ...data, personal: { ...p, [key]: val } });

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
        Informações Pessoais
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input label="Nome" value={p.name} onChange={(v) => set("name", v)} />
        <Input label="Cargo (PT)" value={p.role_pt} onChange={(v) => set("role_pt", v)} />
        <Input label="Cargo (EN)" value={p.role_en} onChange={(v) => set("role_en", v)} />
        <Input label="Localização" value={p.location} onChange={(v) => set("location", v)} />
        <Input label="Telefone" value={p.phone} onChange={(v) => set("phone", v)} />
        <Input label="Email" value={p.email} type="email" onChange={(v) => set("email", v)} />
        <Input label="GitHub URL" value={p.github} onChange={(v) => set("github", v)} />
        <Input label="LinkedIn URL" value={p.linkedin} onChange={(v) => set("linkedin", v)} />
        <Input label="Anos de experiência" value={p.stats_years} onChange={(v) => set("stats_years", v)} />
        <Input label="Nº de projetos" value={p.stats_projects} onChange={(v) => set("stats_projects", v)} />
      </div>
      <Textarea
        label="Bio (PT)"
        value={p.bio_pt}
        rows={3}
        onChange={(v) => set("bio_pt", v)}
      />
      <Textarea
        label="Bio (EN)"
        value={p.bio_en}
        rows={3}
        onChange={(v) => set("bio_en", v)}
      />
    </div>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function AboutEditor({ data, onChange }) {
  const p = data.personal;
  const set = (key, val) => onChange({ ...data, personal: { ...p, [key]: val } });

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Sobre Mim</h3>
      <Textarea label="Descrição (PT)" value={p.about_pt} rows={3} onChange={(v) => set("about_pt", v)} />
      <Textarea label="Descrição (EN)" value={p.about_en} rows={3} onChange={(v) => set("about_en", v)} />
      <StringListEditor
        label="Destaques (PT)"
        items={p.highlights_pt}
        onChange={(v) => set("highlights_pt", v)}
      />
      <StringListEditor
        label="Highlights (EN)"
        items={p.highlights_en}
        onChange={(v) => set("highlights_en", v)}
      />
    </div>
  );
}

// ── Stack ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "database", label: "Database" },
  { value: "devops", label: "DevOps / Cloud" },
  { value: "ai", label: "IA / Automação" },
];

function StackEditor({ data, onChange }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", category: "frontend" });
  const [adding, setAdding] = useState(false);

  const items = data.tech;
  const setItems = (tech) => onChange({ ...data, tech });

  const startAdd = () => {
    setAdding(true);
    setEditing(null);
    setForm({ name: "", category: "frontend" });
  };

  const startEdit = (item) => {
    setEditing(item.id);
    setAdding(false);
    setForm({ name: item.name, category: item.category });
  };

  const save = () => {
    if (!form.name.trim()) return;
    if (adding) {
      setItems([...items, { id: Date.now(), ...form }]);
      setAdding(false);
    } else {
      setItems(items.map((it) => (it.id === editing ? { ...it, ...form } : it)));
      setEditing(null);
    }
  };

  const remove = (id) => setItems(items.filter((it) => it.id !== id));

  const catColor = {
    frontend: "text-sky-400",
    backend: "text-emerald-400",
    database: "text-amber-400",
    devops: "text-violet-400",
    ai: "text-pink-400",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">Stack Tecnológica</h3>
        <Btn onClick={startAdd} variant="primary">
          <Plus className="w-4 h-4" /> Adicionar
        </Btn>
      </div>

      <AnimatePresence>
        {(adding || editing !== null) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3"
          >
            <div className="grid sm:grid-cols-2 gap-3">
              <Input label="Nome da tecnologia" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="ex: React.js" />
              <Select
                label="Categoria"
                value={form.category}
                onChange={(v) => setForm({ ...form, category: v })}
                options={CATEGORIES}
              />
            </div>
            <div className="flex gap-2">
              <Btn onClick={save} variant="primary"><Check className="w-4 h-4" /> Salvar</Btn>
              <Btn onClick={() => { setAdding(false); setEditing(null); }} variant="secondary">Cancelar</Btn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-1.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl
              bg-neutral-100/80 dark:bg-neutral-800/40
              border border-neutral-200 dark:border-neutral-700/60"
          >
            <div className="flex items-center gap-3">
              <span className={`text-xs font-medium ${catColor[item.category] || "text-neutral-400"}`}>
                {CATEGORIES.find((c) => c.value === item.category)?.label || item.category}
              </span>
              <span className="text-sm text-neutral-800 dark:text-neutral-200">{item.name}</span>
            </div>
            <div className="flex gap-1">
              <button onClick={() => startEdit(item)} className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => remove(item.id)} className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Services ──────────────────────────────────────────────────────────────────
const ICON_OPTIONS = [
  { value: "laptop", label: "Frontend / Web" },
  { value: "server", label: "Backend / API" },
  { value: "database", label: "Banco de Dados" },
  { value: "rocket", label: "DevOps / Cloud" },
  { value: "cpu", label: "IA / Automação" },
  { value: "sparkles", label: "Destaque" },
];

function ServiceCard({ item, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-neutral-100/80 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60">
      <div>
        <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{item.title_pt}</div>
        <div className="text-xs text-neutral-400 truncate max-w-[260px]">{item.desc_pt}</div>
      </div>
      <div className="flex gap-1 ml-2">
        <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition">
          <Edit2 className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function ServiceForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(
    initial || { title_pt: "", title_en: "", desc_pt: "", desc_en: "", icon: "laptop" }
  );
  const s = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <Input label="Título (PT)" value={form.title_pt} onChange={(v) => s("title_pt", v)} />
        <Input label="Title (EN)" value={form.title_en} onChange={(v) => s("title_en", v)} />
      </div>
      <Textarea label="Descrição (PT)" value={form.desc_pt} rows={2} onChange={(v) => s("desc_pt", v)} />
      <Textarea label="Description (EN)" value={form.desc_en} rows={2} onChange={(v) => s("desc_en", v)} />
      <Select label="Ícone" value={form.icon} onChange={(v) => s("icon", v)} options={ICON_OPTIONS} />
      <div className="flex gap-2">
        <Btn onClick={() => onSave(form)} variant="primary"><Check className="w-4 h-4" /> Salvar</Btn>
        <Btn onClick={onCancel} variant="secondary">Cancelar</Btn>
      </div>
    </div>
  );
}

function SortableServiceItem({ item, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {children({ attributes, listeners })}
    </div>
  );
}

function ServicesEditor({ data, onChange }) {
  const [editingId, setEditingId] = useState(null);
  const [adding, setAdding] = useState(false);

  const items = data.services;
  const setItems = (services) => onChange({ ...data, services });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <Btn onClick={() => setAdding(true)} variant="primary">
        <Plus className="w-4 h-4" /> Adicionar
      </Btn>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) =>
            editingId === item.id ? (
              <ServiceForm
                key={item.id}
                initial={item}
                onSave={(f) => {
                  setItems(
                    items.map((it) =>
                      it.id === item.id ? { ...it, ...f } : it
                    )
                  );
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <SortableServiceItem key={item.id} item={item}>
                {({ attributes, listeners }) => (
                  <div className="flex items-center justify-between p-3 border rounded-xl bg-neutral-100 dark:bg-neutral-800">
                    
                    <div
                      {...attributes}
                      {...listeners}
                      className="mr-3 cursor-grab text-neutral-400"
                    >
                      ⋮⋮
                    </div>

                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {item.title_pt}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => setEditingId(item.id)}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setItems(items.filter((i) => i.id !== item.id))
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </SortableServiceItem>
            )
          )}
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableProjectItem({ item, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={isDragging ? "opacity-50" : ""}
    >
      {children({ attributes, listeners })}
    </div>
  );
}

function ProjectsEditor({ data, onChange }) {
  const [editingId, setEditingId] = useState(null);
  const [adding, setAdding] = useState(false);

  const items = data.projects;
  const setItems = (projects) =>
    onChange({ ...data, projects });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex(
        (i) => i.id === active.id
      );
      const newIndex = items.findIndex(
        (i) => i.id === over.id
      );

      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
          Projetos
        </h3>

        <Btn
          onClick={() => {
            setAdding(true);
            setEditingId(null);
          }}
          variant="primary"
        >
          <Plus className="w-4 h-4" /> Adicionar
        </Btn>
      </div>

      {/* ADD FORM */}
      {adding && (
        <ProjectForm
          onSave={(f) => {
            setItems([
              ...items,
              { id: Date.now(), ...f },
            ]);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      {/* DND LIST */}
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {items.map((item) =>
              editingId === item.id ? (
                <ProjectForm
                  key={item.id}
                  initial={item}
                  onSave={(f) => {
                    setItems(
                      items.map((it) =>
                        it.id === item.id
                          ? { ...it, ...f }
                          : it
                      )
                    );
                    setEditingId(null);
                  }}
                  onCancel={() =>
                    setEditingId(null)
                  }
                />
              ) : (
                <SortableProjectItem
                  key={item.id}
                  item={item}
                >
                  {({ attributes, listeners }) => (
                    <div className="flex items-center justify-between p-4 border rounded-xl bg-neutral-100 dark:bg-neutral-800">

                      {/* DRAG HANDLE */}
                      <div
                        {...attributes}
                        {...listeners}
                        className="mr-3 cursor-grab active:cursor-grabbing text-neutral-400"
                      >
                        ⋮⋮
                      </div>

                      {/* INFO */}
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {item.title_pt}
                        </div>
                        {item.stack && (
                          <div className="text-xs text-neutral-400">
                            {item.stack}
                          </div>
                        )}
                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-2 ml-3">
                        <button
                          onClick={() =>
                            setEditingId(item.id)
                          }
                          className="text-neutral-400 hover:text-emerald-400"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() =>
                            setItems(
                              items.filter(
                                (i) =>
                                  i.id !== item.id
                              )
                            )
                          }
                          className="text-neutral-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </SortableProjectItem>
              )
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}


// ── Projects ──────────────────────────────────────────────────────────────────
function ProjectForm({ initial, onSave, onCancel }) {
  const blank = {
    title_pt: "", title_en: "", tag_pt: "", tag_en: "",
    blurb_pt: "", blurb_en: "",
    bullets_pt: [], bullets_en: [],
    live: "#", repo: "#",
  };
  const [form, setForm] = useState(initial || blank);
  const s = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <Input label="Título (PT)" value={form.title_pt} onChange={(v) => s("title_pt", v)} />
        <Input label="Title (EN)" value={form.title_en} onChange={(v) => s("title_en", v)} />
        <Input label="Tag (PT)" value={form.tag_pt} onChange={(v) => s("tag_pt", v)} placeholder="SaaS • IA" />
        <Input label="Tag (EN)" value={form.tag_en} onChange={(v) => s("tag_en", v)} placeholder="SaaS • AI" />
      </div>
      <Textarea label="Descrição curta (PT)" value={form.blurb_pt} rows={2} onChange={(v) => s("blurb_pt", v)} />
      <Textarea label="Short description (EN)" value={form.blurb_en} rows={2} onChange={(v) => s("blurb_en", v)} />
      <div className="grid sm:grid-cols-2 gap-3">
        <StringListEditor label="Bullets (PT)" items={form.bullets_pt} onChange={(v) => s("bullets_pt", v)} />
        <StringListEditor label="Bullets (EN)" items={form.bullets_en} onChange={(v) => s("bullets_en", v)} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <Input label="Link Demo / Live" value={form.live} onChange={(v) => s("live", v)} placeholder="https://..." />
        <Input label="Link Repositório" value={form.repo} onChange={(v) => s("repo", v)} placeholder="https://github.com/..." />
      </div>
      <div className="flex gap-2">
        <Btn onClick={() => onSave(form)} variant="primary"><Check className="w-4 h-4" /> Salvar</Btn>
        <Btn onClick={onCancel} variant="secondary">Cancelar</Btn>
      </div>
    </div>
  );
}


// ── Experience ─────────────────────────────────────────────────────────────────
function ExperienceForm({ initial, onSave, onCancel }) {
  const blank = {
    when_pt: "", when_en: "", role_pt: "", role_en: "", org: "",
    points_pt: [], points_en: [],
  };
  const [form, setForm] = useState(initial || blank);
  const s = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <Input label="Período (PT)" value={form.when_pt} onChange={(v) => s("when_pt", v)} placeholder="jan/2024 → mai/2025" />
        <Input label="Period (EN)" value={form.when_en} onChange={(v) => s("when_en", v)} placeholder="Jan/2024 → May/2025" />
        <Input label="Cargo (PT)" value={form.role_pt} onChange={(v) => s("role_pt", v)} />
        <Input label="Role (EN)" value={form.role_en} onChange={(v) => s("role_en", v)} />
      </div>
      <Input label="Empresa / Organização" value={form.org} onChange={(v) => s("org", v)} placeholder="Empresa • Cidade/UF • Remoto" />
      <div className="grid sm:grid-cols-2 gap-3">
        <StringListEditor label="Pontos (PT)" items={form.points_pt} onChange={(v) => s("points_pt", v)} />
        <StringListEditor label="Points (EN)" items={form.points_en} onChange={(v) => s("points_en", v)} />
      </div>
      <div className="flex gap-2">
        <Btn onClick={() => onSave(form)} variant="primary"><Check className="w-4 h-4" /> Salvar</Btn>
        <Btn onClick={onCancel} variant="secondary">Cancelar</Btn>
      </div>
    </div>
  );
}


function SortableExperienceItem({ item, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-50" : ""}
    >
      {children({ attributes, listeners })}
    </div>
  );
}

function ExperienceEditor({ data, onChange }) {
  const [editingId, setEditingId] = useState(null);
  const [adding, setAdding] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const items = data.experiences;
  const setItems = (experiences) =>
    onChange({ ...data, experiences });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
          Experiências
        </h3>

        <Btn
          onClick={() => {
            setAdding(true);
            setEditingId(null);
          }}
          variant="primary"
        >
          <Plus className="w-4 h-4" /> Adicionar
        </Btn>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ExperienceForm
              onSave={(f) => {
                setItems([...items, { id: Date.now(), ...f }]);
                setAdding(false);
              }}
              onCancel={() => setAdding(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {items.map((item) =>
              editingId === item.id ? (
                <ExperienceForm
                  key={item.id}
                  initial={item}
                  onSave={(f) => {
                    setItems(
                      items.map((it) =>
                        it.id === item.id ? { ...it, ...f } : it
                      )
                    );
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <SortableExperienceItem key={item.id} item={item}>
                  {({ attributes, listeners }) => (
                    <div className="rounded-xl bg-neutral-100/80 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 overflow-hidden">
                      
                      {/* HEADER */}
                      <div className="flex items-center justify-between px-4 py-3">
                        
                        {/* DRAG HANDLE */}
                        <div
                          {...attributes}
                          {...listeners}
                          className="mr-3 cursor-grab active:cursor-grabbing text-neutral-400"
                        >
                          ⋮⋮
                        </div>

                        <button
                          className="flex-1 text-left"
                          onClick={() =>
                            setExpanded(expanded === item.id ? null : item.id)
                          }
                        >
                          <div className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            {item.role_pt}
                          </div>
                          <div className="text-xs text-neutral-400">
                            {item.when_pt} • {item.org}
                          </div>
                        </button>

                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => setEditingId(item.id)}
                            className="p-1.5 text-neutral-400 hover:text-emerald-400"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() =>
                              setItems(items.filter((it) => it.id !== item.id))
                            }
                            className="p-1.5 text-neutral-400 hover:text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {expanded === item.id && (
                        <div className="px-4 pb-3">
                          {item.points_pt.map((p, i) => (
                            <div
                              key={i}
                              className="text-xs text-neutral-500"
                            >
                              • {p}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </SortableExperienceItem>
              )
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

// ── Settings ──────────────────────────────────────────────────────────────────
function SettingsEditor({ defaultData, onReset, adminHash, onHashChange }) {
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confPwd, setConfPwd] = useState("");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [msg, setMsg] = useState(null);

  const changePassword = () => {
    const storedHash = adminHash || DEFAULT_HASH;
    if (encodePass(oldPwd) !== storedHash) {
      setMsg({ type: "error", text: "Senha atual incorreta." });
      return;
    }
    if (newPwd.length < 6) {
      setMsg({ type: "error", text: "Nova senha deve ter pelo menos 6 caracteres." });
      return;
    }
    if (newPwd !== confPwd) {
      setMsg({ type: "error", text: "As senhas não coincidem." });
      return;
    }
    onHashChange(encodePass(newPwd));
    setOldPwd(""); setNewPwd(""); setConfPwd("");
    setMsg({ type: "success", text: "Senha alterada com sucesso! Salva no Supabase." });
    setTimeout(() => setMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Alterar Senha do Admin</h3>
        <div className="space-y-3 max-w-sm">
          <div className="relative">
            <Input label="Senha atual" value={oldPwd} onChange={setOldPwd} type={showOld ? "text" : "password"} placeholder="••••••••" />
            <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 bottom-2 text-neutral-400 hover:text-neutral-600">
              {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="relative">
            <Input label="Nova senha" value={newPwd} onChange={setNewPwd} type={showNew ? "text" : "password"} placeholder="••••••••" />
            <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 bottom-2 text-neutral-400 hover:text-neutral-600">
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <Input label="Confirmar nova senha" value={confPwd} onChange={setConfPwd} type="password" placeholder="••••••••" />
          {msg && (
            <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg ${msg.type === "error" ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"}`}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {msg.text}
            </div>
          )}
          <Btn onClick={changePassword} variant="primary"><KeyRound className="w-4 h-4" /> Alterar senha</Btn>
        </div>
      </div>

      <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Dados do Portfólio</h3>
        <p className="text-sm text-neutral-500 mb-3">
          Redefinir todo o conteúdo para os valores padrão originais. Esta ação não pode ser desfeita.
        </p>
        <Btn
          onClick={() => {
            if (window.confirm("Tem certeza que deseja redefinir todos os dados para o padrão?")) {
              onReset();
            }
          }}
          variant="danger"
        >
          <RotateCcw className="w-4 h-4" /> Redefinir para padrão
        </Btn>
      </div>
    </div>
  );
}

// ─── Password Gate ────────────────────────────────────────────────────────────
function PasswordGate({ onAuth, adminHash }) {
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const storedHash = adminHash || DEFAULT_HASH;
    if (encodePass(pwd) === storedHash) {
      onAuth();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, x: shake ? [0, -8, 8, -8, 8, 0] : 0 }}
        transition={{ duration: shake ? 0.4 : 0.2 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Área Restrita</h2>
          <p className="text-sm text-neutral-500 mt-1">Digite a senha de administrador</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="Senha de administrador"
              autoFocus
              className={`w-full px-4 py-3 pr-12 rounded-xl text-sm
                bg-neutral-100 dark:bg-neutral-800
                border ${error ? "border-red-500" : "border-neutral-200 dark:border-neutral-700"}
                text-neutral-900 dark:text-neutral-100
                placeholder-neutral-400
                focus:outline-none focus:ring-2 ${error ? "focus:ring-red-500/30" : "focus:ring-emerald-500/30"}
                transition`}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {error && (
            <p className="text-xs text-red-400 text-center">Senha incorreta. Tente novamente.</p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm transition shadow-lg shadow-emerald-500/20"
          >
            Entrar
          </button>
        </form>
        <p className="text-center text-xs text-neutral-400 mt-6">
          Senha padrão: <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-emerald-400 samuel@adm2025">Teu cú na minha mão! xD</code>
        </p>
      </motion.div>
    </div>
  );
}

// ─── MAIN ADMIN PANEL ─────────────────────────────────────────────────────────
const TABS = [
  { id: "personal", label: "Pessoal", icon: User },
  { id: "about", label: "Sobre", icon: Code2 },
  { id: "stack", label: "Stack", icon: Layers },
  { id: "services", label: "Serviços", icon: Wrench },
  { id: "projects", label: "Projetos", icon: FolderOpen },
  { id: "experience", label: "Experiência", icon: Briefcase },
  { id: "settings", label: "Config.", icon: Settings },
];

export default function AdminPanel({ data, defaultData, onSave, onClose, adminHash, onHashChange }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [localData, setLocalData] = useState(data);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(localData);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = async () => {
    setSaving(true);
    setLocalData(defaultData);
    await onSave(defaultData);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-stretch admin-overlay"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="ml-auto w-full max-w-3xl h-full flex flex-col bg-white dark:bg-neutral-900 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="font-semibold text-sm text-neutral-900 dark:text-white">Painel Admin</div>
              <div className="text-xs text-neutral-400">{authenticated ? "Conectado" : "Autenticação necessária"}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {authenticated && (
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed ${
                  saved
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-500/20"
                }`}
              >
                {saving ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                ) : saved ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar"}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!authenticated ? (
          <div className="flex-1 p-8">
            <PasswordGate onAuth={() => setAuthenticated(true)} adminHash={adminHash} />
          </div>
        ) : (
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-44 flex-shrink-0 border-r border-neutral-200 dark:border-neutral-800 py-3 overflow-y-auto hidden sm:flex flex-col gap-0.5">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 mx-2 rounded-xl text-sm transition text-left ${
                      activeTab === tab.id
                        ? "bg-emerald-500/10 text-emerald-500 font-medium"
                        : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile tabs */}
            <div className="sm:hidden w-full absolute top-16 left-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex overflow-x-auto">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center gap-1 px-3 py-2 text-xs whitespace-nowrap flex-shrink-0 border-b-2 transition ${
                      activeTab === tab.id
                        ? "border-emerald-500 text-emerald-500"
                        : "border-transparent text-neutral-400"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "personal" && (
                <PersonalEditor data={localData} onChange={setLocalData} />
              )}
              {activeTab === "about" && (
                <AboutEditor data={localData} onChange={setLocalData} />
              )}
              {activeTab === "stack" && (
                <StackEditor data={localData} onChange={setLocalData} />
              )}
              {activeTab === "services" && (
                <ServicesEditor data={localData} onChange={setLocalData} />
              )}
              {activeTab === "projects" && (
                <ProjectsEditor data={localData} onChange={setLocalData} />
              )}
              {activeTab === "experience" && (
                <ExperienceEditor data={localData} onChange={setLocalData} />
              )}
              {activeTab === "settings" && (
                <SettingsEditor defaultData={defaultData} onReset={handleReset} adminHash={adminHash} onHashChange={onHashChange} />
              )}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
