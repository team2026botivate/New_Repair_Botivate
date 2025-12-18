import React, { useState } from 'react';
import { Search, Truck, X, Upload } from 'lucide-react';

interface TransportDetails {
  transporterName: string;
  transportationCharges: string;
  weighmentSlip: string;
  transportImage: File | null;
  paymentType: string;
  paymentAmount: string;
}

interface MachineIndent {
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
  vendorName: string; // From SelectVendor (Regular) or Approverate (Three Party)
  source: 'Regular' | 'Three Party Resolved';
  status: 'Pending' | 'Sent';
  
  // Details added in this page
  transportDetails?: TransportDetails;
  sentAt?: string;
}

const SentMachine: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"pending" | "history">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndent, setSelectedIndent] = useState<MachineIndent | null>(null);

  // Form State
  const [formData, setFormData] = useState<TransportDetails>({
    transporterName: '',
    transportationCharges: '',
    weighmentSlip: '',
    transportImage: null,
    paymentType: '',
    paymentAmount: ''
  });

  const [indents, setIndents] = useState<MachineIndent[]>([
    // Mock Data 2: Three Party Vendor (From Rate Approved) - ONE PENDING ITEM
    {
      id: 102,
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
      vendorName: "Precision El", // Approved vendor
      source: 'Three Party Resolved',
      status: 'Pending'
    },
    
    // Mock Data 1: Regular Vendor (MOVED TO HISTORY)
    {
      id: 101,
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
      vendorName: "Standard Repairs Co.", 
      source: 'Regular',
      status: 'Sent',
      sentAt: "2024-03-05 09:30:00",
      transportDetails: {
        transporterName: "SafeMove Logistics",
        transportationCharges: "2000",
        weighmentSlip: "WS-5544",
        transportImage: null,
        paymentType: "Net Banking",
        paymentAmount: "2000"
      }
    },
    // Additional Regular Vendor Data (MOVED TO HISTORY)
    {
      id: 104,
      indentNumber: "IN-007",
      machineName: "DRILL-810",
      machineSerialNo: "DRILL-SN-2021-810",
      doerName: "Sneha Desai",
      department: "Production",
      machinePart: "Drill Chuck",
      problem: "Chuck not holding drill bits properly",
      priority: "Medium",
      expectedDays: 3,
      location: "Drilling Area - Station 1",
      vendorName: "Drill Masters Inc.",
      source: 'Regular',
      status: 'Sent',
      sentAt: "2024-03-04 14:15:00",
      transportDetails: {
        transporterName: "Local Transport",
        transportationCharges: "500",
        weighmentSlip: "WS-1122",
        transportImage: null,
        paymentType: "Cash",
        paymentAmount: "500"
      }
    },
    {
      id: 105,
      indentNumber: "IN-010",
      machineName: "IM-405",
      machineSerialNo: "IM-SN-2021-405",
      doerName: "Arun Mishra",
      department: "Production",
      machinePart: "Injection Nozzle",
      problem: "Material leakage from nozzle tip",
      priority: "Medium",
      expectedDays: 3,
      location: "Injection Molding - Line 2",
      vendorName: "Molding Experts Ltd.",
      source: 'Regular',
      status: 'Sent',
      sentAt: "2024-03-04 10:00:00",
      transportDetails: {
        transporterName: "Heavy Haulage",
        transportationCharges: "3500",
        weighmentSlip: "WS-8899",
        transportImage: null,
        paymentType: "Cheque",
        paymentAmount: "3500"
      }
    },
    {
      id: 106,
      indentNumber: "IN-011",
      machineName: "HP-102",
      machineSerialNo: "HP-SN-2021-102",
      doerName: "Kavita Nair",
      department: "Manufacturing",
      machinePart: "Control Panel",
      problem: "Touch screen responsiveness issues",
      priority: "Low",
      expectedDays: 5,
      location: "Shop Floor A - Bay 3",
      vendorName: "Tech Panel Solutions",
      source: 'Regular',
      status: 'Sent',
      sentAt: "2024-03-03 16:45:00",
      transportDetails: {
        transporterName: "Express Couriers",
        transportationCharges: "800",
        weighmentSlip: "WS-6677",
        transportImage: null,
        paymentType: "UPI",
        paymentAmount: "800"
      }
    },
    {
      id: 107,
      indentNumber: "IN-016",
      machineName: "DRILL-810",
      machineSerialNo: "DRILL-SN-2021-810",
      doerName: "Deepak Sharma",
      department: "Production",
      machinePart: "Depth Stop",
      problem: "Inconsistent drilling depth",
      priority: "Low",
      expectedDays: 6,
      location: "Drilling Area - Station 1",
      vendorName: "Drill Masters Inc.",
      source: 'Regular',
      status: 'Sent',
      sentAt: "2024-03-02 11:20:00",
      transportDetails: {
        transporterName: "Local Transport",
        transportationCharges: "600",
        weighmentSlip: "WS-3344",
        transportImage: null,
        paymentType: "Cash",
        paymentAmount: "600"
      }
    },
    // Mock Data 3: History Item (ALREADY IN HISTORY)
    {
      id: 103,
      indentNumber: "IN-005",
      machineName: "MILL-608",
      machineSerialNo: "MILL-SN-2023-608",
      doerName: "Vikram Singh",
      department: "Quality Control",
      machinePart: "Coolant System",
      problem: "Coolant leakage",
      priority: "Low",
      expectedDays: 7,
      location: "Milling Area",
      vendorName: "Coolant Fixers Ltd",
      source: 'Regular',
      status: 'Sent',
      sentAt: "2024-03-01 10:00:00",
      transportDetails: {
        transporterName: "Fast Logistics",
        transportationCharges: "1500",
        weighmentSlip: "WS-9988",
        transportImage: null,
        paymentType: "Cash",
        paymentAmount: "1500"
      }
    }
  ]);

  const pendingIndents = indents.filter(indent => indent.status === 'Pending');
  const historyIndents = indents.filter(indent => indent.status === 'Sent');

  const filteredPending = pendingIndents.filter(indent => 
    indent.indentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    indent.machineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistory = historyIndents.filter(indent => 
    indent.indentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    indent.machineName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleActionClick = (indent: MachineIndent) => {
    setSelectedIndent(indent);
    setFormData({
      transporterName: '',
      transportationCharges: '',
      weighmentSlip: '',
      transportImage: null,
      paymentType: '',
      paymentAmount: ''
    });
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, transportImage: e.target.files[0] });
    }
  };

  const handleSubmit = () => {
    if (!selectedIndent) return;

    const updatedIndents = indents.map(indent => 
      indent.id === selectedIndent.id 
        ? { 
            ...indent, 
            status: 'Sent' as const,
            sentAt: new Date().toLocaleString('en-GB'),
            transportDetails: formData
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
          <h1 className="text-2xl font-bold text-gray-900">Send Machine</h1>
          <p className="text-gray-600">Dispach machines to assigned vendors</p>
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
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Doer Name</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Department</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Machine Part</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Problem</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Priority</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Expected Days</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Location</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Vendor Name</th>
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
                             <Truck size={12} />
                             Dispatch
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
                         <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-sky-700">{indent.vendorName}</td>
                       </tr>
                     ))}
                     {filteredPending.length === 0 && (
                       <tr>
                         <td colSpan={12} className="px-3 py-8 text-center text-gray-500 text-xs">No pending machine dispatches found</td>
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
                         <Truck size={14} />
                         Dispatch
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

                     <div className="text-xs border-t pt-2">
                         <span className="text-gray-500">Assigned Vendor: </span>
                         <span className="font-medium text-sky-700">{indent.vendorName}</span>
                     </div>
                   </div>
                 ))}
                 {filteredPending.length === 0 && (
                   <div className="text-center py-8 text-gray-500 text-xs">No pending machine dispatches found</div>
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
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Transporter Name</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Transportation Charges</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Weighment Slip</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Image</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Payment Type</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
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
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.transportDetails?.transporterName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.transportDetails?.transportationCharges}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.transportDetails?.weighmentSlip}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 italic">
                            {indent.transportDetails?.transportImage ? 'Image Uploaded' : 'No Image'}
                         </td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.transportDetails?.paymentType}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.transportDetails?.paymentAmount}</td>
                       </tr>
                     ))}
                     {filteredHistory.length === 0 && (
                       <tr>
                         <td colSpan={12} className="px-3 py-8 text-center text-gray-500 text-xs">No dispatch history found</td>
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
                       <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Sent</span>
                     </div>
                     
                     <div className="mt-2 text-xs text-gray-700 bg-gray-50 p-2 rounded">
                          <div className="flex justify-between mb-1">
                             <span className="text-gray-500">Transporter</span>
                             <span className="font-medium">{indent.transportDetails?.transporterName}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                             <span className="text-gray-500">Charges</span>
                             <span className="font-medium">{indent.transportDetails?.transportationCharges}</span>
                          </div>
                          <div className="flex justify-between">
                             <span className="text-gray-500">Weighment Slip</span>
                             <span className="font-medium">{indent.transportDetails?.weighmentSlip}</span>
                          </div>
                     </div>
                   </div>
                 ))}
                 {filteredHistory.length === 0 && (
                   <div className="text-center py-8 text-gray-500 text-xs">No dispatch history found</div>
                 )}
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Dispatch Modal */}
      {isModalOpen && selectedIndent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Dispatch Machine</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Read Only Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">Indent Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
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
                    <label className="text-gray-500 block">Doer Name</label>
                    <div className="font-medium text-gray-900">{selectedIndent.doerName}</div>
                  </div>
                  <div>
                    <label className="text-gray-500 block">Department</label>
                    <div className="font-medium text-gray-900">{selectedIndent.department}</div>
                  </div>
                  <div>
                    <label className="text-gray-500 block">Part</label>
                    <div className="font-medium text-gray-900">{selectedIndent.machinePart}</div>
                  </div>
                  <div className="col-span-2 md:col-span-3">
                     <label className="text-gray-500 block">Assigned Vendor</label>
                     <div className="font-medium text-sky-700">{selectedIndent.vendorName}</div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transporter Name *</label>
                  <input
                    type="text"
                    value={formData.transporterName}
                    onChange={(e) => setFormData({...formData, transporterName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Enter transporter name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transportation Charges *</label>
                  <input
                    type="number"
                    value={formData.transportationCharges}
                    onChange={(e) => setFormData({...formData, transportationCharges: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weighment Slip No *</label>
                  <input
                    type="text"
                    value={formData.weighmentSlip}
                    onChange={(e) => setFormData({...formData, weighmentSlip: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Enter slip no"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transporting Image (With Machine)</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                      </div>
                      <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                  </div>
                  {formData.transportImage && (
                    <p className="mt-2 text-xs text-green-600">Selected: {formData.transportImage.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                  <select
                    value={formData.paymentType}
                    onChange={(e) => setFormData({...formData, paymentType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">How Much (Amount)</label>
                  <input
                    type="number"
                    value={formData.paymentAmount}
                    onChange={(e) => setFormData({...formData, paymentAmount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Enter payment amount"
                  />
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
                onClick={handleSubmit}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 shadow-sm"
              >
                Dispatch Machine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentMachine;