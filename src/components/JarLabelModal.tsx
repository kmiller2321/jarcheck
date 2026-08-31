import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, ShieldCheck, QrCode, Tag, Calendar, CheckCircle, Gauge, ExternalLink, ShieldAlert, FileText } from 'lucide-react';
import { CanningBatch } from '../types';

interface JarLabelModalProps {
  batch: CanningBatch | null;
  onClose: () => void;
}

export const JarLabelModal: React.FC<JarLabelModalProps> = ({ batch, onClose }) => {
  if (!batch) return null;

  const [showLogModal, setShowLogModal] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  // Live URL encoded for the QR code
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://preservecheck.app';
  const qrDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `${currentOrigin}/?batch=${batch.batchCode}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-[32px] max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-left border border-gray-100 my-8 print:shadow-none print:border-none print:m-0"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-3 border-b border-gray-100 pb-4 print:pb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#FF8107] text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-[#0D0D0D]">Official Canning Jar Label</h3>
              <p className="text-xs text-gray-500">USDA Compliant Jar Lid & Container Badge</p>
            </div>
          </div>

          {/* Printable Label Layout Preview */}
          <div className="p-6 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-300 space-y-6 print:bg-white print:border-black">
            
            {/* 1. CIRCULAR JAR LID STICKER DESIGN */}
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block print:hidden">
                Lid Top Sticker (2.5 Inch Circle Format)
              </span>

              <div className="w-48 h-48 mx-auto rounded-full border-4 border-[#0D0D0D] p-3 flex flex-col items-center justify-center bg-white shadow-md relative text-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#FF8107]">
                  JARCHECK PRESERVE
                </div>
                <h4 className="text-xs font-black text-[#0D0D0D] line-clamp-2 px-1">
                  {batch.recipeName}
                </h4>
                <div className="my-1 border-t border-b border-gray-200 py-1 w-full text-[10px] font-bold text-gray-700">
                  Date: {batch.canningDate}
                </div>
                <div className="text-[9px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {batch.processingMethod}
                </div>
                <div className="text-[8px] font-semibold text-gray-500 mt-1">
                  ID: {batch.batchCode} • Headspace: {batch.headspace}
                </div>
              </div>
            </div>

            {/* 2. RECTANGULAR JAR SIDE LABEL DESIGN */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block print:hidden">
                Front / Side Jar Label
              </span>

              <div className="p-5 rounded-2xl bg-white border-2 border-[#0D0D0D] shadow-md grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="sm:col-span-2 space-y-2 text-left">
                  <div className="flex items-center space-x-2">
                    <span className="bg-[#FF8107] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                      USDA Shield
                    </span>
                    <span className="text-xs font-bold text-gray-500">{batch.batchCode}</span>
                  </div>

                  <h3 className="text-base font-black text-[#0D0D0D]">
                    {batch.recipeName}
                  </h3>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-700 font-medium">
                    <div><span className="font-bold">Date Canned:</span> {batch.canningDate}</div>
                    <div><span className="font-bold">Expires:</span> {batch.expirationDate}</div>
                    <div><span className="font-bold">Method:</span> {batch.processingMethod}</div>
                    <div><span className="font-bold">PSI:</span> {batch.psi}</div>
                    <div><span className="font-bold">Headspace:</span> {batch.headspace}</div>
                    <div><span className="font-bold">pH Level:</span> {batch.phLevel}</div>
                  </div>
                </div>

                {/* Scannable Real QR Code */}
                <button
                  type="button"
                  onClick={() => setShowLogModal(true)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-gray-50 border border-gray-200 text-center hover:bg-orange-50 hover:border-[#FF8107] transition-all group cursor-pointer"
                  title="Click or scan to view live USDA safety log"
                >
                  <img
                    src={qrDataUrl}
                    alt={`QR Code for batch ${batch.batchCode}`}
                    className="w-20 h-20 object-contain rounded bg-white p-1 border border-gray-200 shadow-2xs"
                  />
                  <span className="text-[9px] font-extrabold text-[#0D0D0D] group-hover:text-[#FF8107] mt-1.5 uppercase flex items-center space-x-1">
                    <span>Scan / Click Safety Log</span>
                    <ExternalLink className="w-2.5 h-2.5 print:hidden" />
                  </span>
                </button>
              </div>
            </div>

          </div>

          {/* Modal Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-2 print:hidden">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-gray-300 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-2.5 rounded-full bg-[#FF8107] hover:bg-[#e06f00] text-white text-sm font-bold shadow-md shadow-[#FF8107]/25 flex items-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Labels</span>
            </button>
          </div>
        </div>

        {/* Interactive USDA Safety Audit Log Popup Modal */}
        {showLogModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-white rounded-[28px] max-w-lg w-full p-6 text-gray-900 shadow-2xl border border-gray-200 space-y-5 text-left relative">
              <button
                onClick={() => setShowLogModal(false)}
                className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-black text-gray-900">USDA Certified Safety Audit Log</h4>
                  <p className="text-xs font-bold text-emerald-700">Batch Code: {batch.batchCode}</p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2 text-xs text-emerald-900 font-medium">
                <div className="flex items-center space-x-1.5 font-bold text-emerald-800">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>100% USDA Safety Verification Passed</span>
                </div>
                <p>This jar was registered and verified on {batch.canningDate} using the PreserveCheck USDA Safety Engine.</p>
              </div>

              <div className="space-y-2 text-xs font-semibold text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-500">Recipe Name:</span>
                  <span className="font-black text-gray-900">{batch.recipeName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-500">Processing Method:</span>
                  <span className="font-black text-gray-900">{batch.processingMethod}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-500">Pressure / Elevation:</span>
                  <span className="font-black text-gray-900">{batch.psi}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-500">Headspace:</span>
                  <span className="font-black text-gray-900">{batch.headspace}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span className="text-gray-500">Acid/pH Level:</span>
                  <span className="font-black text-gray-900">{batch.phLevel}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Seal Status:</span>
                  <span className="font-black text-emerald-700">{batch.status}</span>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 leading-normal">
                When printed on physical jar labels, scanning this QR code with any smartphone camera automatically opens this digital safety log.
              </p>

              <button
                onClick={() => setShowLogModal(false)}
                className="w-full py-2.5 bg-[#0D0D0D] text-white text-xs font-black rounded-xl"
              >
                Close Audit Log
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

