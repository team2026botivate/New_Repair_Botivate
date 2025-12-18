import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  Wrench,
  DollarSign,
  TrendingUp,
  Users,
  Package,
  FileText,
  X,
  Calendar,
  MapPin,
} from "lucide-react";

// Summary data for key metrics
const summaryMetrics = [
  { label: "Total Indents", value: 248, icon: <FileText size={18} className="text-sky-600" />, color: "bg-sky-100", trend: "+12%", key: "total" },
  { label: "Pending Approvals", value: 42, icon: <Clock size={18} className="text-amber-600" />, color: "bg-amber-100", trend: "-5%", key: "pending" },
  { label: "In-House Repairs", value: 156, icon: <Wrench size={18} className="text-green-600" />, color: "bg-green-100", trend: "+8%", key: "inhouse" },
  { label: "Out-House Repairs", value: 92, icon: <Package size={18} className="text-purple-600" />, color: "bg-purple-100", trend: "+15%", key: "outhouse" },
  { label: "Completed Today", value: 28, icon: <CheckCircle size={18} className="text-emerald-600" />, color: "bg-emerald-100", trend: "+22%", key: "completed" },
  { label: "Overdue Tasks", value: 17, icon: <AlertTriangle size={18} className="text-red-600" />, color: "bg-red-100", trend: "-3%", key: "overdue" },
  { label: "Active Technicians", value: 34, icon: <Users size={18} className="text-sky-600" />, color: "bg-sky-100", trend: "+2", key: "technicians" },
  { label: "Total Cost (Month)", value: "₹4.2L", icon: <DollarSign size={18} className="text-pink-600" />, color: "bg-pink-100", trend: "+18%", key: "cost" },
];

// Stage-wise breakdown
const stageData = [
  { stage: "Indent Approval", count: 42, color: "#0EA5E9" },
  { stage: "In-House", count: 89, color: "#10B981" },
  { stage: "Need Offer", count: 35, color: "#F59E0B" },
  { stage: "Vendor Selection", count: 28, color: "#8B5CF6" },
  { stage: "Transportation", count: 18, color: "#EC4899" },
  { stage: "Inspection", count: 22, color: "#06B6D4" },
  { stage: "Payment", count: 14, color: "#EF4444" },
];

// Priority distribution
const priorityData = [
  { name: "High", value: 68, color: "#EF4444" },
  { name: "Medium", value: 112, color: "#F59E0B" },
  { name: "Low", value: 68, color: "#10B981" },
];

// Department-wise indents
const departmentData = [
  { name: "Manufacturing", indents: 89, inHouse: 52, outHouse: 37 },
  { name: "Production", indents: 67, inHouse: 41, outHouse: 26 },
  { name: "Packaging", indents: 45, inHouse: 32, outHouse: 13 },
  { name: "Logistics", indents: 47, inHouse: 31, outHouse: 16 },
];

// Daily trend data
const dailyTrendData = [
  { date: "18 Nov", created: 12, completed: 8, pending: 4 },
  { date: "19 Nov", created: 15, completed: 11, pending: 4 },
  { date: "20 Nov", created: 18, completed: 14, pending: 4 },
  { date: "21 Nov", created: 14, completed: 16, pending: -2 },
  { date: "22 Nov", created: 22, completed: 18, pending: 4 },
];

// Recent indents sample data
const recentIndents = [
  { indentNo: "IN-245", machine: "CNC-305", serialNo: "SN-89456", department: "Manufacturing", priority: "High", status: "Vendor Selection", delay: 2 },
  { indentNo: "IN-246", machine: "HP-102", serialNo: "SN-67234", department: "Production", priority: "Medium", status: "In-House", delay: 0 },
  { indentNo: "IN-247", machine: "CB-201", serialNo: "SN-45678", department: "Packaging", priority: "Low", status: "Inspection", delay: 1 },
  { indentNo: "IN-248", machine: "IM-405", serialNo: "SN-23456", department: "Manufacturing", priority: "High", status: "Pending Approval", delay: 3 },
  { indentNo: "IN-249", machine: "PK-301", serialNo: "SN-78901", department: "Packaging", priority: "Medium", status: "Transportation", delay: 0 },
  { indentNo: "IN-250", machine: "LG-405", serialNo: "SN-34567", department: "Logistics", priority: "Low", status: "Payment", delay: 4 },
];

