import React, { useState } from 'react';
import { Search, DollarSign, X } from 'lucide-react';

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

interface PaymentDetails {
  billMatch: 'Yes' | 'No';
  billStatus: 'Pending' | 'Cleared' | 'Disputed';
  finalPaymentAmount: string;
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
  status: 'PendingPayment' | 'Paid';
  
  // Previous Data
  transportDetails?: TransportDetails;
  sentAt?: string;
  storeInDetails?: StoreInDetails;
  receivedAt?: string;

  // Added in Payment
  paymentDetails?: PaymentDetails;
  paidAt?: string;
}

const Payment: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"pending" | "history">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndent, setSelectedIndent] = useState<MachineIndent | null>(null);

  // Form State
  const [formData, setFormData] = useState<PaymentDetails>({
     billMatch: 'Yes',
     billStatus: 'Pending',
     finalPaymentAmount: ''
  });

  const [indents, setIndents] = useState<MachineIndent[]>([
     // Mock Data 1: Pending Payment
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
      status: 'PendingPayment',
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
    // Mock Data 2: Pending Payment
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
      status: 'PendingPayment',
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
    // Mock Data 3: History (Paid)
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
      status: 'Paid',
      sentAt: "2024-03-01 10:00:00",
      receivedAt: "2024-03-10 14:00:00",
      paidAt: "2024-03-12 11:00:00",
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
      },
      paymentDetails: {
         billMatch: 'Yes',
         billStatus: 'Cleared',
         finalPaymentAmount: "15000"
      }
    },
     // Mock Data 4: History (Paid)
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
      status: 'Paid',
      sentAt: "2024-03-02 11:20:00",
      receivedAt: "2024-03-08 09:30:00",
      paidAt: "2024-03-09 10:00:00",
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
      },
      paymentDetails: {
         billMatch: 'Yes',
         billStatus: 'Cleared',
         finalPaymentAmount: "2000"
      }
    },
  ]);

  const pendingIndents = indents.filter(indent => indent.status === 'PendingPayment');
  const historyIndents = indents.filter(indent => indent.status === 'Paid');

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
       billMatch: 'Yes',
       billStatus: 'Pending',
       finalPaymentAmount: indent.storeInDetails?.toBePaidAmount || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (!selectedIndent) return;

    const updatedIndents = indents.map(indent => 
      indent.id === selectedIndent.id 
        ? { 
            ...indent, 
            status: 'Paid' as const,
            paidAt: new Date().toLocaleString('en-GB'),
            paymentDetails: formData
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
          <h1 className="text-2xl font-bold text-gray-900">Payment Process</h1>
          <p className="text-gray-600">Finalize payments for completed repairs</p>
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
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Bill No</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Total Bill Amount</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">To Be Paid</th>
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
                             <DollarSign size={12} />
                             Process
                           </button>
                         </td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-900">{indent.indentNumber}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.machineName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{indent.machineSerialNo}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{indent.doerName}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{indent.department}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-600">{indent.machinePart}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.storeInDetails?.billNo}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.storeInDetails?.totalBillAmount}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 font-medium">{indent.storeInDetails?.toBePaidAmount}</td>
                       </tr>
                     ))}
                     {filteredPending.length === 0 && (
                       <tr>
                         <td colSpan={10} className="px-3 py-8 text-center text-gray-500 text-xs">No pending payments found</td>
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
                         <DollarSign size={14} />
                         Process
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
                          <div className="flex justify-between mb-1">
                             <span className="text-gray-500">Bill No</span>
                             <span className="font-medium">{indent.storeInDetails?.billNo}</span>
                          </div>
                          <div className="flex justify-between">
                             <span className="text-gray-500">To Be Paid</span>
                             <span className="font-bold text-gray-900">{indent.storeInDetails?.toBePaidAmount}</span>
                          </div>
                      </div>
                   </div>
                 ))}
                 {filteredPending.length === 0 && (
                   <div className="text-center py-8 text-gray-500 text-xs">No pending payments found</div>
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
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Bill No</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Bill Match</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Bill Status</th>
                       <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Paid Amount</th>
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
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.storeInDetails?.billNo}</td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{indent.paymentDetails?.billMatch}</td>
                         <td className="px-3 py-2 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium
                              ${indent.paymentDetails?.billStatus === 'Cleared' ? 'bg-green-100 text-green-800' : 
                                indent.paymentDetails?.billStatus === 'Disputed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {indent.paymentDetails?.billStatus}
                            </span>
                         </td>
                         <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900 font-medium">{indent.paymentDetails?.finalPaymentAmount}</td>
                       </tr>
                     ))}
                     {filteredHistory.length === 0 && (
                       <tr>
                         <td colSpan={10} className="px-3 py-8 text-center text-gray-500 text-xs">No payment history found</td>
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
                       <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Paid</span>
                     </div>
                     
                     <div className="mt-2 text-xs text-gray-700 bg-gray-50 p-2 rounded">
                          <div className="flex justify-between mb-1">
                             <span className="text-gray-500">Bill No</span>
                             <span className="font-medium">{indent.storeInDetails?.billNo}</span>
                          </div>
                          <div className="flex justify-between mb-1">
                             <span className="text-gray-500">Bill Status</span>
                             <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium
                              ${indent.paymentDetails?.billStatus === 'Cleared' ? 'bg-green-100 text-green-800' : 
                                indent.paymentDetails?.billStatus === 'Disputed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {indent.paymentDetails?.billStatus}
                            </span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-gray-200 mt-1">
                             <span className="text-gray-500 font-medium">Paid Amount</span>
                             <span className="font-bold text-gray-900">{indent.paymentDetails?.finalPaymentAmount}</span>
                          </div>
                     </div>
                   </div>
                 ))}
                 {filteredHistory.length === 0 && (
                   <div className="text-center py-8 text-gray-500 text-xs">No payment history found</div>
                 )}
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Processing Modal */}
      {isModalOpen && selectedIndent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Process Payment</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Read Only Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3 uppercase tracking-wider">Indent & Bill Details</h4>
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
                     <label className="text-gray-500 block">Bill No</label>
                     <div className="font-medium text-gray-900">{selectedIndent.storeInDetails?.billNo}</div>
                  </div>
                  <div>
                     <label className="text-gray-500 block">Total Bill Amount</label>
                     <div className="font-medium text-gray-900">{selectedIndent.storeInDetails?.totalBillAmount}</div>
                  </div>
                  <div>
                     <label className="text-gray-500 block">To Be Paid</label>
                     <div className="font-medium text-sky-700">{selectedIndent.storeInDetails?.toBePaidAmount}</div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Bill Match</label>
                    <select
                      value={formData.billMatch}
                      onChange={(e) => setFormData({...formData, billMatch: e.target.value as 'Yes' | 'No'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Bill Status</label>
                    <select
                      value={formData.billStatus}
                      onChange={(e) => setFormData({...formData, billStatus: e.target.value as 'Pending' | 'Cleared' | 'Disputed'})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Cleared">Cleared</option>
                      <option value="Disputed">Disputed</option>
                    </select>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Final Payment Amount</label>
                    <input
                      type="number"
                      value={formData.finalPaymentAmount}
                      onChange={(e) => setFormData({...formData, finalPaymentAmount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Enter amount paid"
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
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;