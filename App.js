
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function App() {
  const [tempoParado, setTempoParado] = useState(0);
  const [producaoEstimada, setProducaoEstimada] = useState(0);
  const [probabilidade, setProbabilidade] = useState(0);
  const [historico, setHistorico] = useState([]);
  const [minutos, setMinutos] = useState('');

  const fetchData = async () => {
    const status = await fetch('http://localhost:8000/turno').then(res => res.json());
    const hist = await fetch('http://localhost:8000/historico').then(res => res.json());
    setTempoParado(status.tempo_parado);
    setProducaoEstimada(status.producao_estimada);
    setProbabilidade(status.probabilidade);
    setHistorico(hist);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const registrarParada = async () => {
    if (!minutos) return;
    await fetch('http://localhost:8000/paradas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutos: parseInt(minutos) })
    });
    setMinutos('');
    fetchData();
  };

  return (
    <div className="p-4 font-sans text-center">
      <h1 className="text-3xl font-bold mb-4">Monitoramento de Produção</h1>
      <div className="flex justify-around my-4">
        <div className="bg-blue-100 p-4 rounded-xl shadow-md w-1/4">
          <p className="text-xl">Tempo parado</p>
          <p className="text-2xl font-bold">{tempoParado} min</p>
        </div>
        <div className="bg-green-100 p-4 rounded-xl shadow-md w-1/4">
          <p className="text-xl">Produção estimada</p>
          <p className="text-2xl font-bold">{producaoEstimada} peças</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl shadow-md w-1/4">
          <p className="text-xl">Probabilidade</p>
          <p className="text-2xl font-bold">{probabilidade}%</p>
        </div>
      </div>
      <div className="my-4">
        <input
          value={minutos}
          onChange={e => setMinutos(e.target.value)}
          type="number"
          placeholder="Minutos de parada"
          className="border px-3 py-1 rounded mr-2"
        />
        <button onClick={registrarParada} className="bg-blue-600 text-white px-4 py-1 rounded">Registrar</button>
      </div>
      <div className="my-6 w-3/4 mx-auto">
        <Line
          data={{
            labels: historico.map((h, i) => `#${i + 1}`),
            datasets: [{
              label: 'Paradas (min)',
              data: historico.map(h => h.minutos),
              backgroundColor: 'rgba(255,99,132,0.5)',
              borderColor: 'rgba(255,99,132,1)'
            }]
          }}
        />
      </div>
    </div>
  );
}

export default App;