// Technician performance
const technicianData = [
  { name: "Rajesh Kumar", assigned: 18, completed: 15, pending: 3 },
  { name: "Amit Singh", assigned: 22, completed: 19, pending: 3 },
  { name: "Suresh Patel", assigned: 16, completed: 14, pending: 2 },
  { name: "Vikas Sharma", assigned: 20, completed: 16, pending: 4 }
];

// Detailed data
const detailedStageData = [
  { indentNo: "IN-201", machine: "CNC-305", department: "Manufacturing", priority: "High", stage: "Indent Approval", assignedTo: "Pending", days: 2, cost: "₹0" },
  { indentNo: "IN-202", machine: "HP-102", department: "Production", priority: "Medium", stage: "Indent Approval", assignedTo: "Pending", days: 1, cost: "₹0" },
  { indentNo: "IN-203", machine: "CB-201", department: "Packaging", priority: "Low", stage: "In-House", assignedTo: "Rajesh Kumar", days: 3, cost: "₹8,500" },
  { indentNo: "IN-204", machine: "IM-405", department: "Manufacturing", priority: "High", stage: "In-House", assignedTo: "Amit Singh", days: 2, cost: "₹12,000" },
  { indentNo: "IN-205", machine: "PK-301", department: "Packaging", priority: "Medium", stage: "In-House", assignedTo: "Suresh Patel", days: 4, cost: "₹9,800" },
  { indentNo: "IN-206", machine: "LG-405", department: "Logistics", priority: "Low", stage: "Need Offer", assignedTo: "Vendor Team", days: 1, cost: "₹0" },
  { indentNo: "IN-207", machine: "MF-202", department: "Manufacturing", priority: "High", stage: "Vendor Selection", assignedTo: "Vendor Team", days: 3, cost: "₹25,000" },
  { indentNo: "IN-208", machine: "PR-105", department: "Production", priority: "Medium", stage: "Transportation", assignedTo: "Logistics", days: 2, cost: "₹18,500" },
  { indentNo: "IN-209", machine: "CNC-408", department: "Manufacturing", priority: "High", stage: "Inspection", assignedTo: "QC Team", days: 1, cost: "₹32,000" },
  { indentNo: "IN-210", machine: "HP-203", department: "Production", priority: "Low", stage: "Payment", assignedTo: "Finance", days: 5, cost: "₹15,600" },
];

const detailedPriorityData = [
  { indentNo: "IN-301", machine: "CNC-305", department: "Manufacturing", priority: "High", status: "In-House", createdDate: "20 Nov 2024", estimatedCost: "₹12,000" },
  { indentNo: "IN-302", machine: "IM-405", department: "Manufacturing", priority: "High", status: "Vendor Selection", createdDate: "19 Nov 2024", estimatedCost: "₹25,000" },
  { indentNo: "IN-303", machine: "CNC-408", department: "Manufacturing", priority: "High", status: "Inspection", createdDate: "21 Nov 2024", estimatedCost: "₹32,000" },
  { indentNo: "IN-304", machine: "HP-102", department: "Production", priority: "Medium", status: "In-House", createdDate: "20 Nov 2024", estimatedCost: "₹8,500" },
  { indentNo: "IN-305", machine: "PK-301", department: "Packaging", priority: "Medium", status: "In-House", createdDate: "19 Nov 2024", estimatedCost: "₹9,800" },
  { indentNo: "IN-306", machine: "PR-105", department: "Production", priority: "Medium", status: "Transportation", createdDate: "18 Nov 2024", estimatedCost: "₹18,500" },
  { indentNo: "IN-307", machine: "CB-201", department: "Packaging", priority: "Low", status: "In-House", createdDate: "20 Nov 2024", estimatedCost: "₹7,200" },
  { indentNo: "IN-308", machine: "LG-405", department: "Logistics", priority: "Low", status: "Need Offer", createdDate: "21 Nov 2024", estimatedCost: "₹5,500" },
];

