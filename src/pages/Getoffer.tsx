import React, { useState } from 'react';
import { Search, FileText, X } from 'lucide-react';

interface VendorOffer {
  vendorName: string;
  rate: number;
  paymentTerm: string;
}

interface VendorIndent {
  id: number;
  indentNumber: string;
  machineName: string;
  machineSerialNo: string;
  doerName: string;
  department: string;
  machinePart: string;
  problem: string;
  priority: "High" | "Medium" | "Low";
  expectedDays: number;
  location: string;
  approvedAt: string;
  vendorType?: 'Regular' | 'Three Party';
  offersSaved?: boolean;
  
  // Offer Details
  vendor1?: VendorOffer;
  vendor2?: VendorOffer;
  vendor3?: VendorOffer;
}

const GetOffer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"pending" | "history">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndent, setSelectedIndent] = useState<VendorIndent | null>(null);

  // Form State
  const [vendor1, setVendor1] = useState<VendorOffer>({ vendorName: '', rate: 0, paymentTerm: '' });
  const [vendor2, setVendor2] = useState<VendorOffer>({ vendorName: '', rate: 0, paymentTerm: '' });
  const [vendor3, setVendor3] = useState<VendorOffer>({ vendorName: '', rate: 0, paymentTerm: '' });

  const [indents, setIndents] = useState<VendorIndent[]>([
    // Mock Data - Simulating "Three Party" items from SelectVendor
    {
      id: 12,
      indentNumber: "IN-018",
      machineName: "IO-103",
      machineSerialNo: "IO-SN-2019-103",
      doerName: "Alok Pandey",
      department: "Quality Control",
      machinePart: "Encoder",
      problem: "Position feedback errors during automated operations",
      priority: "High",
      expectedDays: 2,
      location: "Inspection Area",
      approvedAt: "21/01/2024 15:00:00",
      vendorType: "Three Party",
      offersSaved: false
    },
    {
      id: 14,
      indentNumber: "IN-015",
      machineName: "GRIND-709",
      machineSerialNo: "GRIND-SN-2022-709",
      doerName: "Anjali Kapoor",
      department: "Manufacturing",
      machinePart: "Coolant Nozzle",
      problem: "Clogged coolant flow affecting surface finish quality",
      priority: "Medium",
      expectedDays: 2,
      location: "Grinding Section - Bay 2",
      approvedAt: "20/01/2024 10:00:00",
      vendorType: "Three Party",
      offersSaved: false
    },
    {
      id: 16,
      indentNumber: "IN-012",
      machineName: "CNC-305",
      machineSerialNo: "CNC-SN-2022-305",
      doerName: "Sanjay Gupta",
      department: "Manufacturing",
      machinePart: "Ball Screw",
      problem: "Backlash in X-axis movement affecting precision",
      priority: "High",
      expectedDays: 2,
      location: "CNC Section - Bay 5",
      approvedAt: "19/01/2024 09:15:00",
      vendorType: "Three Party",
      offersSaved: true,
      vendor1: { vendorName: "Alpha Tech", rate: 5000, paymentTerm: "Net 30" },
      vendor2: { vendorName: "Beta Solutions", rate: 5500, paymentTerm: "Net 45" },
      vendor3: { vendorName: "Gamma Services", rate: 4800, paymentTerm: "Immediate" }
    }
  ]);

  const pendingIndents = indents.filter(indent => indent.vendorType === 'Three Party' && !indent.offersSaved);
  const historyIndents = indents.filter(indent => indent.vendorType === 'Three Party' && indent.offersSaved);

  const filteredPending = pendingIndents.filter(indent => 
    indent.indentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    indent.machineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistory = historyIndents.filter(indent => 
    indent.indentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    indent.machineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleActionClick = (indent: VendorIndent) => {
    setSelectedIndent(indent);
    setVendor1(indent.vendor1 || { vendorName: '', rate: 0, paymentTerm: '' });
    setVendor2(indent.vendor2 || { vendorName: '', rate: 0, paymentTerm: '' });
    setVendor3(indent.vendor3 || { vendorName: '', rate: 0, paymentTerm: '' });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!selectedIndent) return;

    const updatedIndents = indents.map(indent => 
      indent.id === selectedIndent.id 
        ? { 
            ...indent, 
            offersSaved: true,
            vendor1,
            vendor2,
            vendor3
          } 
        : indent
    );

    setIndents(updatedIndents);
    setIsModalOpen(false);
    setSelectedIndent(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Get Offer</h1>
          <p className="text-gray-600">Manage vendor offers for Three Party indents</p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search indents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent w-full"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col flex-1 min-h-0 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveSection("pending")}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeSection === "pending"
                ? "text-sky-600 border-b-2 border-sky-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Pending ({pendingIndents.length})
          </button>
          <button
            onClick={() => setActiveSection("history")}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeSection === "history"
                ? "text-sky-600 border-b-2 border-sky-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            History ({historyIndents.length})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {activeSection === "pending" ? (
             <div className="min-w-full inline-block align-middle">
               <div className="hidden md:block border rounded-lg overflow-hidden">
                 <table className="min-w-full divide-y divide-gray-200">
                   <thead className="bg-gray-50">
                     <tr>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Action</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Indent Number</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Machine Name</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Machine Serial No</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Doer Name</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Department</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Machine Part</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Problem</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Priority</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Expected Days</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Location</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Approved At</th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {filteredPending.map(indent => (
                       <tr key={indent.id} className="hover:bg-gray-50">
                         <td className="px-3 py-2 whitespace-nowrap">
                           <button
                             onClick={() => handleActionClick(indent)}
                             className="flex items-center gap-1 px-2 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors text-xs"
                           >
                             <FileText size={12} />
                             Get Offer
                           </button>
                         </td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">{indent.indentNumber}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.machineName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{indent.machineSerialNo}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{indent.doerName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{indent.department}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{indent.machinePart}</td>
                         <td className="px-3 py-2 text-xs text-gray-600 max-w-xs truncate">{indent.problem}</td>
                         <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(indent.priority)}`}>
                              {indent.priority}
                            </span>
                         </td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{indent.expectedDays} days</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{indent.location}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{indent.approvedAt}</td>
                       </tr>
                     ))}
                     {filteredPending.length === 0 && (
                       <tr>
                         <td colSpan={12} className="px-3 py-8 text-center text-gray-500 text-xs">No pending tasks found</td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>

               {/* Mobile Card View */}
               <div className="md:hidden space-y-4">
                 {filteredPending.map(indent => (
                   <div key={indent.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-3">
                     <div className="flex justify-between items-start">
                       <div>
                         <span className="text-sm font-bold text-sky-600 block">{indent.indentNumber}</span>
                         <span className="text-xs text-gray-500">{indent.machineName}</span>
                       </div>
                       <button
                         onClick={() => handleActionClick(indent)}
                         className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors text-xs font-medium"
                       >
                         <FileText size={14} />
                         Get Offer
                       </button>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-2 text-xs">
                       <div>
                         <span className="text-gray-500 block">Department</span>
                         <span className="font-medium text-gray-900">{indent.department}</span>
                       </div>
                       <div>
                         <span className="text-gray-500 block">Priority</span>
                         <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(indent.priority)}`}>
                           {indent.priority}
                         </span>
                       </div>
                       <div>
                         <span className="text-gray-500 block">Part</span>
                         <span className="font-medium text-gray-900">{indent.machinePart}</span>
                       </div>
                       <div>
                         <span className="text-gray-500 block">Approved At</span>
                         <span className="font-medium text-gray-900">{indent.approvedAt}</span>
                       </div>
                     </div>
                     
                     <div>
                       <span className="text-gray-500 block text-xs">Problem</span>
                       <p className="text-xs text-gray-700 mt-1">{indent.problem}</p>
                     </div>
                   </div>
                 ))}
                 {filteredPending.length === 0 && (
                   <div className="text-center py-8 text-gray-500 text-xs">No pending tasks found</div>
                 )}
               </div>
             </div>
          ) : (
            <div className="min-w-full inline-block align-middle">
              <div className="hidden md:block border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                   <thead className="bg-gray-50">
                     <tr>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Indent Number</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Machine Name</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Machine Serial No</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Department</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Machine Part</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Problem</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Priority</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Expected Days</th>
                       
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-sky-50">Vendor 1 Name</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-sky-50">Rate 1</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-sky-50">Payment Term 1</th>
                       
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-green-50">Vendor 2 Name</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-green-50">Rate 2</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-green-50">Payment Term 2</th>
                       
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-purple-50">Vendor 3 Name</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-purple-50">Rate 3</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-purple-50">Payment Term 3</th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {filteredHistory.map(indent => (
                       <tr key={indent.id} className="hover:bg-gray-50">
                         <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">{indent.indentNumber}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.machineName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{indent.machineSerialNo}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{indent.department}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{indent.machinePart}</td>
                         <td className="px-3 py-2 text-xs text-gray-600 max-w-xs truncate">{indent.problem}</td>
                         <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(indent.priority)}`}>
                              {indent.priority}
                            </span>
                         </td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{indent.expectedDays} days</td>
                         
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-sky-50/50">{indent.vendor1?.vendorName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-sky-50/50">{indent.vendor1?.rate}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-sky-50/50">{indent.vendor1?.paymentTerm}</td>
                         
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-green-50/50">{indent.vendor2?.vendorName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-green-50/50">{indent.vendor2?.rate}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-green-50/50">{indent.vendor2?.paymentTerm}</td>
                         
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-purple-50/50">{indent.vendor3?.vendorName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-purple-50/50">{indent.vendor3?.rate}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-purple-50/50">{indent.vendor3?.paymentTerm}</td>
                       </tr>
                     ))}
                     {filteredHistory.length === 0 && (
                       <tr>
                         <td colSpan={17} className="px-3 py-8 text-center text-gray-500 text-xs">No history found</td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>

               {/* Mobile Card View History */}
               <div className="md:hidden space-y-4">
                 {filteredHistory.map(indent => (
                   <div key={indent.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-3">
                     <div className="flex justify-between items-start">
                       <div>
                         <span className="text-sm font-bold text-gray-900 block">{indent.indentNumber}</span>
                         <span className="text-xs text-gray-500">{indent.machineName}</span>
                       </div>
                       <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(indent.priority)}`}>
                         {indent.priority}
                       </span>
                     </div>
                     
                     <div className="space-y-2">
                        {/* Brief Info */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                           <div>
                             <span className="text-gray-500 block">Department</span>
                             <span className="font-medium">{indent.department}</span>
                           </div>
                            <div>
                             <span className="text-gray-500 block">Part</span>
                             <span className="font-medium">{indent.machinePart}</span>
                           </div>
                        </div>

                        {/* Vendors Compact List */}
                        <div className="text-xs border-t pt-2 space-y-2">
                           <div className="grid grid-cols-3 gap-1 font-medium text-gray-500 text-[10px] uppercase">
                              <div>Vendor</div>
                              <div className="text-right">Rate</div>
                              <div className="text-right">Term</div>
                           </div>
                           <div className="grid grid-cols-3 gap-1 items-center bg-sky-50/50 p-1.5 rounded">
                              <div className="truncate font-medium text-sky-900">{indent.vendor1?.vendorName}</div>
                              <div className="text-right">{indent.vendor1?.rate}</div>
                              <div className="text-right">{indent.vendor1?.paymentTerm}</div>
                           </div>
                           <div className="grid grid-cols-3 gap-1 items-center bg-green-50/50 p-1.5 rounded">
                              <div className="truncate font-medium text-green-900">{indent.vendor2?.vendorName}</div>
                              <div className="text-right">{indent.vendor2?.rate}</div>
                              <div className="text-right">{indent.vendor2?.paymentTerm}</div>
                           </div>
                           <div className="grid grid-cols-3 gap-1 items-center bg-purple-50/50 p-1.5 rounded">
                              <div className="truncate font-medium text-purple-900">{indent.vendor3?.vendorName}</div>
                              <div className="text-right">{indent.vendor3?.rate}</div>
                              <div className="text-right">{indent.vendor3?.paymentTerm}</div>
                           </div>
                        </div>
                     </div>
                   </div>
                 ))}
                 {filteredHistory.length === 0 && (
                   <div className="text-center py-8 text-gray-500 text-xs">No history found</div>
                 )}
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedIndent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Get Offer</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Read Only Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">Indent Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="text-gray-500 block">Indent No</label>
                    <div className="font-medium text-gray-900">{selectedIndent.indentNumber}</div>
                  </div>
                  <div>
                    <label className="text-gray-500 block">Machine</label>
                    <div className="font-medium text-gray-900">{selectedIndent.machineName}</div>
                  </div>
                  <div>
                    <label className="text-gray-500 block">Serial No</label>
                    <div className="font-medium text-gray-900">{selectedIndent.machineSerialNo}</div>
                  </div>
                  <div>
                    <label className="text-gray-500 block">Department</label>
                    <div className="font-medium text-gray-900">{selectedIndent.department}</div>
                  </div>
                  <div>
                    <label className="text-gray-500 block">Part</label>
                    <div className="font-medium text-gray-900">{selectedIndent.machinePart}</div>
                  </div>
                  <div>
                    <label className="text-gray-500 block">Priority</label>
                    <div className="font-medium text-gray-900">{selectedIndent.priority}</div>
                  </div>
                  <div>
                    <label className="text-gray-500 block">Expected Days</label>
                    <div className="font-medium text-gray-900">{selectedIndent.expectedDays}</div>
                  </div>
                  <div className="col-span-2 md:col-span-4">
                    <label className="text-gray-500 block">Problem</label>
                    <div className="font-medium text-gray-900">{selectedIndent.problem}</div>
                  </div>
                </div>
              </div>

              {/* Vendor Forms */}
              <div className="grid md:grid-cols-3 gap-6">
                 {/* Vendor 1 */}
                 <div className="space-y-4 border p-4 rounded-lg bg-sky-50/30 border-sky-100">
                    <h4 className="font-medium text-sky-900 border-b border-sky-200 pb-2">Vendor 1</h4>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Vendor Name</label>
                      <input
                        type="text"
                        value={vendor1.vendorName}
                        onChange={(e) => setVendor1({...vendor1, vendorName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="Enter name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Rate</label>
                      <input
                        type="number"
                        value={vendor1.rate || ''}
                        onChange={(e) => setVendor1({...vendor1, rate: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="Enter rate"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Payment Term</label>
                      <input
                        type="text"
                        value={vendor1.paymentTerm}
                        onChange={(e) => setVendor1({...vendor1, paymentTerm: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
                        placeholder="e.g. Net 30"
                      />
                    </div>
                 </div>

                 {/* Vendor 2 */}
                 <div className="space-y-4 border p-4 rounded-lg bg-green-50/30 border-green-100">
                    <h4 className="font-medium text-green-900 border-b border-green-200 pb-2">Vendor 2</h4>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Vendor Name</label>
                      <input
                        type="text"
                        value={vendor2.vendorName}
                        onChange={(e) => setVendor2({...vendor2, vendorName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Rate</label>
                      <input
                        type="number"
                        value={vendor2.rate || ''}
                        onChange={(e) => setVendor2({...vendor2, rate: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        placeholder="Enter rate"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Payment Term</label>
                      <input
                        type="text"
                        value={vendor2.paymentTerm}
                        onChange={(e) => setVendor2({...vendor2, paymentTerm: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-green-500 focus:border-green-500"
                        placeholder="e.g. Net 45"
                      />
                    </div>
                 </div>

                 {/* Vendor 3 */}
                 <div className="space-y-4 border p-4 rounded-lg bg-purple-50/30 border-purple-100">
                    <h4 className="font-medium text-purple-900 border-b border-purple-200 pb-2">Vendor 3</h4>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Vendor Name</label>
                      <input
                        type="text"
                        value={vendor3.vendorName}
                        onChange={(e) => setVendor3({...vendor3, vendorName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Enter name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Rate</label>
                      <input
                        type="number"
                        value={vendor3.rate || ''}
                        onChange={(e) => setVendor3({...vendor3, rate: Number(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Enter rate"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Payment Term</label>
                      <input
                        type="text"
                        value={vendor3.paymentTerm}
                        onChange={(e) => setVendor3({...vendor3, paymentTerm: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g. Advance"
                      />
                    </div>
                 </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 shadow-sm"
              >
                Save Offers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetOffer;