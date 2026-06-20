import { useState, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { ResponsivePie } from '@nivo/pie'

// ─── Constants ───────────────────────────────────────────────────────────────

const LINES = [
    { key: 'upcoming',  label: 'Upcoming',  color: '#818cf8' },
    { key: 'passed',    label: 'Passed',    color: '#94a3b8' },
    { key: 'completed', label: 'Completed', color: '#34d399' },
    { key: 'cancelled', label: 'Cancelled', color: '#f87171' },
]

const TIME_FILTER_OPTIONS = [
    { value: 'all',     label: 'All Time' },
    { value: 'week',    label: 'Last Week' },
    { value: 'month',   label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: 'year',    label: 'Last Year' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function filterByTime(appointments, timeFilter) {
    const now = new Date()
    return appointments.filter(appt => {
        const d = new Date(appt.date)
        switch (timeFilter) {
            case 'week':    return d >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            case 'month':   return d >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
            case '3months': return d >= new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
            case '6months': return d >= new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
            case 'year':    return d >= new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
            default:        return true
        }
    })
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white border border-slate-100 rounded-xl shadow-md px-4 py-3 text-sm">
            <p className="font-medium text-slate-500 mb-2 text-xs uppercase tracking-wide">{label}</p>
            {payload.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: entry.color }} />
                    <span className="text-slate-500 text-xs">{entry.name}:</span>
                    <span className="font-semibold text-slate-700 text-xs">{entry.value}</span>
                </div>
            ))}
        </div>
    )
}

// ─── Chart1 — Line Chart ──────────────────────────────────────────────────────