const detailedDepartmentData = [
  { indentNo: "IN-401", machine: "CNC-305", department: "Manufacturing", type: "In-House", priority: "High", technician: "Rajesh Kumar", status: "In Progress", cost: "₹12,000" },
  { indentNo: "IN-402", machine: "IM-405", department: "Manufacturing", type: "Out-House", priority: "High", technician: "Vendor-A", status: "Vendor Selection", cost: "₹25,000" },
  { indentNo: "IN-403", machine: "CNC-408", department: "Manufacturing", type: "Out-House", priority: "High", technician: "Vendor-B", status: "Inspection", cost: "₹32,000" },
  { indentNo: "IN-404", machine: "HP-102", department: "Production", type: "In-House", priority: "Medium", technician: "Amit Singh", status: "In Progress", cost: "₹8,500" },
  { indentNo: "IN-405", machine: "PR-105", department: "Production", type: "Out-House", priority: "Medium", technician: "Vendor-C", status: "Transportation", cost: "₹18,500" },
  { indentNo: "IN-406", machine: "PK-301", department: "Packaging", type: "In-House", priority: "Medium", technician: "Suresh Patel", status: "In Progress", cost: "₹9,800" },
];

const detailedTrendData = [
  { date: "18 Nov", indentNo: "IN-501", machine: "CNC-305", type: "Created", department: "Manufacturing", priority: "High", time: "09:30 AM" },
  { date: "18 Nov", indentNo: "IN-502", machine: "HP-102", type: "Completed", department: "Production", priority: "Medium", time: "02:15 PM" },
  { date: "19 Nov", indentNo: "IN-503", machine: "CB-201", type: "Created", department: "Packaging", priority: "Low", time: "10:00 AM" },
  { date: "19 Nov", indentNo: "IN-504", machine: "IM-405", type: "Completed", department: "Manufacturing", priority: "High", time: "04:30 PM" },
  { date: "20 Nov", indentNo: "IN-505", machine: "PK-301", type: "Created", department: "Packaging", priority: "Medium", time: "08:45 AM" },
  { date: "20 Nov", indentNo: "IN-506", machine: "LG-405", type: "Completed", department: "Logistics", priority: "Low", time: "03:20 PM" },
];

