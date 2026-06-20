import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FileText,
  Download,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  ArrowUpDown,
} from 'lucide-react';
import { fetchSubscriptionInvoices } from '../../../redux/apiCalls/subscriptionCallApi';

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  active: {
    label: 'Active',
    icon: CheckCircle,
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    className: 'bg-rose-50 text-rose-600 ring-1 ring-rose-200',
    dot: 'bg-rose-500',
  },
  failed: {
    label: 'Failed',
    icon: AlertCircle,
    className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    dot: 'bg-amber-500',
  },
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
    dot: 'bg-sky-500',
  },
};

const getStatus = (key) =>
  STATUS_CONFIG[key?.toLowerCase()] || STATUS_CONFIG.pending;

// ── StatusBadge ────────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = getStatus(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ── InvoiceRow ─────────────────────────────────────────────────────────────────
const InvoiceRow = ({ invoice, index }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Main row */}
      <tr
        className={`group transition-colors duration-150 cursor-pointer
          ${expanded ? 'bg-indigo-50/60' : 'hover:bg-gray-50'}
          ${index % 2 === 0 ? '' : 'bg-gray-50/40'}`}
        onClick={() => setExpanded((p) => !p)}
      >
        {/* # */}
        <td className="px-5 py-3.5 text-sm text-gray-400 font-mono w-12">
          #{invoice.id}
        </td>

        {/* Plan */}
        <td className="px-5 py-3.5">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">
              {invoice.plan_name}
            </span>
            <span className="text-xs text-gray-400 capitalize">
              {invoice.billing_cycle}
            </span>
          </div>
        </td>

        {/* Date */}
        <td className="px-5 py-3.5 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {invoice.start_date}
          </div>
        </td>

        {/* Amount */}
        <td className="px-5 py-3.5">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-800">
              {parseFloat(invoice.amount_paid).toFixed(2)}{' '}
              <span className="text-xs font-normal text-gray-400">
                {invoice.currency}
              </span>
            </span>
            {invoice.plan_price !== invoice.amount_paid && (
              <span className="text-xs text-gray-400 line-through">
                {parseFloat(invoice.plan_price).toFixed(2)}
              </span>
            )}
          </div>
        </td>

        {/* Gateway */}
        <td className="px-5 py-3.5">
          <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full capitalize">
            <CreditCard className="w-3 h-3" />
            {invoice.gateway}
          </span>
        </td>

        {/* Status */}
        <td className="px-5 py-3.5">
          <StatusBadge status={invoice.status} />
        </td>

        {/* Expand toggle */}
        <td className="px-5 py-3.5 text-right">
          <button
            className="p-1.5 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((p) => !p);
            }}
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </td>
      </tr>

      {/* Expanded details row */}
      {expanded && (
        <tr className="bg-indigo-50/40 border-t border-indigo-100">
          <td colSpan={7} className="px-5 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
              <Detail label="Order ID" value={invoice.order_id || '—'} mono />
              <Detail
                label="Subscription ID"
                value={invoice.subscription_id || '—'}
                mono
              />
              <Detail
                label="Auto Renew"
                value={invoice.auto_renew ? 'Yes' : 'No'}
              />
              <Detail
                label="Trial Ends"
                value={invoice.trial_ends_at || 'No Trial'}
              />
              <Detail label="End Date" value={invoice.end_date} />
              <Detail
                label="Payment Method"
                value={invoice.payment_method || 'N/A'}
              />
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const Detail = ({ label, value, mono = false }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
      {label}
    </span>
    <span
      className={`text-gray-700 break-all ${
        mono ? 'font-mono text-xs' : 'text-sm'
      }`}
    >
      {value}
    </span>
  </div>
);

// ── Summary cards ──────────────────────────────────────────────────────────────
const SummaryCard = ({ label, value, sub, color }) => (
  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col gap-1">
    <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
      {label}
    </span>
    <span className={`text-2xl font-bold ${color ?? 'text-gray-800'}`}>
      {value}
    </span>
    {sub && <span className="text-xs text-gray-400">{sub}</span>}
  </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Subscription_Invoices() {
  const dispatch = useDispatch();
  const { invoices, loading, error } = useSelector(
    (state) => state.subscription
  );

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortDir, setSortDir] = useState('desc'); // 'asc' | 'desc'

  useEffect(() => {
    dispatch(fetchSubscriptionInvoices());
  }, [dispatch]);

const list = Array.isArray(invoices) 
  ? invoices 
  : Array.isArray(invoices?.invoices) 
    ? invoices.invoices 
    : [];
  // ── derived stats ────────────────────────────────────────────────────────────
  const totalPaid = list
    .reduce((acc, i) => acc + parseFloat(i.amount_paid || 0), 0)
    .toFixed(2);

  const activeCount = list.filter(
    (i) => i.status?.toLowerCase() === 'active'
  ).length;

  const cancelledCount = list.filter(
    (i) => i.status?.toLowerCase() === 'cancelled'
  ).length;

  const failedCount = list.filter(
    (i) => i.status?.toLowerCase() === 'failed'
  ).length;

  // ── filter + search + sort ───────────────────────────────────────────────────
  const filtered = list
    .filter((i) => {
      const matchStatus =
        statusFilter === 'all' ||
        i.status?.toLowerCase() === statusFilter;
      const matchSearch =
        search.trim() === '' ||
        i.plan_name?.toLowerCase().includes(search.toLowerCase()) ||
        (i.order_id ?? '').toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    })
    .sort((a, b) => {
      const da = new Date(a.start_date);
      const db = new Date(b.start_date);
      return sortDir === 'desc' ? db - da : da - db;
    });

  // ── loading / error states ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="text-sm">Loading invoices…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-rose-500">
        <AlertCircle className="w-8 h-8" />
        <span className="text-sm font-medium">{error}</span>
        <button
          onClick={() => dispatch(fetchSubscriptionInvoices())}
          className="mt-2 px-4 py-2 text-sm bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* ── Header ── */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Subscription Invoices
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            View and manage your billing history
          </p>
        </div>
        <button
          onClick={() => dispatch(fetchSubscriptionInvoices())}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-gray-600"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <SummaryCard
          label="Total Invoices"
          value={list.length}
          sub="All time"
          color="text-gray-800"
        />
        <SummaryCard
          label="Total Paid"
          value={`$${totalPaid}`}
          sub="USD"
          color="text-indigo-600"
        />
        <SummaryCard
          label="Cancelled"
          value={cancelledCount}
          color="text-rose-500"
        />
        <SummaryCard
          label="Failed"
          value={failedCount}
          color="text-amber-500"
        />
      </div>

      {/* ── Filters bar ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-4 px-4 py-3 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search plan or order ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400" />
          {['all', 'active', 'cancelled', 'failed', 'pending'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Sort toggle */}
        <button
          onClick={() => setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors ml-auto"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          {sortDir === 'desc' ? 'Newest first' : 'Oldest first'}
        </button>
      </div>

      {/* ── Table ── */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
          <FileText className="w-10 h-10" />
          <p className="text-sm font-medium">No invoices match your filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    #
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Plan
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Gateway
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((invoice, i) => (
                  <InvoiceRow key={invoice.id} invoice={invoice} index={i} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-400">
            Showing {filtered.length} of {list.length} invoices
          </div>
        </div>
      )}
    </div>
  );
}