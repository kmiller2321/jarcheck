import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, Plus, Search, Filter, Download, Tag, Calendar, 
  Gauge, Layers, CheckCircle2, Clock, ShieldCheck, Printer, Trash2, X, AlertTriangle,
  ImageIcon, Link as LinkIcon, Upload, Check, Globe, Sparkles, Pencil
} from 'lucide-react';
import { CanningBatch } from '../types';
import { INITIAL_PANTRY_BATCHES } from '../data/usdaData';
import { JarLabelModal } from './JarLabelModal';
import { IMAGE_PRESETS, CANNING_JAR_SVG_FALLBACK } from '../utils/imageAssets';

// Royalty-Free Stock Photo Presets (Unsplash & Local)
const STOCK_CANNING_IMAGES = [
  {
    category: 'Jams & Preserves',
    title: 'Peach Jam & Berries',
    url: IMAGE_PRESETS.womanCanning2,
  },
  {
    category: 'Jams & Preserves',
    title: 'Artisan Glass Jam Jars',
    url: IMAGE_PRESETS.jams,
  },
  {
    category: 'Jams & Preserves',
    title: 'Golden Honey & Fruit',
    url: IMAGE_PRESETS.jams,
  },
  {
    category: 'Pickles & Ferments',
    title: 'Dill Pickles & Brine',
    url: IMAGE_PRESETS.pickles,
  },
  {
    category: 'Pickles & Ferments',
    title: 'Fermented Vegetables',
    url: IMAGE_PRESETS.canningPrep,
  },
  {
    category: 'Sauces & Tomatoes',
    title: 'Tomato Harvest Jars',
    url: IMAGE_PRESETS.womanCanning1,
  },
  {
    category: 'Sauces & Tomatoes',
    title: 'Marinara & Basil Sauce',
    url: IMAGE_PRESETS.tomatoes,
  },
  {
    category: 'Pantry & Stocks',
    title: 'Pantry Mason Jars Shelf',
    url: IMAGE_PRESETS.cansOnShelf1,
  },
  {
    category: 'Pantry & Stocks',
    title: 'Golden Broth & Stock',
    url: IMAGE_PRESETS.pantry,
  },
];

interface DigitalPantryProps {
  batches: CanningBatch[];
  onAddBatch: (newBatch: CanningBatch) => void;
  onDeleteBatch: (id: string) => void;
  onUpdateBatch?: (updatedBatch: CanningBatch) => void;
}