const metricDetailData = {
  total: [
    { indentNo: "IN-601", machine: "CNC-305", department: "Manufacturing", status: "In Progress", createdDate: "20 Nov 2024", priority: "High" },
    { indentNo: "IN-602", machine: "HP-102", department: "Production", status: "Completed", createdDate: "19 Nov 2024", priority: "Medium" },
    { indentNo: "IN-603", machine: "CB-201", department: "Packaging", status: "In Progress", createdDate: "21 Nov 2024", priority: "Low" },
    { indentNo: "IN-604", machine: "IM-405", department: "Manufacturing", status: "Pending", createdDate: "22 Nov 2024", priority: "High" },
  ],
  pending: [
    { indentNo: "IN-701", machine: "CNC-305", department: "Manufacturing", submittedBy: "Ramesh Gupta", submittedDate: "20 Nov 2024", waitingDays: 2 },
    { indentNo: "IN-702", machine: "IM-405", department: "Manufacturing", submittedBy: "Suresh Verma", submittedDate: "21 Nov 2024", waitingDays: 1 },
    { indentNo: "IN-703", machine: "HP-102", department: "Production", submittedBy: "Prakash Jain", submittedDate: "19 Nov 2024", waitingDays: 3 },
  ],
  inhouse: [
    { indentNo: "IN-801", machine: "CNC-305", technician: "Rajesh Kumar", department: "Manufacturing", status: "In Progress", startDate: "20 Nov 2024", estimatedCompletion: "23 Nov 2024" },
    { indentNo: "IN-802", machine: "HP-102", technician: "Amit Singh", department: "Production", status: "In Progress", startDate: "19 Nov 2024", estimatedCompletion: "22 Nov 2024" },
    { indentNo: "IN-803", machine: "CB-201", technician: "Suresh Patel", department: "Packaging", status: "In Progress", startDate: "21 Nov 2024", estimatedCompletion: "24 Nov 2024" },
  ],
  outhouse: [
    { indentNo: "IN-901", machine: "IM-405", vendor: "Vendor-A", department: "Manufacturing", status: "Vendor Selection", sentDate: "19 Nov 2024", estimatedReturn: "26 Nov 2024" },
    { indentNo: "IN-902", machine: "CNC-408", vendor: "Vendor-B", department: "Manufacturing", status: "In Transit", sentDate: "18 Nov 2024", estimatedReturn: "25 Nov 2024" },
    { indentNo: "IN-903", machine: "PR-105", vendor: "Vendor-C", department: "Production", status: "Under Repair", sentDate: "17 Nov 2024", estimatedReturn: "24 Nov 2024" },
  ],
  completed: [
    { indentNo: "IN-1001", machine: "HP-102", department: "Production", completedBy: "Amit Singh", completedDate: "22 Nov 2024", cost: "₹8,500", rating: "5/5" },
    { indentNo: "IN-1002", machine: "CB-201", department: "Packaging", completedBy: "Suresh Patel", completedDate: "22 Nov 2024", cost: "₹7,200", rating: "4/5" },
    { indentNo: "IN-1003", machine: "LG-405", department: "Logistics", completedBy: "Rajesh Kumar", completedDate: "22 Nov 2024", cost: "₹5,500", rating: "5/5" },
  ],
  overdue: [
    { indentNo: "IN-1101", machine: "CNC-305", department: "Manufacturing", assignedTo: "Rajesh Kumar", dueDate: "20 Nov 2024", overdueDays: 2, priority: "High" },
    { indentNo: "IN-1102", machine: "IM-405", department: "Manufacturing", assignedTo: "Vendor-A", dueDate: "19 Nov 2024", overdueDays: 3, priority: "High" },
    { indentNo: "IN-1103", machine: "HP-102", department: "Production", assignedTo: "Amit Singh", dueDate: "21 Nov 2024", overdueDays: 1, priority: "Medium" },
  ],
  technicians: [
    { name: "Rajesh Kumar", status: "Active", currentTasks: 3, completedToday: 2, location: "Manufacturing Floor", shift: "Day" },
    { name: "Amit Singh", status: "Active", currentTasks: 3, completedToday: 3, location: "Production Unit", shift: "Day" },
    { name: "Suresh Patel", status: "Active", currentTasks: 2, completedToday: 1, location: "Packaging Area", shift: "Day" },
    { name: "Vikas Sharma", status: "Active", currentTasks: 4, completedToday: 2, location: "Multiple", shift: "Day" },
  ],
  cost: [
    { category: "In-House Repairs", amount: "₹1,85,000", percentage: "44%", items: 156 },
    { category: "Out-House Repairs", amount: "₹1,95,000", percentage: "46%", items: 92 },
    { category: "Transportation", amount: "₹25,000", percentage: "6%", items: 45 },
    { category: "Emergency Repairs", amount: "₹15,000", percentage: "4%", items: 12 },
  ],
};

type MetricKey = keyof typeof metricDetailData;

interface DashboardProps {}

