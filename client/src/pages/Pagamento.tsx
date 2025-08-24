import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

interface UserData {
  nome: string;
  cpf: string;
  email: string;
  phone: string;
}

export default function Pagamento() {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handlePaymentClick = () => {
    // Navigate to PIX payment page
    window.location.href = '/pix-payment';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto shadow-lg border-0">
          <CardHeader className="text-center space-y-2 pb-6 border-b">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Finalizar Cadastro
            </CardTitle>
            <p className="text-gray-600">
              Programa Voa Brasil
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="mb-8">
              <div className="space-y-4 mb-8">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex justify-center mb-3">
                    <div className="bg-yellow-500 text-white px-4 py-2 rounded-full font-bold text-xl">
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </div>
                  </div>
                  <p className="text-yellow-800 text-center font-medium">
                    Atenção: Sua vaga está reservada temporariamente
                  </p>
                  <p className="text-yellow-700 text-sm text-center mt-2">
                    Complete o pagamento antes que o tempo expire ou sua vaga será disponibilizada para outro cidadão
                  </p>
                </div>

                <div className="flex items-center gap-2 p-4 bg-red-50 rounded-lg border border-red-100">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
                  <p className="text-red-800 text-sm">
                    <strong>Importante:</strong> O não pagamento resultará na perda permanente do direito ao programa e sua vaga será imediatamente liberada para outro cidadão na fila de espera
                  </p>
                </div>
              </div>

              <Button 
                className="w-full bg-green-600 hover:bg-green-700 text-white py-7 text-lg font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={handlePaymentClick}
              >
                Pagar Taxa de Adesão ANAC
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}