export function Chart1({ data, timeFilter }) {
    const appointmentData = data?.data || {}
    const [hiddenLines, setHiddenLines] = useState({})

    const toggleLine = (key) =>
        setHiddenLines(prev => ({ ...prev, [key]: !prev[key] }))

    const chartData = useMemo(() => {
        const appointments = appointmentData.recent_appointments || []
        const filtered = filterByTime(appointments, timeFilter)

        const byDate = {}
        filtered.forEach(appt => {
            const date = appt.date
            if (!byDate[date]) byDate[date] = { upcoming: 0, passed: 0, completed: 0, cancelled: 0 }
            const status = appt.status === 'rescheduled' ? 'upcoming' : appt.status
            if (byDate[date][status] !== undefined) byDate[date][status] += 1
        })

        return Object.entries(byDate)
            .sort(([a], [b]) => new Date(a) - new Date(b))
            .map(([date, counts]) => ({
                date: new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
                ...counts,
            }))
    }, [appointmentData, timeFilter])

    return (
        <div className="mb-8">
            <h4 className="font-medium text-slate-600 mb-4">
                Appointments by Date
                {chartData.length === 0 && (
                    <span className="text-sm text-slate-400 ml-2">(No data for selected period)</span>
                )}
            </h4>

            {/* Legend Tabs */}
            <div className="flex flex-wrap gap-2 mb-5">
                {LINES.map(line => (
                    <button
                        key={line.key}
                        onClick={() => toggleLine(line.key)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                            hiddenLines[line.key]
                                ? 'bg-slate-50 border-slate-100 text-slate-300'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                    >
                        <span
                            className="w-5 h-0.5 rounded-full inline-block transition-all duration-200"
                            style={{ background: hiddenLines[line.key] ? '#e2e8f0' : line.color }}
                        />
                        {line.label}
                    </button>
                ))}
            </div>

            {chartData.length > 0 ? (
                <div className="h-[calc(100vh-300px)]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 16, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#94a3b8', fontSize: 11 }}
                                axisLine={{ stroke: '#f1f5f9' }}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: '#94a3b8', fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                allowDecimals={false}
                                label={{
                                    value: 'Appointments',
                                    angle: -90,
                                    position: 'insideLeft',
                                    style: { fill: '#94a3b8', fontSize: 11 },
                                    offset: 10,
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }} />
                            {LINES.map(line => (
                                <Line
                                    key={line.key}
                                    type="monotone"
                                    dataKey={line.key}
                                    name={line.label}
                                    stroke={line.color}
                                    strokeWidth={2}
                                    dot={{ fill: '#fff', stroke: line.color, strokeWidth: 1.5, r: 3 }}
                                    activeDot={{ r: 5, fill: line.color, stroke: '#fff', strokeWidth: 2 }}
                                    hide={!!hiddenLines[line.key]}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="flex items-center justify-center h-48 text-slate-400">
                    <div className="text-center">
                        <p className="text-base mb-1">No appointments found</p>
                        <p className="text-sm text-slate-300">Try selecting a different time period</p>
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── Chart2 — Pie Chart ───────────────────────────────────────────────────────

export function Chart2({ data }) {
    const appointmentData = data?.data || {}

    const pieData = useMemo(() => {
        const byStatus = appointmentData?.appointments_by_status || {}

        const statusList = [
            { id: 'upcoming',  label: 'Upcoming',  color: '#818cf8' },
            { id: 'completed', label: 'Completed', color: '#34d399' },
            { id: 'passed',    label: 'Passed',    color: '#94a3b8' },
            { id: 'cancelled', label: 'Cancelled', color: '#f87171' },
        ]

        const items = statusList.map(s => ({
            ...s,
            value: byStatus[s.id]?.count ?? byStatus[s.id] ?? 0,
        })).filter(item => item.value > 0)

        const total = items.reduce((sum, item) => sum + item.value, 0)
        items.forEach(item => {
            item.percentage = total > 0 ? Math.round((item.value / total) * 100) : 0
        })

        return items
    }, [appointmentData])

    return (
        <div className="mb-8">
            <h4 className="font-medium text-slate-600 mb-4">
                Appointments by Status
                {pieData.length === 0 && (
                    <span className="text-sm text-slate-400 ml-2">(No data available)</span>
                )}
            </h4>
            <div className="h-[300px]">
                {pieData.length > 0 ? (
                    <ResponsivePie
                        data={pieData}
                        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                        innerRadius={0.55}
                        padAngle={0.5}
                        cornerRadius={4}
                        activeOuterRadiusOffset={6}
                        colors={{ datum: 'data.color' }}
                        arcLinkLabelsSkipAngle={10}
                        arcLinkLabelsTextColor="#94a3b8"
                        arcLinkLabelsThickness={1.5}
                        arcLinkLabelsColor={{ from: 'color' }}
                        arcLabelsSkipAngle={10}
                        arcLabelsTextColor="#fff"
                        legends={[
                            {
                                anchor: 'bottom',
                                direction: 'row',
                                translateY: 56,
                                itemWidth: 100,
                                itemHeight: 18,
                                symbolShape: 'circle',
                                itemTextColor: '#94a3b8',
                                effects: [{ on: 'hover', style: { itemTextColor: '#475569' } }],
                            },
                        ]}
                        tooltip={({ datum }) => (
                            <div className="bg-white border border-slate-100 rounded-xl shadow-md px-4 py-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: datum.color }} />
                                    <span className="font-medium text-slate-700 text-sm">{datum.label}</span>
                                </div>
                                <div className="text-xs text-slate-400 pl-4">
                                    {datum.value} appointments · {datum.data.percentage}%
                                </div>
                            </div>
                        )}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                        <div className="text-center">
                            <p className="text-base mb-1">No appointments found</p>
                            <p className="text-sm text-slate-300">No data available to display</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── ChartsSection — Main wrapper ─────────────────────────────────────────────

export default function ChartsSection({ data }) {
    const [timeFilter, setTimeFilter] = useState('all')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const selectedLabel = TIME_FILTER_OPTIONS.find(o => o.value === timeFilter)?.label

    return (
        <div className="bg-white rounded-2xl p-6 pb-0 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-medium text-slate-400 tracking-wide uppercase">
                    Appointments Analytics
                </h3>

                {/* Time Filter Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 text-sm text-slate-500 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors"
                    >
                        <span>{selectedLabel}</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-lg z-10 overflow-hidden">
                            {TIME_FILTER_OPTIONS.map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => { setTimeFilter(option.value); setIsDropdownOpen(false) }}
                                    className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                                        timeFilter === option.value
                                            ? 'bg-indigo-50 text-indigo-500'
                                            : 'text-slate-500 hover:bg-slate-50'
                                    }`}
                                >
                                    {option.value === timeFilter && (
                                        <span className="mr-2 text-indigo-400">·</span>
                                    )}
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isDropdownOpen && (
                <div className="fixed inset-0 z-5" onClick={() => setIsDropdownOpen(false)} />
            )}

            <Chart1 data={data} timeFilter={timeFilter} />
            <Chart2 data={data} timeFilter={timeFilter} />
        </div>
    )
}