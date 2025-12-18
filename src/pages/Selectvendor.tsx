
import React, { useState } from 'react';
import { Search, Truck, X, CheckCircle } from 'lucide-react';

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
  status: "Outhouse";
  approvedAt: string;
  vendorType?: 'Regular' | 'Three Party';
  vendorRemarks?: string;
  vendorAssignedAt?: string;
}

const SelectVendor: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"pending" | "history">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndent, setSelectedIndent] = useState<VendorIndent | null>(null);
  const [vendorType, setVendorType] = useState<'Regular' | 'Three Party'>('Regular');
  const [vendorRemarks, setVendorRemarks] = useState("");

  const [indents, setIndents] = useState<VendorIndent[]>([
    // Pending (From Approval History - Outhouse)
    {
      id: 11,
      indentNumber: "IN-019",
      machineName: "IM-405",
      machineSerialNo: "IM-SN-2021-405",
      doerName: "Swati Joshi",
      department: "Production",
      machinePart: "Heater Band",
      problem: "Temperature fluctuations during injection molding process",
      priority: "Medium",
      expectedDays: 4,
      location: "Injection Molding - Line 2",
      status: "Outhouse",
      approvedAt: "22/01/2024 09:30:00"
    },
    // History (Already assigned)
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
      status: "Outhouse",
      approvedAt: "21/01/2024 15:00:00",
      vendorType: "Three Party",
      vendorRemarks: "Specialized repair required",
      vendorAssignedAt: "22/01/2024 10:00:00"
    },
    {
      id: 13,
      indentNumber: "IN-016",
      machineName: "DRILL-810",
      machineSerialNo: "DRILL-SN-2021-810",
      doerName: "Deepak Sharma",
      department: "Production",
      machinePart: "Depth Stop",
      problem: "Inconsistent drilling depth across multiple operations",
      priority: "Low",
      expectedDays: 6,
      location: "Drilling Area - Station 1",
      status: "Outhouse",
      approvedAt: "20/01/2024 14:15:00",
      vendorType: "Regular",
      vendorRemarks: "Routine maintenance assigned",
      vendorAssignedAt: "21/01/2024 09:30:00"
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
      status: "Outhouse",
      approvedAt: "20/01/2024 10:00:00",
      vendorType: "Three Party",
      vendorRemarks: "External expert consultation needed",
      vendorAssignedAt: "20/01/2024 14:00:00"
    },
    {
      id: 15,
      indentNumber: "IN-013",
      machineName: "LAT-507",
      machineSerialNo: "LAT-SN-2020-507",
      doerName: "Neha Choudhary",
      department: "Production",
      machinePart: "Tail Stock",
      problem: "Misalignment during long shaft turning operations",
      priority: "Medium",
      expectedDays: 4,
      location: "Lathe Section",
      status: "Outhouse",
      approvedAt: "19/01/2024 13:00:00",
      vendorType: "Regular",
      vendorRemarks: "Standard repair procedure",
      vendorAssignedAt: "19/01/2024 16:00:00"
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
      status: "Outhouse",
      approvedAt: "19/01/2024 09:15:00",
      vendorType: "Three Party",
      vendorRemarks: "High precision calibration required",
      vendorAssignedAt: "19/01/2024 11:00:00"
    },
    {
      id: 17,
      indentNumber: "IN-011",
      machineName: "HP-102",
      machineSerialNo: "HP-SN-2021-102",
      doerName: "Kavita Nair",
      department: "Manufacturing",
      machinePart: "Control Panel",
      problem: "Touch screen responsiveness issues affecting operation",
      priority: "Low",
      expectedDays: 5,
      location: "Shop Floor A - Bay 3",
      status: "Outhouse",
      approvedAt: "18/01/2024 16:00:00",
      vendorType: "Regular",
      vendorRemarks: "Panel replacement ordered",
      vendorAssignedAt: "19/01/2024 09:00:00"
    },
    {
      id: 18,
      indentNumber: "IN-010",
      machineName: "IM-405",
      machineSerialNo: "IM-SN-2021-405",
      doerName: "Arun Mishra",
      department: "Production",
      machinePart: "Injection Nozzle",
      problem: "Material leakage from nozzle tip during operation",
      priority: "Medium",
      expectedDays: 3,
      location: "Injection Molding - Line 2",
      status: "Outhouse",
      approvedAt: "18/01/2024 12:30:00",
      vendorType: "Regular",
      vendorRemarks: "Nozzle cleaning and reseating",
      vendorAssignedAt: "18/01/2024 14:00:00"
    },
    {
      id: 19,
      indentNumber: "IN-007",
      machineName: "DRILL-810",
      machineSerialNo: "DRILL-SN-2021-810",
      doerName: "Sneha Desai",
      department: "Production",
      machinePart: "Drill Chuck",
      problem: "Chuck not holding drill bits properly causing misalignment",
      priority: "Medium",
      expectedDays: 3,
      location: "Drilling Area - Station 1",
      status: "Outhouse",
      approvedAt: "17/01/2024 11:45:00",
      vendorType: "Regular",
      vendorRemarks: "Chuck replacement",
      vendorAssignedAt: "17/01/2024 15:00:00"
    },
    {
      id: 20,
      indentNumber: "IN-005",
      machineName: "MILL-608",
      machineSerialNo: "MILL-SN-2023-608",
      doerName: "Vikram Singh",
      department: "Quality Control",
      machinePart: "Coolant System",
      problem: "Coolant leakage near pump connection",
      priority: "Low",
      expectedDays: 7,
      location: "Milling Area - Station 3",
      status: "Outhouse",
      approvedAt: "16/01/2024 14:00:00",
      vendorType: "Regular",
      vendorRemarks: "Seal replacement",
      vendorAssignedAt: "16/01/2024 16:00:00"
    }
  ]);

  const pendingIndents = indents.filter(indent => !indent.vendorType);
  const historyIndents = indents.filter(indent => indent.vendorType);

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
    setVendorType('Regular');
    setVendorRemarks('');
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!selectedIndent) return;

    const updatedIndents = indents.map(indent => 
      indent.id === selectedIndent.id 
        ? { 
            ...indent, 
            vendorType, 
            vendorRemarks,
            vendorAssignedAt: new Date().toLocaleString('en-GB')
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
          <h1 className="text-2xl font-bold text-gray-900">Select Vendor</h1>
          <p className="text-gray-600">Assign vendors to outhouse maintenance tasks</p>
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
                             <Truck size={12} />
                             Select Vendor
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
                         <td colSpan={11} className="px-3 py-8 text-center text-gray-500 text-xs">No pending indents found</td>
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
                         <Truck size={14} />
                         Select Vendor
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
                         <span className="text-gray-500 block">Approved</span>
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
                   <div className="text-center py-8 text-gray-500 text-xs">No pending indents found</div>
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
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Doer Name</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Department</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Machine Part</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Problem</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Priority</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Expected Days</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Location</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Vendor Type</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Vendor Remarks</th>
                     </tr>
                   </thead>
                   <tbody className="bg-white divide-y divide-gray-200">
                     {filteredHistory.map(indent => (
                       <tr key={indent.id} className="hover:bg-gray-50">
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
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 font-medium">{indent.vendorType}</td>
                         <td className="px-3 py-2 text-xs text-gray-600 max-w-xs truncate">{indent.vendorRemarks}</td>
                       </tr>
                     ))}
                     {filteredHistory.length === 0 && (
                       <tr>
                         <td colSpan={10} className="px-3 py-8 text-center text-gray-500 text-xs">No history found</td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>

               {/* Mobile Card View */}
               <div className="md:hidden space-y-4">
                 {filteredHistory.map(indent => (
                   <div key={indent.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 space-y-3">
                     <div className="flex justify-between items-start">
                       <div>
                         <span className="text-sm font-bold text-sky-600 block">{indent.indentNumber}</span>
                         <span className="text-xs text-gray-500">{indent.machineName}</span>
                       </div>
                       <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                         {indent.vendorType}
                       </span>
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
                         <span className="text-gray-500 block">Assigned</span>
                         <span className="font-medium text-gray-900">{indent.vendorAssignedAt}</span>
                       </div>
                     </div>
                     
                     <div>
                       <span className="text-gray-500 block text-xs">Remarks</span>
                       <p className="text-xs text-gray-700 mt-1">{indent.vendorRemarks}</p>
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
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Select Vendor</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Read Only Info */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-md text-xs">
                <div>
                  <label className="text-gray-500">Indent No</label>
                  <div className="font-medium">{selectedIndent.indentNumber}</div>
                </div>
                <div>
                  <label className="text-gray-500">Machine</label>
                  <div className="font-medium">{selectedIndent.machineName}</div>
                </div>
                <div>
                  <label className="text-gray-500">Part</label>
                  <div className="font-medium">{selectedIndent.machinePart}</div>
                </div>
                <div>
                  <label className="text-gray-500">Priority</label>
                  <div className="font-medium">{selectedIndent.priority}</div>
                </div>
              </div>

              {/* Form Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor Type *</label>
                <select
                  value={vendorType}
                  onChange={(e) => setVendorType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="Regular">Regular</option>
                  <option value="Three Party">Three Party</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  value={vendorRemarks}
                  onChange={(e) => setVendorRemarks(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                  placeholder="Enter remarks..."
                />
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
                onClick={handleSubmit}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
              >
                Assign Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectVendor;
