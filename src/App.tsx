import { useEffect, useState } from 'react';
import axios from 'axios';
import { ArrowRight, LayoutDashboard, Loader2, RefreshCw } from 'lucide-react';

interface JourneyStep {
  source: string;
  medium: string;
  campaign: string;
  created_at: string;
}

interface GroupedJourney {
  id: string;
  path: JourneyStep[];
  quantity: number;
  touchpoints: number;
}

interface ApiResponse {
  message: string;
  result: boolean;
  data: GroupedJourney[];
}

const getChannelStyle = (source: string) => {
  const s = source.toLowerCase().trim();
  if (s.includes('google')) return 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-100';
  if (s.includes('facebook') || s.includes('instagram')) return 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-100';
  if (s.includes('organic') || s.includes('organico')) return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100';
  if (s.includes('direct') || s.includes('site')) return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-100';
  if (s.includes('mail')) return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100';
  return 'bg-gray-50 text-gray-600 border-gray-200 ring-gray-100';
};

export default function App() {
  const [journeys, setJourneys] = useState<GroupedJourney[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>('http://localhost:3000/journeys');
      
      if (response.data.result) {
        const data = response.data.data;
        setJourneys(data);

      }
    } catch (error) {
      console.error( error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Nemu Dashboard</h1>
          </div>
          <button 
            onClick={fetchData}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
            title="Atualizar dados"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-800">Atribuição de Jornadas</h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-slate-500 text-sm font-medium">Processando dados...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                    <th className="px-6 py-4 w-[50%]">Jornada</th>
                    <th className="px-6 py-4 text-center">Qtd. Vendas</th>
                    <th className="px-6 py-4 text-center">Touchpoints</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {journeys.map((row) => {
                    return (
                      <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center flex-wrap gap-y-2">
                            {row.path.map((step, idx) => (
                              <div key={idx} className="flex items-center">
                                <span 
                                  className={`
                                    px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border shadow-sm
                                    ${getChannelStyle(step.source)}
                                  `}
                                >
                                  {step.source}
                                </span>
                                {idx < row.path.length - 1 && (
                                  <ArrowRight className="w-3 h-3 text-slate-300 mx-1.5 shrink-0" />
                                )}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-slate-800 tabular-nums">
                          {row.quantity}
                        </td>

                        <td className="px-6 py-4 text-center text-slate-500 tabular-nums font-medium">
                          {row.touchpoints}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {journeys.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  Nenhuma jornada encontrada.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}