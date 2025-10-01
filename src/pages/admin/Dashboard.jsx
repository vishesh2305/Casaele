import { FiUsers, FiShoppingCart, FiDollarSign, FiBox } from 'react-icons/fi'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'

const cards = [
  { label: 'Total Users', value: '1,248', icon: FiUsers },
  { label: 'Total Orders', value: '312', icon: FiShoppingCart },
  { label: 'Revenue', value: '$12,450', icon: FiDollarSign },
  { label: 'Products', value: '87', icon: FiBox },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(card => {
          const Icon = card.icon
          return (
            <div key={card.label} className="rounded-xl bg-white shadow-sm border border-gray-200 p-4 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-700 to-red-500" />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500">{card.label}</div>
                  <div className="mt-2 text-2xl font-semibold text-gray-900">{card.value}</div>
                </div>
                <div className="p-2 rounded-lg bg-red-50 text-red-700"><Icon /></div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-6 lg:col-span-2">
          <div className="text-gray-800 font-medium mb-4">Sales Overview</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{name:'Mon',sales:12},{name:'Tue',sales:18},{name:'Wed',sales:9},{name:'Thu',sales:24},{name:'Fri',sales:20},{name:'Sat',sales:14},{name:'Sun',sales:10}]}> 
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#b91c1c" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-xl bg-white shadow-sm border border-gray-200 p-6">
          <div className="text-gray-800 font-medium mb-4">Category Split</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{name:'Courses',value:40},{name:'Materials',value:25},{name:'Merch',value:20},{name:'Other',value:15}]} dataKey="value" nameKey="name" outerRadius={80} label>
                  {['#b91c1c','#ef4444','#f59e0b','#10b981'].map((c,i)=>(<Cell key={i} fill={c} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}


