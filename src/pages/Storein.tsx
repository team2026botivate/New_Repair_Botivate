import React, { useState } from 'react';
import { Search, FolderInput, X, Upload } from 'lucide-react';

interface TransportDetails {
  transporterName: string;
  transportationCharges: string;
  weighmentSlip: string;
  transportImage: File | null;
  paymentType: string;
  paymentAmount: string;
}

interface StoreInDetails {
  inspectedBy: string;
  inspectionResult: string;
  returnTransporterName: string;
  transportationAmount: string;
  billImage: File | null;
  billNo: string;
  typeOfBill: string;
  totalBillAmount: string;
  toBePaidAmount: string;
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
  vendorName: string; 
  source: 'Regular' | 'Three Party Resolved';
  status: 'PendingStoreIn' | 'Completed';
  
  // From Sent Machine
  transportDetails?: TransportDetails;
  sentAt?: string;

  // Added in StoreIn
  storeInDetails?: StoreInDetails;
  receivedAt?: string;
}

const StoreIn: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"pending" | "history">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndent, setSelectedIndent] = useState<MachineIndent | null>(null);

  // Form State
  const [formData, setFormData] = useState<StoreInDetails>({
    inspectedBy: '',
    inspectionResult: '',
    returnTransporterName: '',
    transportationAmount: '',
    billImage: null,
    billNo: '',
    typeOfBill: '',
    totalBillAmount: '',
    toBePaidAmount: ''
  });

  const [indents, setIndents] = useState<MachineIndent[]>([
     // Mock Data 1: Pending Item 1
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
      status: 'PendingStoreIn',
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
    // Mock Data 2: Pending Item 2
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
      status: 'PendingStoreIn',
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
    // Mock Data 3: History Item (Moved from Pending)
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
      status: 'Completed',
      sentAt: "2024-03-04 10:00:00",
      receivedAt: "2024-03-08 11:30:00",
      transportDetails: {
        transporterName: "Heavy Haulage",
        transportationCharges: "3500",
        weighmentSlip: "WS-8899",
        transportImage: null,
        paymentType: "Cheque",
        paymentAmount: "3500"
      },
      storeInDetails: {
        inspectedBy: "Amit Verma",
        inspectionResult: "Ok",
        returnTransporterName: "Heavy Haulage Return",
        transportationAmount: "3600",
        billImage: null,
        billNo: "BILL-2024-008",
        typeOfBill: "Part Replacement",
        totalBillAmount: "12000",
        toBePaidAmount: "12000"
      }
    },
    // Mock Data 4: History Item (Moved from Pending)
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
      status: 'Completed',
      sentAt: "2024-03-03 16:45:00",
      receivedAt: "2024-03-09 15:45:00",
      transportDetails: {
        transporterName: "Express Couriers",
        transportationCharges: "800",
        weighmentSlip: "WS-6677",
        transportImage: null,
        paymentType: "UPI",
        paymentAmount: "800"
      },
      storeInDetails: {
        inspectedBy: "Rajesh Kumar",
        inspectionResult: "Panel working fine",
        returnTransporterName: "Express Couriers",
        transportationAmount: "800",
        billImage: null,
        billNo: "BILL-2024-009",
        typeOfBill: "Service",
        totalBillAmount: "5000",
        toBePaidAmount: "5000"
      }
    },
    // Mock Data 5: History Item (Moved from Pending)
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
      status: 'Completed',
      sentAt: "2024-03-02 11:20:00",
      receivedAt: "2024-03-08 09:30:00",
      transportDetails: {
        transporterName: "Local Transport",
        transportationCharges: "600",
        weighmentSlip: "WS-3344",
        transportImage: null,
        paymentType: "Cash",
        paymentAmount: "600"
      },
      storeInDetails: {
        inspectedBy: "Sneha Desai",
        inspectionResult: "Calibrated",
        returnTransporterName: "Self",
        transportationAmount: "0",
        billImage: null,
        billNo: "BILL-2024-010",
        typeOfBill: "Service",
        totalBillAmount: "2000",
        toBePaidAmount: "2000"
      }
    },
    // Mock Data 6: History Item (Already History)
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
      status: 'Completed',
      sentAt: "2024-03-01 10:00:00",
      receivedAt: "2024-03-10 14:00:00",
      transportDetails: {
        transporterName: "Fast Logistics",
        transportationCharges: "1500",
        weighmentSlip: "WS-9988",
        transportImage: null,
        paymentType: "Cash",
        paymentAmount: "1500"
      },
      storeInDetails: {
        inspectedBy: "Rakesh Engineer",
        inspectionResult: "Satisfactory",
        returnTransporterName: "Fast Logistics Return",
        transportationAmount: "1600",
        billImage: null,
        billNo: "BILL-2024-005",
        typeOfBill: "Repair Invoice",
        totalBillAmount: "15000",
        toBePaidAmount: "15000"
      }
    },
  ]);

  const pendingIndents = indents.filter(indent => indent.status === 'PendingStoreIn');
  const historyIndents = indents.filter(indent => indent.status === 'Completed');

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
      inspectedBy: '',
      inspectionResult: '',
      returnTransporterName: '',
      transportationAmount: '',
      billImage: null,
      billNo: '',
      typeOfBill: '',
      totalBillAmount: '',
      toBePaidAmount: ''
    });
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, billImage: e.target.files[0] });
    }
  };

  const handleSubmit = () => {
    if (!selectedIndent) return;

    const updatedIndents = indents.map(indent => 
      indent.id === selectedIndent.id 
        ? { 
            ...indent, 
            status: 'Completed' as const,
            receivedAt: new Date().toLocaleString('en-GB'),
            storeInDetails: formData
          } 
        : indent
    );

    setIndents(updatedIndents);
    setIsModalOpen(false);
    setSelectedIndent(null);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store In</h1>
          <p className="text-gray-600">Receive repaired machines and verify details</p>
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
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Transporter Name</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Transportation Charges</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Weighment Slip</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Image</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Payment Type</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Amount</th>
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
                             <FolderInput size={12} />
                             Receive
                           </button>
                         </td>
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
                            {indent.transportDetails?.transportImage ? 'Image' : 'No Image'}
                         </td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.transportDetails?.paymentType}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.transportDetails?.paymentAmount}</td>
                       </tr>
                     ))}
                     {filteredPending.length === 0 && (
                       <tr>
                         <td colSpan={13} className="px-3 py-8 text-center text-gray-500 text-xs">No pending items found</td>
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
                         <FolderInput size={14} />
                         Receive
                       </button>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                         <span className="text-gray-500 block">Department</span>
                         <span className="font-medium text-gray-900">{indent.department}</span>
                       </div>
                       <div>
                         <span className="text-gray-500 block">Part</span>
                         <span className="font-medium text-gray-900">{indent.machinePart}</span>
                       </div>
                     </div>
                     
                     <div className="mt-2 text-xs text-gray-700 bg-gray-50 p-2 rounded">
                          <span className="block font-medium text-gray-500 mb-1">Dispatch Details (Incoming)</span>
                          <div className="flex justify-between mb-1">
                             <span className="text-gray-500">Transporter</span>
                             <span className="font-medium">{indent.transportDetails?.transporterName}</span>
                          </div>
                      </div>
                   </div>
                 ))}
                 {filteredPending.length === 0 && (
                   <div className="text-center py-8 text-gray-500 text-xs">No pending items found</div>
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
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Inspected By</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Inspection Result</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Return Transporter</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Trans. Amount</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Bill Image</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Bill No.</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Type of Bill</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Total Bill Amount</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">To Be Paid</th>
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
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.storeInDetails?.inspectedBy}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.storeInDetails?.inspectionResult}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.storeInDetails?.returnTransporterName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.storeInDetails?.transportationAmount}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 italic">
                             {indent.storeInDetails?.billImage ? 'View' : 'No Image'}
                         </td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.storeInDetails?.billNo}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.storeInDetails?.typeOfBill}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.storeInDetails?.totalBillAmount}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.storeInDetails?.toBePaidAmount}</td>
                       </tr>
                     ))}
                     {filteredHistory.length === 0 && (
                       <tr>
                         <td colSpan={15} className="px-3 py-8 text-center text-gray-500 text-xs">No history found</td>
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
                       <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Received</span>
                     </div>
                     
                     <div className="mt-2 text-xs text-gray-700 bg-gray-50 p-2 rounded max-h-40 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <div>
                             <span className="text-gray-500 block">Inspected By</span>
                             <span className="font-medium">{indent.storeInDetails?.inspectedBy}</span>
                          </div>
                           <div>
                             <span className="text-gray-500 block">Bill No</span>
                             <span className="font-medium">{indent.storeInDetails?.billNo}</span>
                          </div>
                          <div className="col-span-2">
                             <span className="text-gray-500 block">Total Bill Amount</span>
                             <span className="font-bold text-gray-900">{indent.storeInDetails?.totalBillAmount}</span>
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

      {/* Dispatch Modal */}
      {isModalOpen && selectedIndent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Store In - Receive Machine</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Read Only Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">Indent & Dispatch Details</h4>
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
                  <div>
                     <label className="text-gray-500 block">Dispatch Transporter</label>
                     <div className="font-medium text-gray-900">{selectedIndent.transportDetails?.transporterName}</div>
                  </div>
                   <div>
                     <label className="text-gray-500 block">Dispatch Charges</label>
                     <div className="font-medium text-gray-900">{selectedIndent.transportDetails?.transportationCharges}</div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-3 gap-4">
                 <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inspected By</label>
                  <input
                    type="text"
                    value={formData.inspectedBy}
                    onChange={(e) => setFormData({...formData, inspectedBy: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Inspector Name"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inspection Result</label>
                  <input
                    type="text"
                    value={formData.inspectionResult}
                    onChange={(e) => setFormData({...formData, inspectionResult: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Result Details"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Return Transporter Name</label>
                  <input
                    type="text"
                    value={formData.returnTransporterName}
                    onChange={(e) => setFormData({...formData, returnTransporterName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Transporter Name"
                  />
                </div>

                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transportation Amount</label>
                  <input
                    type="number"
                    value={formData.transportationAmount}
                    onChange={(e) => setFormData({...formData, transportationAmount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    placeholder="Amount"
                  />
                </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Bill No.</label>
                    <input
                      type="text"
                      value={formData.billNo}
                      onChange={(e) => setFormData({...formData, billNo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Bill Number"
                    />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Type of Bill</label>
                    <input
                      type="text"
                      value={formData.typeOfBill}
                      onChange={(e) => setFormData({...formData, typeOfBill: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="e.g. Repair, Replacement"
                    />
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Bill Amount</label>
                    <input
                      type="number"
                      value={formData.totalBillAmount}
                      onChange={(e) => setFormData({...formData, totalBillAmount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Total Amount"
                    />
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Be Paid Amount</label>
                    <input
                      type="number"
                      value={formData.toBePaidAmount}
                      onChange={(e) => setFormData({...formData, toBePaidAmount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Amount to Pay"
                    />
                 </div>

                <div className="col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bill Image</label>
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
                  {formData.billImage && (
                    <p className="mt-2 text-xs text-green-600">Selected: {formData.billImage.name}</p>
                  )}
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
                Store In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreIn;