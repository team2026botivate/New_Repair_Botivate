import React, { useState } from 'react';
import { Search, CheckCircle, X, DollarSign } from 'lucide-react';

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
  department: string;
  machinePart: string;
  problem: string;
  priority: "High" | "Medium" | "Low";
  expectedDays: number;
  vendorType: 'Three Party' | 'Regular';
  
  // From Get Offer
  vendor1: VendorOffer;
  vendor2: VendorOffer;
  vendor3: VendorOffer;
  
  // Approval State
  approvedVendor?: 1 | 2 | 3; // If set, this indent is approved
  approvedAt?: string;
}

const Approverate: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"pending" | "history">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndent, setSelectedIndent] = useState<VendorIndent | null>(null);
  const [selectedVendorOption, setSelectedVendorOption] = useState<1 | 2 | 3 | null>(null);

  const [indents, setIndents] = useState<VendorIndent[]>([
    {
      id: 16,
      indentNumber: "IN-012",
      machineName: "CNC-305",
      machineSerialNo: "CNC-SN-2022-305",
      department: "Manufacturing",
      machinePart: "Ball Screw",
      problem: "Backlash in X-axis movement affecting precision",
      priority: "High",
      expectedDays: 2,
      vendorType: 'Three Party',
      // Mock offers from Get Offer stage
      vendor1: { vendorName: "Alpha Tech", rate: 5000, paymentTerm: "Net 30" },
      vendor2: { vendorName: "Beta Solutions", rate: 5500, paymentTerm: "Net 45" },
      vendor3: { vendorName: "Gamma Services", rate: 4800, paymentTerm: "Immediate" }
    },
    {
      id: 12,
      indentNumber: "IN-018",
      machineName: "IO-103",
      machineSerialNo: "IO-SN-2019-103",
      department: "Quality Control",
      machinePart: "Encoder",
      problem: "Position feedback errors",
      priority: "High",
      expectedDays: 2,
      vendorType: 'Three Party',
      vendor1: { vendorName: "Sensor Fix", rate: 2500, paymentTerm: "Net 15" },
      vendor2: { vendorName: "Precision El", rate: 2800, paymentTerm: "Net 30" },
      vendor3: { vendorName: "Fast Rep", rate: 3000, paymentTerm: "Immediate" },
      // Already approved
      approvedVendor: 2,
      approvedAt: "2024-03-10 14:30:00"
    }
  ]);

  const pendingIndents = indents.filter(indent => indent.vendorType === 'Three Party' && !indent.approvedVendor);
  const historyIndents = indents.filter(indent => indent.vendorType === 'Three Party' && indent.approvedVendor);

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
    setSelectedVendorOption(null);
    setIsModalOpen(true);
  };

  const handleApprove = () => {
    if (!selectedIndent || !selectedVendorOption) return;

    const updatedIndents = indents.map(indent => 
      indent.id === selectedIndent.id 
        ? { 
            ...indent, 
            approvedVendor: selectedVendorOption,
            approvedAt: new Date().toLocaleString('en-GB')
          } 
        : indent
    );

    setIndents(updatedIndents);
    setIsModalOpen(false);
    setSelectedIndent(null);
    setSelectedVendorOption(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getApprovedVendorDetails = (indent: VendorIndent) => {
    if (indent.approvedVendor === 1) return indent.vendor1;
    if (indent.approvedVendor === 2) return indent.vendor2;
    if (indent.approvedVendor === 3) return indent.vendor3;
    return null;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rate Approval</h1>
          <p className="text-gray-600">Approve vendor rates for Three Party services</p>
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
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sticky left-0 bg-gray-50 z-10 shadow-sm">Action</th>
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
                     {filteredPending.map(indent => (
                       <tr key={indent.id} className="hover:bg-gray-50">
                         <td className="px-3 py-2 whitespace-nowrap sticky left-0 bg-white shadow-sm z-10">
                           <button
                             onClick={() => handleActionClick(indent)}
                             className="flex items-center gap-1 px-2 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors text-xs"
                           >
                             <CheckCircle size={12} />
                             Approve
                           </button>
                         </td>
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
                         
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-sky-50/30">{indent.vendor1.vendorName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-sky-50/30">{indent.vendor1.rate}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-sky-50/30">{indent.vendor1.paymentTerm}</td>
                         
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-green-50/30">{indent.vendor2.vendorName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-green-50/30">{indent.vendor2.rate}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-green-50/30">{indent.vendor2.paymentTerm}</td>
                         
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-purple-50/30">{indent.vendor3.vendorName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-purple-50/30">{indent.vendor3.rate}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-purple-50/30">{indent.vendor3.paymentTerm}</td>
                       </tr>
                     ))}
                     {filteredPending.length === 0 && (
                       <tr>
                         <td colSpan={18} className="px-3 py-8 text-center text-gray-500 text-xs">No pending approvals found</td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>

               {/* Mobile Card View Pending */}
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
                         <CheckCircle size={14} />
                         Approve
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
                     </div>
                     
                     <div>
                       <span className="text-gray-500 block text-xs">Problem</span>
                       <p className="text-xs text-gray-700 mt-1">{indent.problem}</p>
                     </div>

                     <div className="text-xs text-gray-500 italic border-t pt-2">
                        Includes offers from: <span className="text-gray-900">{indent.vendor1.vendorName}, {indent.vendor2.vendorName}, {indent.vendor3.vendorName}</span>
                     </div>
                   </div>
                 ))}
                 {filteredPending.length === 0 && (
                   <div className="text-center py-8 text-gray-500 text-xs">No pending approvals found</div>
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
                       
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50">Approved Vendor</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50">Rate</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap bg-gray-50">Payment Term</th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {filteredHistory.map(indent => {
                       const vendor = getApprovedVendorDetails(indent);
                       return (
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
                           
                           <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-sky-700 bg-gray-50/50">{vendor?.vendorName}</td>
                           <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-gray-50/50">{vendor?.rate}</td>
                           <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 bg-gray-50/50">{vendor?.paymentTerm}</td>
                         </tr>
                       );
                     })}
                     {filteredHistory.length === 0 && (
                       <tr>
                         <td colSpan={11} className="px-3 py-8 text-center text-gray-500 text-xs">No history found</td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>

               {/* Mobile Card View History */}
               <div className="md:hidden space-y-4">
                 {filteredHistory.map(indent => {
                   const vendor = getApprovedVendorDetails(indent);
                   return (
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
                       
                       <div className="mt-2 text-xs text-gray-700 bg-gray-50 p-2 rounded">
                          <span className="block font-medium text-gray-500 mb-1">Approved Vendor</span>
                          <div className="flex justify-between">
                             <span className="font-bold text-sky-700">{vendor?.vendorName}</span>
                             <span className="font-medium">{vendor?.rate}</span>
                          </div>
                          <div className="text-right text-gray-400 mt-1">{vendor?.paymentTerm}</div>
                       </div>
                     </div>
                   );
                 })}
                 {filteredHistory.length === 0 && (
                   <div className="text-center py-8 text-gray-500 text-xs">No history found</div>
                 )}
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      {isModalOpen && selectedIndent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Approve Vendor</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Indent Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                   <div>
                      <h4 className="text-sm font-bold text-gray-900">{selectedIndent.indentNumber} - {selectedIndent.machineName}</h4>
                      <p className="text-xs text-gray-500">{selectedIndent.problem}</p>
                   </div>
                   <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(selectedIndent.priority)}`}>
                      {selectedIndent.priority}
                   </span>
                </div>
              </div>

              {/* Vendor Selection */}
              <div>
                 <h4 className="text-sm font-medium text-gray-700 mb-3">Select a Vendor to Approve</h4>
                 <div className="space-y-3">
                    {/* Vendor 1 */}
                    <div 
                      className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                         selectedVendorOption === 1 ? 'border-sky-600 ring-1 ring-sky-600 bg-sky-50' : 'border-gray-200 hover:border-sky-300'
                      }`}
                      onClick={() => setSelectedVendorOption(1)}
                    >
                       <div className="flex justify-between items-center">
                          <div>
                             <p className="font-semibold text-gray-900">{selectedIndent.vendor1.vendorName}</p>
                             <p className="text-xs text-gray-500">Payment Term: {selectedIndent.vendor1.paymentTerm}</p>
                          </div>
                          <div className="text-right">
                             <div className="flex items-center font-bold text-gray-900">
                                <DollarSign size={14} className="text-gray-500 mr-1" />
                                {selectedIndent.vendor1.rate}
                             </div>
                             <p className="text-xs text-gray-500">Vendor 1</p>
                          </div>
                       </div>
                       {selectedVendorOption === 1 && (
                          <div className="absolute top-2 right-2 text-sky-600">
                             <CheckCircle size={16} fill="currentColor" className="text-white" />
                          </div>
                       )}
                    </div>

                    {/* Vendor 2 */}
                    <div 
                      className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                         selectedVendorOption === 2 ? 'border-sky-600 ring-1 ring-sky-600 bg-sky-50' : 'border-gray-200 hover:border-sky-300'
                      }`}
                      onClick={() => setSelectedVendorOption(2)}
                    >
                       <div className="flex justify-between items-center">
                          <div>
                             <p className="font-semibold text-gray-900">{selectedIndent.vendor2.vendorName}</p>
                             <p className="text-xs text-gray-500">Payment Term: {selectedIndent.vendor2.paymentTerm}</p>
                          </div>
                          <div className="text-right">
                             <div className="flex items-center font-bold text-gray-900">
                                <DollarSign size={14} className="text-gray-500 mr-1" />
                                {selectedIndent.vendor2.rate}
                             </div>
                             <p className="text-xs text-gray-500">Vendor 2</p>
                          </div>
                       </div>
                       {selectedVendorOption === 2 && (
                          <div className="absolute top-2 right-2 text-sky-600">
                             <CheckCircle size={16} fill="currentColor" className="text-white" />
                          </div>
                       )}
                    </div>

                    {/* Vendor 3 */}
                    <div 
                      className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                         selectedVendorOption === 3 ? 'border-sky-600 ring-1 ring-sky-600 bg-sky-50' : 'border-gray-200 hover:border-sky-300'
                      }`}
                      onClick={() => setSelectedVendorOption(3)}
                    >
                       <div className="flex justify-between items-center">
                          <div>
                             <p className="font-semibold text-gray-900">{selectedIndent.vendor3.vendorName}</p>
                             <p className="text-xs text-gray-500">Payment Term: {selectedIndent.vendor3.paymentTerm}</p>
                          </div>
                          <div className="text-right">
                             <div className="flex items-center font-bold text-gray-900">
                                <DollarSign size={14} className="text-gray-500 mr-1" />
                                {selectedIndent.vendor3.rate}
                             </div>
                             <p className="text-xs text-gray-500">Vendor 3</p>
                          </div>
                       </div>
                       {selectedVendorOption === 3 && (
                          <div className="absolute top-2 right-2 text-sky-600">
                             <CheckCircle size={16} fill="currentColor" className="text-white" />
                          </div>
                       )}
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
                onClick={handleApprove}
                disabled={!selectedVendorOption}
                className={`px-4 py-2 text-white rounded-lg shadow-sm ${
                   selectedVendorOption ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Approve Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approverate;