export const DigitalPantry: React.FC<DigitalPantryProps> = ({
  batches,
  onAddBatch,
  onDeleteBatch,
  onUpdateBatch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedBatchForLabel, setSelectedBatchForLabel] = useState<CanningBatch | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Batch Form State
  const [newRecipeName, setNewRecipeName] = useState('');
  const [newCanningDate, setNewCanningDate] = useState(new Date().toISOString().split('T')[0]);
  const [newJarCount, setNewJarCount] = useState<number>(6);
  const [newJarSize, setNewJarSize] = useState<CanningBatch['jarSize']>('Pint (16 oz)');
  const [newMethod, setNewMethod] = useState<'Water Bath Canner' | 'Pressure Canner'>('Water Bath Canner');
  const [newPsi, setNewPsi] = useState<string>('N/A (Water Bath)');
  const [newHeadspace, setNewHeadspace] = useState<string>('1/2 inch');
  const [newAltitude, setNewAltitude] = useState<number>(650);
  const [newPh, setNewPh] = useState<number>(3.8);
  const [newNotes, setNewNotes] = useState<string>('');
  const [newImage, setNewImage] = useState<string>(IMAGE_PRESETS.cansOnShelf1);

  // Image Source Tab inside add modal
  const [imageTab, setImageTab] = useState<'STOCK' | 'URL' | 'UPLOAD'>('STOCK');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editing Batch State & Modal
  const [editingBatch, setEditingBatch] = useState<CanningBatch | null>(null);
  const [editRecipeName, setEditRecipeName] = useState('');
  const [editCanningDate, setEditCanningDate] = useState('');
  const [editJarCount, setEditJarCount] = useState<number>(6);
  const [editJarSize, setEditJarSize] = useState<CanningBatch['jarSize']>('Pint (16 oz)');
  const [editMethod, setEditMethod] = useState<'Water Bath Canner' | 'Pressure Canner'>('Water Bath Canner');
  const [editPsi, setEditPsi] = useState<string>('N/A (Water Bath)');
  const [editHeadspace, setEditHeadspace] = useState<string>('1/2 inch');
  const [editProcessingTime, setEditProcessingTime] = useState<string>('15 Mins');
  const [editAltitude, setEditAltitude] = useState<number>(650);
  const [editPh, setEditPh] = useState<number>(3.8);
  const [editStatus, setEditStatus] = useState<'Sealed & Shelf Ready' | 'In Quarantine' | 'Consumed' | 'Unsealed - Refrigerate'>('Sealed & Shelf Ready');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editImage, setEditImage] = useState<string>(IMAGE_PRESETS.cansOnShelf1);

  const [editImageTab, setEditImageTab] = useState<'STOCK' | 'URL' | 'UPLOAD'>('STOCK');
  const [editCustomUrlInput, setEditCustomUrlInput] = useState<string>('');
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Filtering Logic
  const filteredBatches = batches.filter((b) => {
    const matchesSearch = b.recipeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.batchCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === 'ALL' || b.processingMethod === methodFilter;
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchesSearch && matchesMethod && matchesStatus;
  });

  // Global Download Master Log (CSV format)
  const handleDownloadMasterLog = () => {
    const headers = ['Batch Code', 'Recipe Name', 'Date', 'Jar Count', 'Jar Size', 'Method', 'PSI', 'Headspace', 'Altitude (ft)', 'pH Level', 'Status', 'Expiration Date', 'Notes'];
    const rows = batches.map(b => [
      `"${b.batchCode}"`,
      `"${b.recipeName}"`,
      `"${b.canningDate}"`,
      b.jarCount,
      `"${b.jarSize}"`,
      `"${b.processingMethod}"`,
      `"${b.psi}"`,
      `"${b.headspace}"`,
      b.altitudeFeet,
      b.phLevel,
      `"${b.status}"`,
      `"${b.expirationDate}"`,
      `"${(b.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `JarCheck_Master_Pantry_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipeName.trim()) return;

    const created: CanningBatch = {
      id: `batch-${Date.now()}`,
      batchCode: `PC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      recipeName: newRecipeName,
      canningDate: newCanningDate,
      jarCount: Number(newJarCount),
      jarSize: newJarSize,
      processingMethod: newMethod,
      psi: newMethod === 'Pressure Canner' ? (newPsi || '11 PSI') : 'N/A (Water Bath)',
      headspace: newHeadspace,
      altitudeFeet: Number(newAltitude),
      phLevel: Number(newPh),
      status: 'Sealed & Shelf Ready',
      notes: newNotes,
      expirationDate: new Date(new Date(newCanningDate).setFullYear(new Date(newCanningDate).getFullYear() + 1)).toISOString().split('T')[0],
      image: newImage || '/images/cans_on_shelf_1.png'
    };

    onAddBatch(created);
    setIsAddModalOpen(false);
    setNewRecipeName('');
    setNewNotes('');
    setNewImage('/images/cans_on_shelf_1.png');
    setCustomUrlInput('');
  };

  const openEditModal = (batch: CanningBatch) => {
    setEditingBatch(batch);
    setEditRecipeName(batch.recipeName);
    setEditCanningDate(batch.canningDate);
    setEditJarCount(batch.jarCount);
    setEditJarSize(batch.jarSize);
    setEditMethod(batch.processingMethod);
    setEditPsi(typeof batch.psi === 'number' ? String(batch.psi) : batch.psi);
    setEditHeadspace(batch.headspace);
    setEditProcessingTime(batch.processingTimeMinutes ? String(batch.processingTimeMinutes) : '15 Mins');
    setEditAltitude(batch.altitudeFeet);
    setEditPh(batch.phLevel);
    setEditStatus(batch.status);
    setEditNotes(batch.notes || '');
    setEditImage(batch.image || '/images/cans_on_shelf_1.png');
    setEditImageTab('STOCK');
    setEditCustomUrlInput('');
  };

  const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch || !editRecipeName.trim()) return;

    const updated: CanningBatch = {
      ...editingBatch,
      recipeName: editRecipeName,
      canningDate: editCanningDate,
      jarCount: Number(editJarCount),
      jarSize: editJarSize,
      processingMethod: editMethod,
      psi: editMethod === 'Pressure Canner' ? (editPsi || '11 PSI') : 'N/A (Water Bath)',
      headspace: editHeadspace,
      processingTimeMinutes: editProcessingTime,
      altitudeFeet: Number(editAltitude),
      phLevel: Number(editPh),
      status: editStatus,
      notes: editNotes,
      image: editImage || editingBatch.image,
    };

    if (onUpdateBatch) {
      onUpdateBatch(updated);
    }
    setEditingBatch(null);
  };

  return (
    <section id="pantry" className="py-16 md:py-24 bg-gray-50/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header & Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-[#FF8107]/10 border border-[#FF8107]/20 px-3.5 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4 text-[#FF8107]" />
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF8107]">
                Cloud Inventory & Shelf Log
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0D0D0D] tracking-tight">
              Your Digital Pantry Log
            </h2>
            <p className="text-sm sm:text-base text-gray-600 font-normal">
              Track past canning batches, record PSI & pH metadata, print custom jar lid stickers, and export master USDA inventory logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadMasterLog}
              className="px-5 py-3 rounded-2xl bg-white border border-gray-300 hover:bg-gray-100 text-sm font-bold text-[#0D0D0D] shadow-sm flex items-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4 text-[#FF8107]" />
              <span>Download Master Log</span>
            </button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-[#FF8107] hover:bg-[#e06f00] text-white text-sm font-bold shadow-md shadow-[#FF8107]/25 flex items-center space-x-2 transition-all"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>Log New Canning Batch</span>
            </motion.button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-3xl shadow-md border border-gray-100 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          
          {/* Search Input */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by recipe name or batch code..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8107] text-sm text-[#0D0D0D]"
            />
          </div>

          {/* Method Filter */}
          <div className="sm:col-span-3">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8107] text-xs font-bold text-gray-700 bg-white"
            >
              <option value="ALL">All Canning Methods</option>
              <option value="Water Bath Canner">Water Bath Canner</option>
              <option value="Pressure Canner">Pressure Canner</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF8107] text-xs font-bold text-gray-700 bg-white"
            >
              <option value="ALL">All Shelf Statuses</option>
              <option value="Sealed & Shelf Ready">Sealed & Shelf Ready</option>
              <option value="In Quarantine">In Quarantine</option>
              <option value="Consumed">Consumed</option>
            </select>
          </div>
        </div>

        {/* Grid of Past Canning Batches */}
        {filteredBatches.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
            <p className="text-gray-500 font-medium">No canning batches found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBatches.map((batch) => (
              <motion.div
                key={batch.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[28px] overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between group"
              >
                <div>
                  {/* Card Thumbnail Image & Badge Header */}
                  <div className="relative h-44 overflow-hidden bg-gray-100">
                    <img
                      src={batch.image || IMAGE_PRESETS.cansOnShelf1}
                      alt={batch.recipeName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = CANNING_JAR_SVG_FALLBACK;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                        {batch.batchCode}
                      </span>

                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => openEditModal(batch)}
                          className="p-1.5 rounded-full bg-white/90 hover:bg-[#FF8107] hover:text-white text-gray-800 transition-colors shadow-sm"
                          title="Edit Batch Log"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteBatch(batch.id)}
                          className="p-1.5 rounded-full bg-white/90 hover:bg-red-500 hover:text-white text-gray-800 transition-colors shadow-sm"
                          title="Delete Batch"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        batch.status === 'Sealed & Shelf Ready' ? 'bg-emerald-500 text-white' :
                        batch.status === 'Consumed' ? 'bg-gray-600 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {batch.status}
                      </span>
                    </div>
                  </div>

                  {/* Body Metadata */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-[#0D0D0D] leading-snug group-hover:text-[#FF8107] transition-colors">
                        {batch.recipeName}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-400 font-semibold mt-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Canned on {batch.canningDate}</span>
                      </div>
                    </div>

                    {/* Technical Canning Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                      <div>
                        <span className="text-gray-400 font-bold block text-[10px] uppercase">Date</span>
                        <span className="font-extrabold text-[#0D0D0D]">{batch.canningDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold block text-[10px] uppercase">Jar Count</span>
                        <span className="font-extrabold text-[#0D0D0D]">{batch.jarCount} ({batch.jarSize.split(' ')[0]})</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold block text-[10px] uppercase">Method</span>
                        <span className="font-extrabold text-[#0D0D0D]">{batch.processingMethod}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold block text-[10px] uppercase">PSI Level</span>
                        <span className="font-extrabold text-[#0D0D0D]">{batch.psi}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold block text-[10px] uppercase">Headspace</span>
                        <span className="font-extrabold text-[#0D0D0D]">{batch.headspace}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 font-bold block text-[10px] uppercase">Processing Time</span>
                        <span className="font-extrabold text-[#0D0D0D]">{batch.processingTimeMinutes || '15 Mins'}</span>
                      </div>
                    </div>

                    {batch.notes && (
                      <p className="text-xs text-gray-600 italic line-clamp-2">
                        "{batch.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-6 pb-6 pt-0 flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(batch)}
                    className="flex-1 py-2.5 rounded-2xl bg-orange-50 hover:bg-[#FF8107] text-[#FF8107] hover:text-white text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1.5 border border-[#FF8107]/20"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit Log</span>
                  </button>
                  <button
                    onClick={() => setSelectedBatchForLabel(batch)}
                    className="flex-1 py-2.5 rounded-2xl bg-gray-100 hover:bg-gray-800 text-[#0D0D0D] hover:text-white text-xs font-bold transition-all duration-200 flex items-center justify-center space-x-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Export PDF</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Jar Label Printable Modal */}
      {selectedBatchForLabel && (
        <JarLabelModal
          batch={selectedBatchForLabel}
          onClose={() => setSelectedBatchForLabel(null)}
        />
      )}

      {/* Add New Batch Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-left border border-gray-100 my-8 space-y-6"
            >
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-[#0D0D0D]">Log New Canning Batch</h3>
                <p className="text-xs text-gray-500">Record metadata into your digital cloud pantry</p>
              </div>

              <form onSubmit={handleCreateBatch} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-700 block">Recipe Name *</label>
                  <input
                    type="text"
                    required
                    value={newRecipeName}
                    onChange={(e) => setNewRecipeName(e.target.value)}
                    placeholder="e.g. Grandma's Peach Butter"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#FF8107]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-700 block">Canning Date</label>
                    <input
                      type="date"
                      value={newCanningDate}
                      onChange={(e) => setNewCanningDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-700 block">Jar Count</label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={newJarCount}
                      onChange={(e) => setNewJarCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-700 block">Jar Size</label>
                    <select
                      value={newJarSize}
                      onChange={(e) => setNewJarSize(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    >
                      <option value="Half-Pint (8 oz)">Half-Pint (8 oz)</option>
                      <option value="Pint (16 oz)">Pint (16 oz)</option>
                      <option value="Quart (32 oz)">Quart (32 oz)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-700 block">Processing Method</label>
                    <select
                      value={newMethod}
                      onChange={(e) => setNewMethod(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    >
                      <option value="Water Bath Canner">Water Bath Canner</option>
                      <option value="Pressure Canner">Pressure Canner</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-700 block">Headspace</label>
                    <input
                      type="text"
                      value={newHeadspace}
                      onChange={(e) => setNewHeadspace(e.target.value)}
                      placeholder="1/2 in"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-700 block">PSI Level</label>
                    <input
                      type="text"
                      value={newPsi}
                      onChange={(e) => setNewPsi(e.target.value)}
                      placeholder="11 PSI"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-700 block">pH Level</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newPh}
                      onChange={(e) => setNewPh(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Batch Photo Selection Section */}
                <div className="space-y-2.5 pt-1 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-gray-700 flex items-center space-x-1.5">
                      <ImageIcon className="w-4 h-4 text-[#FF8107]" />
                      <span>Batch Photo & Jar Image</span>
                    </label>
                    <span className="text-[10px] text-gray-400 font-semibold">Royalty-Free / Custom URL / File</span>
                  </div>

                  {/* Selected Preview Pill */}
                  <div className="flex items-center space-x-3 bg-gray-50 p-2.5 rounded-2xl border border-gray-200/80">
                    <img 
                      src={newImage} 
                      alt="Selected batch preview" 
                      className="w-12 h-12 rounded-xl object-cover border border-gray-200 flex-shrink-0 shadow-sm"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/cans_on_shelf_1.png';
                      }}
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <span className="text-xs font-bold text-[#0D0D0D] block truncate">
                        {newImage.startsWith('data:') ? 'Uploaded Local Photo' : newImage.startsWith('http') ? 'External Image URL' : 'JarCheck Stock Library'}
                      </span>
                      <span className="text-[10px] text-gray-500 truncate block">
                        {newImage}
                      </span>
                    </div>
                  </div>

                  {/* Mode Tabs */}
                  <div className="flex items-center p-1 bg-gray-100 rounded-xl space-x-1 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setImageTab('STOCK')}
                      className={`flex-1 py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all ${
                        imageTab === 'STOCK' ? 'bg-white text-[#0D0D0D] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#FF8107]" />
                      <span>Free Library</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImageTab('URL')}
                      className={`flex-1 py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all ${
                        imageTab === 'URL' ? 'bg-white text-[#0D0D0D] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5 text-[#FF8107]" />
                      <span>Image URL</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImageTab('UPLOAD')}
                      className={`flex-1 py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all ${
                        imageTab === 'UPLOAD' ? 'bg-white text-[#0D0D0D] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5 text-[#FF8107]" />
                      <span>Upload File</span>
                    </button>
                  </div>

                  {/* Tab Content: Stock Library Grid */}
                  {imageTab === 'STOCK' && (
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 border border-gray-100 rounded-2xl bg-gray-50/50">
                      {STOCK_CANNING_IMAGES.map((item, idx) => {
                        const isSelected = newImage === item.url;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setNewImage(item.url)}
                            className={`group relative rounded-xl overflow-hidden border-2 text-left transition-all aspect-video bg-gray-200 ${
                              isSelected ? 'border-[#FF8107] ring-2 ring-[#FF8107]/20 shadow-md' : 'border-transparent hover:border-gray-300'
                            }`}
                          >
                            <img 
                              src={item.url} 
                              alt={item.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              referrerPolicy="no-referrer"
                            />
                            {isSelected && (
                              <div className="absolute top-1 right-1 bg-[#FF8107] text-white p-0.5 rounded-full shadow-md">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 text-left">
                              <span className="text-[9px] font-bold text-white block truncate leading-tight">{item.title}</span>
                              <span className="text-[8px] text-amber-300 block truncate leading-tight font-medium">{item.category}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Tab Content: Custom Image URL */}
                  {imageTab === 'URL' && (
                    <div className="space-y-2 p-3 bg-gray-50 rounded-2xl border border-gray-200/70 text-left">
                      <label className="text-[11px] font-semibold text-gray-600 block">
                        Paste any public image link (Pexels, Unsplash, Google Images, direct CDN):
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="url"
                          value={customUrlInput}
                          onChange={(e) => setCustomUrlInput(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FF8107] font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (customUrlInput.trim()) {
                              setNewImage(customUrlInput.trim());
                            }
                          }}
                          className="px-4 py-2 bg-[#FF8107] text-white rounded-xl text-xs font-bold hover:bg-[#e06f00] transition-colors"
                        >
                          Use Link
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tab Content: Upload File */}
                  {imageTab === 'UPLOAD' && (
                    <div className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center space-y-2">
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-[#0D0D0D]">Select a jar photo from your device</p>
                        <p className="text-[10px] text-gray-400">PNG, JPG, WEBP supported</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 shadow-sm"
                      >
                        Choose File
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-700 block">Notes & Seal Inspection</label>
                  <textarea
                    rows={2}
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="e.g. All lids sealed tightly, stored in dark cellar."
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-gray-300 text-xs font-bold text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-[#FF8107] hover:bg-[#e06f00] text-white text-xs font-bold shadow-md"
                  >
                    Save Batch
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
        {/* Edit Batch Modal */}
        {editingBatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-gray-100 space-y-6 text-left my-8"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#0D0D0D] flex items-center space-x-2">
                    <Pencil className="w-5 h-5 text-[#FF8107]" />
                    <span>Edit Pantry Canning Batch</span>
                  </h3>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Batch Code: <span className="font-mono font-bold text-[#FF8107]">{editingBatch.batchCode}</span>
                  </p>
                </div>

                <button
                  onClick={() => setEditingBatch(null)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateBatchSubmit} className="space-y-4 text-xs font-semibold">
                
                {/* Recipe Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-700 block">Recipe Name</label>
                  <input
                    type="text"
                    required
                    value={editRecipeName}
                    onChange={(e) => setEditRecipeName(e.target.value)}
                    placeholder="e.g. Spiced Peach Jam"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF8107] text-xs font-bold"
                  />
                </div>

                {/* Date & Jar Count */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-700 block">Canning Date</label>
                    <input
                      type="date"
                      required
                      value={editCanningDate}
                      onChange={(e) => setEditCanningDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-700 block">Jar Count</label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={editJarCount}
                      onChange={(e) => setEditJarCount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Jar Size & Method */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-700 block">Jar Size</label>
                    <select
                      value={editJarSize}
                      onChange={(e) => setEditJarSize(e.target.value as CanningBatch['jarSize'])}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    >
                      <option value="Half-Pint (8 oz)">Half-Pint (8 oz)</option>
                      <option value="Pint (16 oz)">Pint (16 oz)</option>
                      <option value="Quart (32 oz)">Quart (32 oz)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-700 block">Canning Method</label>
                    <select
                      value={editMethod}
                      onChange={(e) => {
                        const val = e.target.value as 'Water Bath Canner' | 'Pressure Canner';
                        setEditMethod(val);
                        if (val === 'Water Bath Canner') {
                          setEditPsi('N/A (Water Bath)');
                        } else {
                          setEditPsi('11 PSI');
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    >
                      <option value="Water Bath Canner">Water Bath Canner</option>
                      <option value="Pressure Canner">Pressure Canner</option>
                    </select>
                  </div>
                </div>

                {/* PSI & Headspace */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-700 block">PSI Pressure Level</label>
                    <input
                      type="text"
                      value={editPsi}
                      onChange={(e) => setEditPsi(e.target.value)}
                      placeholder="e.g. 11 PSI or N/A"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-700 block">Headspace</label>
                    <input
                      type="text"
                      value={editHeadspace}
                      onChange={(e) => setEditHeadspace(e.target.value)}
                      placeholder="e.g. 1/4 inch, 1/2 inch, 1 inch"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Processing Time, Altitude, pH & Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-700 block">Processing Time</label>
                    <input
                      type="text"
                      value={editProcessingTime}
                      onChange={(e) => setEditProcessingTime(e.target.value)}
                      placeholder="e.g. 15 Mins"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-700 block">Altitude (Feet)</label>
                    <input
                      type="number"
                      value={editAltitude}
                      onChange={(e) => setEditAltitude(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-700 block">pH Level</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editPh}
                      onChange={(e) => setEditPh(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase text-gray-700 block">Shelf Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as CanningBatch['status'])}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    >
                      <option value="Sealed & Shelf Ready">Sealed & Shelf Ready</option>
                      <option value="In Quarantine">In Quarantine</option>
                      <option value="Consumed">Consumed</option>
                      <option value="Unsealed - Refrigerate">Unsealed - Refrigerate</option>
                    </select>
                  </div>
                </div>

                {/* Edit Photo Section */}
                <div className="space-y-2.5 pt-1 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-gray-700 flex items-center space-x-1.5">
                      <ImageIcon className="w-4 h-4 text-[#FF8107]" />
                      <span>Batch Photo & Jar Image</span>
                    </label>
                  </div>

                  {/* Selected Preview Pill */}
                  <div className="flex items-center space-x-3 bg-gray-50 p-2.5 rounded-2xl border border-gray-200/80">
                    <img 
                      src={editImage} 
                      alt="Selected batch preview" 
                      className="w-12 h-12 rounded-xl object-cover border border-gray-200 flex-shrink-0 shadow-sm"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/cans_on_shelf_1.png';
                      }}
                    />
                    <div className="flex-1 min-w-0 text-left">
                      <span className="text-xs font-bold text-[#0D0D0D] block truncate">
                        {editImage.startsWith('data:') ? 'Uploaded Local Photo' : editImage.startsWith('http') ? 'External Image URL' : 'JarCheck Stock Library'}
                      </span>
                      <span className="text-[10px] text-gray-500 truncate block">
                        {editImage}
                      </span>
                    </div>
                  </div>

                  {/* Mode Tabs */}
                  <div className="flex items-center p-1 bg-gray-100 rounded-xl space-x-1 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setEditImageTab('STOCK')}
                      className={`flex-1 py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all ${
                        editImageTab === 'STOCK' ? 'bg-white text-[#0D0D0D] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#FF8107]" />
                      <span>Free Library</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditImageTab('URL')}
                      className={`flex-1 py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all ${
                        editImageTab === 'URL' ? 'bg-white text-[#0D0D0D] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5 text-[#FF8107]" />
                      <span>Image URL</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditImageTab('UPLOAD')}
                      className={`flex-1 py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all ${
                        editImageTab === 'UPLOAD' ? 'bg-white text-[#0D0D0D] shadow-sm' : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5 text-[#FF8107]" />
                      <span>Upload File</span>
                    </button>
                  </div>

                  {/* Tab Content: Stock Library Grid */}
                  {editImageTab === 'STOCK' && (
                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-1 border border-gray-100 rounded-2xl bg-gray-50/50">
                      {STOCK_CANNING_IMAGES.map((item, idx) => {
                        const isSelected = editImage === item.url;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setEditImage(item.url)}
                            className={`group relative rounded-xl overflow-hidden border-2 text-left transition-all aspect-video bg-gray-200 ${
                              isSelected ? 'border-[#FF8107] ring-2 ring-[#FF8107]/20 shadow-md' : 'border-transparent hover:border-gray-300'
                            }`}
                          >
                            <img 
                              src={item.url} 
                              alt={item.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              referrerPolicy="no-referrer"
                            />
                            {isSelected && (
                              <div className="absolute top-1 right-1 bg-[#FF8107] text-white p-0.5 rounded-full shadow-md">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1.5 text-left">
                              <span className="text-[9px] font-bold text-white block truncate leading-tight">{item.title}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Tab Content: Custom Image URL */}
                  {editImageTab === 'URL' && (
                    <div className="space-y-2 p-3 bg-gray-50 rounded-2xl border border-gray-200/70 text-left">
                      <label className="text-[11px] font-semibold text-gray-600 block">
                        Paste any image URL:
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="url"
                          value={editCustomUrlInput}
                          onChange={(e) => setEditCustomUrlInput(e.target.value)}
                          placeholder="https://..."
                          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-[#FF8107] font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (editCustomUrlInput.trim()) {
                              setEditImage(editCustomUrlInput.trim());
                            }
                          }}
                          className="px-4 py-2 bg-[#FF8107] text-white rounded-xl text-xs font-bold hover:bg-[#e06f00] transition-colors"
                        >
                          Use Link
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tab Content: Upload File */}
                  {editImageTab === 'UPLOAD' && (
                    <div className="p-4 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center space-y-2">
                      <input 
                        type="file" 
                        ref={editFileInputRef}
                        accept="image/*"
                        onChange={handleEditFileSelect}
                        className="hidden"
                      />
                      <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-[#0D0D0D]">Choose a new image file from your device</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => editFileInputRef.current?.click()}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 shadow-sm"
                      >
                        Select Image File
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-gray-700 block">Notes & Seal Inspection</label>
                  <textarea
                    rows={2}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="Notes..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingBatch(null)}
                    className="px-4 py-2 rounded-full border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-[#FF8107] hover:bg-[#e06f00] text-white text-xs font-extrabold shadow-md flex items-center space-x-1.5"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
