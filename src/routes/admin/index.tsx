import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  EyeIcon,
  ClockIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useTRPC } from "~/trpc/react";
import { useAdminStore } from "~/stores/adminStore";

export const Route = createFileRoute("/admin/")({
  component: AdminPanel,
});

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

function AdminPanel() {
  const { token, isAuthenticated, login, logout } = useAdminStore();
  const [isVerifying, setIsVerifying] = useState(true);
  const trpc = useTRPC();

  // Verify token on mount
  const verifyToken = useQuery(
    trpc.verifyAdminToken.queryOptions({ token: token || "" }, {
      enabled: !!token,
      retry: false,
    })
  );

  useEffect(() => {
    if (token && verifyToken.data) {
      if (!verifyToken.data.valid) {
        logout();
        toast.error("Session expired. Please log in again.");
      }
      setIsVerifying(false);
    } else if (!token) {
      setIsVerifying(false);
    }
  }, [token, verifyToken.data, logout]);

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Verifying session...</div>
      </div>
    );
  }

  if (!isAuthenticated || (token && verifyToken.data && !verifyToken.data.valid)) {
    return <LoginForm onLogin={login} />;
  }

  return <AdminDashboard onLogout={logout} />;
}

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const trpc = useTRPC();
  const loginMutation = useMutation(trpc.adminLogin.mutationOptions());

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await loginMutation.mutateAsync(data);
      onLogin(result.token);
      toast.success("Successfully logged in!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h2>
            <p className="text-gray-600">Enter the admin password to continue</p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="Admin Password"
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errors.password.message}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
            >
              {loginMutation.isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'interactions' | 'queries' | 'preferences'>('overview');
  const trpc = useTRPC();

  // Fetch analytics data
  const analytics = useQuery(trpc.getAnalytics.queryOptions());
  const interactions = useQuery(trpc.getUserInteractions.queryOptions({ limit: 10 }));
  const queries = useQuery(trpc.getQueryLogs.queryOptions({ limit: 10 }));
  const preferences = useQuery(trpc.getUserPreferences.queryOptions({ limit: 10 }));

  const handleLogout = () => {
    onLogout();
    toast.success("Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-gray-600">Manage user interactions and insights</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200 bg-white rounded-t-2xl mt-6">
          <nav className="-mb-px flex space-x-2 p-2">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'interactions', name: 'User Interactions', icon: UsersIcon },
              { id: 'queries', name: 'Query Logs', icon: DocumentTextIcon },
              { id: 'preferences', name: 'User Preferences', icon: CogIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                } flex items-center px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab analytics={analytics.data} />}
        {activeTab === 'interactions' && <InteractionsTab data={interactions.data} />}
        {activeTab === 'queries' && <QueriesTab data={queries.data} />}
        {activeTab === 'preferences' && <PreferencesTab data={preferences.data} />}
      </div>
    </div>
  );
}

function OverviewTab({ analytics }: { analytics: any }) {
  if (!analytics) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <UsersIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-2xl font-bold text-gray-900">{analytics.totals.users}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <EyeIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Interactions</dt>
                  <dd className="text-2xl font-bold text-gray-900">{analytics.totals.interactions}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <DocumentTextIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Queries</dt>
                  <dd className="text-2xl font-bold text-gray-900">{analytics.totals.queries}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <ClockIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Response Time</dt>
                  <dd className="text-2xl font-bold text-gray-900">
                    {Math.round(analytics.performance.averageResponseTime)}ms
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg"></div>
            <span>Interaction Types</span>
          </h3>
          <div className="space-y-4">
            {analytics.interactionTypes.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-700">{item.type}</span>
                <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg"></div>
            <span>Popular Property Types</span>
          </h3>
          <div className="space-y-4">
            {analytics.propertyTypes.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <span className="font-medium text-gray-700">{item.type || 'Unknown'}</span>
                <span className="font-bold text-gray-900 bg-white px-3 py-1 rounded-lg">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InteractionsTab({ data }: { data: any }) {
  if (!data) {
    return <div>Loading interactions...</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg"></div>
          <span>Recent User Interactions</span>
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Page
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Property Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Success
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.interactions.map((interaction: any) => (
              <tr key={interaction.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {new Date(interaction.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {interaction.interactionType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {interaction.page || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {interaction.propertyType || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    interaction.success
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {interaction.success ? 'Success' : 'Failed'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function QueriesTab({ data }: { data: any }) {
  if (!data) {
    return <div>Loading queries...</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-purple-50">
        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg"></div>
          <span>Recent Query Logs</span>
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Query Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Response Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Success
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Category
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.queries.map((query: any) => (
              <tr key={query.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {new Date(query.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {query.queryType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {query.responseTime ? `${query.responseTime}ms` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    query.success
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {query.success ? 'Success' : 'Failed'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {query.category || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PreferencesTab({ data }: { data: any }) {
  if (!data) {
    return <div>Loading preferences...</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-green-50">
        <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg"></div>
          <span>User Preferences</span>
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Session ID
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Property Types
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Budget Range
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Visit Count
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Last Visit
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.preferences.map((pref: any) => (
              <tr key={pref.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                  {pref.sessionId.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {pref.preferredPropertyTypes.join(', ') || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {pref.budgetRange || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {pref.visitCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {new Date(pref.lastVisit).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