const Dashboard: React.FC<DashboardProps> = () => {
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey | null>(null);

  const openModal = (modalType: string) => setSelectedModal(modalType);
  const openMetricModal = (metricKey: MetricKey) => setSelectedMetric(metricKey);
  const closeModal = () => {
    setSelectedModal(null);
    setSelectedMetric(null);
  };

  const renderModalContent = () => {
    switch(selectedModal) {
      case "stages":
        return (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Indent No.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Machine</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Stage</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Assigned To</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Days</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {detailedStageData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-sky-600">{item.indentNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.machine}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.department}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.priority === "High" ? "bg-red-100 text-red-700" :
                          item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.stage}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.assignedTo}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.days}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">{item.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {detailedStageData.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-sky-600">{item.indentNo}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.priority === "High" ? "bg-red-100 text-red-700" :
                      item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Machine:</span><span className="font-medium">{item.machine}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Department:</span><span>{item.department}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Stage:</span><span>{item.stage}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Assigned To:</span><span>{item.assignedTo}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Days:</span><span>{item.days}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Cost:</span><span className="font-semibold">{item.cost}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      
      case "priority":
        return (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Indent No.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Machine</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Created Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Estimated Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {detailedPriorityData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-sky-600">{item.indentNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.machine}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.department}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.priority === "High" ? "bg-red-100 text-red-700" :
                          item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.status}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.createdDate}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">{item.estimatedCost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {detailedPriorityData.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-sky-600">{item.indentNo}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.priority === "High" ? "bg-red-100 text-red-700" :
                      item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Machine:</span><span className="font-medium">{item.machine}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Department:</span><span>{item.department}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Status:</span><span>{item.status}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Created:</span><span>{item.createdDate}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Est. Cost:</span><span className="font-semibold">{item.estimatedCost}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      
      case "departments":
        return (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Indent No.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Machine</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Technician/Vendor</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {detailedDepartmentData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-sky-600">{item.indentNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.machine}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.department}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.type === "In-House" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.priority === "High" ? "bg-red-100 text-red-700" :
                          item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.technician}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.status}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">{item.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {detailedDepartmentData.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-sky-600">{item.indentNo}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.priority === "High" ? "bg-red-100 text-red-700" :
                      item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Machine:</span><span className="font-medium">{item.machine}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Department:</span><span>{item.department}</span></div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.type === "In-House" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
                      }`}>
                        {item.type}
                      </span>
                    </div>
                    <div className="flex justify-between"><span className="text-gray-500">Technician:</span><span>{item.technician}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Status:</span><span>{item.status}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Cost:</span><span className="font-semibold">{item.cost}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      
      case "trend":
        return (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Indent No.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Machine</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {detailedTrendData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-700">{item.date}</td>
                      <td className="px-4 py-3 text-sm font-medium text-sky-600">{item.indentNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.machine}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.type === "Created" ? "bg-sky-100 text-sky-700" : "bg-green-100 text-green-700"
                        }`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.department}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.priority === "High" ? "bg-red-100 text-red-700" :
                          item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {detailedTrendData.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-sky-600">{item.indentNo}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.type === "Created" ? "bg-sky-100 text-sky-700" : "bg-green-100 text-green-700"
                    }`}>
                      {item.type}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Date:</span><span className="font-medium">{item.date}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Machine:</span><span>{item.machine}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Department:</span><span>{item.department}</span></div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Priority:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.priority === "High" ? "bg-red-100 text-red-700" :
                        item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                        "bg-green-100 text-green-700"
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <div className="flex justify-between"><span className="text-gray-500">Time:</span><span>{item.time}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  const renderMetricModalContent = () => {
    if (!selectedMetric) return null;

    const data: any[] = metricDetailData[selectedMetric];
    if (!data) return <p>No data available</p>;

    switch(selectedMetric) {
      case "total":
        return (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Indent No.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Machine</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Created Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-sky-600">{item.indentNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.machine}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.department}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === "Completed" ? "bg-green-100 text-green-700" :
                          item.status === "In Progress" ? "bg-sky-100 text-sky-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.createdDate}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.priority === "High" ? "bg-red-100 text-red-700" :
                          item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {data.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-sky-600">{item.indentNo}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.priority === "High" ? "bg-red-100 text-red-700" :
                      item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Machine:</span><span className="font-medium">{item.machine}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Department:</span><span>{item.department}</span></div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === "Completed" ? "bg-green-100 text-green-700" :
                        item.status === "In Progress" ? "bg-sky-100 text-sky-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="flex justify-between"><span className="text-gray-500">Created:</span><span>{item.createdDate}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case "pending":
        return (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Indent No.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Machine</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Submitted By</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Submitted Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Waiting Days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-sky-600">{item.indentNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.machine}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.department}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.submittedBy}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.submittedDate}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.waitingDays > 2 ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {item.waitingDays} days
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {data.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-sky-600">{item.indentNo}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.waitingDays > 2 ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {item.waitingDays} days
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Machine:</span><span className="font-medium">{item.machine}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Department:</span><span>{item.department}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Submitted By:</span><span>{item.submittedBy}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Submitted:</span><span>{item.submittedDate}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case "inhouse":
        return (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Indent No.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Machine</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Technician</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Start Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Est. Completion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-sky-600">{item.indentNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.machine}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.technician}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.department}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-sky-100 text-sky-700">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.startDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.estimatedCompletion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {data.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-sky-600">{item.indentNo}</span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-sky-100 text-sky-700">{item.status}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Machine:</span><span className="font-medium">{item.machine}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Technician:</span><span className="font-medium">{item.technician}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Department:</span><span>{item.department}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Start Date:</span><span>{item.startDate}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Est. Completion:</span><span>{item.estimatedCompletion}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case "outhouse":
        return (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Indent No.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Machine</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Vendor</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Sent Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Est. Return</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-sky-600">{item.indentNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.machine}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.vendor}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.department}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.sentDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.estimatedReturn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {data.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-sky-600">{item.indentNo}</span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">{item.status}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Machine:</span><span className="font-medium">{item.machine}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Vendor:</span><span className="font-medium">{item.vendor}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Department:</span><span>{item.department}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Sent Date:</span><span>{item.sentDate}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Est. Return:</span><span>{item.estimatedReturn}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case "completed":
        return (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Indent No.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Machine</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Completed By</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Completed Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Cost</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-sky-600">{item.indentNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.machine}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.department}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.completedBy}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.completedDate}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-green-600">{item.cost}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.rating === "5/5" ? "bg-green-100 text-green-700" : "bg-sky-100 text-sky-700"
                        }`}>
                          {item.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {data.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-sky-600">{item.indentNo}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.rating === "5/5" ? "bg-green-100 text-green-700" : "bg-sky-100 text-sky-700"
                    }`}>
                      {item.rating}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Machine:</span><span className="font-medium">{item.machine}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Department:</span><span>{item.department}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Completed By:</span><span className="font-medium">{item.completedBy}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Completed:</span><span>{item.completedDate}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Cost:</span><span className="font-semibold text-green-600">{item.cost}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case "overdue":
        return (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Indent No.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Machine</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Assigned To</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Overdue Days</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-sky-600">{item.indentNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{item.machine}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.department}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.assignedTo}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.dueDate}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                          {item.overdueDays} days
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.priority === "High" ? "bg-red-100 text-red-700" :
                          item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {item.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {data.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-sky-600">{item.indentNo}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.priority === "High" ? "bg-red-100 text-red-700" :
                      item.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Machine:</span><span className="font-medium">{item.machine}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Department:</span><span>{item.department}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Assigned To:</span><span className="font-medium">{item.assignedTo}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Due Date:</span><span>{item.dueDate}</span></div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Overdue:</span>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">{item.overdueDays} days</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case "technicians":
        return (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Current Tasks</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Completed Today</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Shift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.name}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.currentTasks}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.completedToday}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.location}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.shift}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {data.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-gray-800">{item.name}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Current Tasks:</span><span className="font-medium">{item.currentTasks}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Completed Today:</span><span className="font-medium">{item.completedToday}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Location:</span><span>{item.location}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Shift:</span><span>{item.shift}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case "cost":
        return (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sky-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Percentage</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Items</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.category}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-800">{item.amount}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.percentage}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.items}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden space-y-3">
              {data.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-gray-800">{item.category}</span>
                    <span className="text-sm font-semibold text-gray-800">{item.amount}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Percentage:</span><span className="font-medium">{item.percentage}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Total Items:</span><span>{item.items}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      default:
        return <p>Detailed view coming soon with drill-down analytics...</p>;
    }
  };

  const getModalTitle = () => {
    if (selectedModal) {
      switch(selectedModal) {
        case "stages": return "Detailed Stage Analysis";
        case "priority": return "Priority Breakdown";
        case "departments": return "Department Analysis";
        case "trend": return "Activity Trend Details";
        default: return "Detailed View";
      }
    }
    if (selectedMetric) {
      const metric = summaryMetrics.find(m => m.key === selectedMetric);
      return metric ? `Detailed ${metric.label} Analysis` : "Metric Details";
    }
    return "Details";
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="space-y-4 md:space-y-6">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          {summaryMetrics.map((stat, idx) => (
            <div
              key={idx}
              onClick={() => openMetricModal(stat.key as MetricKey)}
              className="p-3 md:p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 ${stat.color} rounded-lg`}>
                  {stat.icon}
                </div>
                <span className={`text-xs font-semibold ${stat.trend && stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-xs font-medium text-gray-500 uppercase mt-2">
                {stat.label}
              </p>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-1">
                {stat.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
          {/* Stage-wise Breakdown */}
          <div 
            onClick={() => openModal("stages")}
            className="p-4 md:p-6 bg-white rounded-xl shadow-md cursor-pointer hover:shadow-xl transition-all"
          >
            <h2 className="flex items-center text-base md:text-lg font-bold text-gray-800 mb-4">
              <TrendingUp size={20} className="mr-2 text-sky-600" />
              Repair Stage Distribution
            </h2>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" width={120} />
                  <Tooltip />
                  <Bar dataKey="count" name="Indents">
                    {stageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Distribution */}
          <div 
            onClick={() => openModal("priority")}
            className="p-4 md:p-6 bg-white rounded-xl shadow-md cursor-pointer hover:shadow-xl transition-all"
          >
            <h2 className="flex items-center text-base md:text-lg font-bold text-gray-800 mb-4">
              <AlertTriangle size={20} className="mr-2 text-sky-600" />
              Priority Distribution
            </h2>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department-wise Analysis */}
          <div 
            onClick={() => openModal("departments")}
            className="p-4 md:p-6 bg-white rounded-xl shadow-md cursor-pointer hover:shadow-xl transition-all"
          >
            <h2 className="flex items-center text-base md:text-lg font-bold text-gray-800 mb-4">
              <MapPin size={20} className="mr-2 text-sky-600" />
              Department-wise Indents
            </h2>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="inHouse" name="In-House" fill="#10B981" />
                  <Bar dataKey="outHouse" name="Out-House" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Trend */}
          <div 
            onClick={() => openModal("trend")}
            className="p-4 md:p-6 bg-white rounded-xl shadow-md cursor-pointer hover:shadow-xl transition-all"
          >
            <h2 className="flex items-center text-base md:text-lg font-bold text-gray-800 mb-4">
              <Calendar size={20} className="mr-2 text-sky-600" />
              Daily Activity Trend
            </h2>
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="created" name="Created" stroke="#0EA5E9" strokeWidth={2} />
                  <Line type="monotone" dataKey="completed" name="Completed" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="pending" name="Net Pending" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Indents & Technician Performance */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
          {/* Recent Indents */}
          <div className="p-4 md:p-6 bg-white rounded-xl shadow-md">
            <h2 className="flex items-center justify-between text-base md:text-lg font-bold text-gray-800 mb-4">
              <span className="flex items-center">
                <FileText size={20} className="mr-2 text-sky-600" />
                Recent Indents
              </span>
            </h2>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Indent No.</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Machine</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Delay</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentIndents.map((indent, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-sky-600">{indent.indentNo}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{indent.machine}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{indent.department}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          indent.priority === "High" ? "bg-red-100 text-red-700" :
                          indent.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {indent.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{indent.status}</td>
                      <td className="px-4 py-3">
                        {indent.delay > 0 ? (
                          <span className="text-red-600 font-semibold">{indent.delay}d</span>
                        ) : (
                          <span className="text-green-600">On-time</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {recentIndents.map((indent, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-bold text-sky-600">{indent.indentNo}</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      indent.priority === "High" ? "bg-red-100 text-red-700" :
                      indent.priority === "Medium" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {indent.priority}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Machine:</span><span className="font-medium">{indent.machine}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Department:</span><span>{indent.department}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Status:</span><span>{indent.status}</span></div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Delay:</span>
                      {indent.delay > 0 ? (
                        <span className="text-red-600 font-semibold">{indent.delay}d</span>
                      ) : (
                        <span className="text-green-600">On-time</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technician Performance */}
          <div className="p-4 md:p-6 bg-white rounded-xl shadow-md">
            <h2 className="flex items-center justify-between text-base md:text-lg font-bold text-gray-800 mb-4">
              <span className="flex items-center">
                <Wrench size={20} className="mr-2 text-sky-600" />
                Technician Performance
              </span>
            </h2>
            <div className="space-y-4">
              {technicianData.map((tech, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-800">{tech.name}</h3>
                    <span className="text-sm text-gray-600">
                      {Math.round((tech.completed / tech.assigned) * 100)}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-sky-600 h-2 rounded-full transition-all"
                      style={{ width: `${(tech.completed / tech.assigned) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Assigned: {tech.assigned}</span>
                    <span>Completed: {tech.completed}</span>
                    <span className="text-amber-600">Pending: {tech.pending}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal */}
        {(selectedModal || selectedMetric) && (
          <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 md:p-6 border-b bg-gradient-to-r from-sky-50 to-purple-50">
                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                  {getModalTitle()}
                </h2>
                <button 
                  onClick={closeModal} 
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="p-4 md:p-6 overflow-y-auto max-h-[70vh]">
                {selectedModal && renderModalContent()}
                {selectedMetric && renderMetricModalContent()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;