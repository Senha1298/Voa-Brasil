import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, QrCode, Clock } from "lucide-react";
import Header from "@/components/Header";
import { useLocation } from "wouter";
import QRCode from "qrcode";

interface PixData {
  success: boolean;
  transaction_id: string;
  order_id: string;
  amount: number;
  status: string;
  created_at: string;
  pix_code: string;
  qr_code_image: string;
}

interface UserData {
  nome: string;
  cpf: string;
  email: string;
  phone: string;
}

export default function PixPayment() {
  const [, setLocation] = useLocation();
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [error, setError] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    createPixTransaction();
  }, []);

  const createPixTransaction = async () => {
    setLoading(true);
    setError(null);

    try {
      const storedData = localStorage.getItem('userData');
      if (!storedData) {
        setError("Dados do usuário não encontrados");
        return;
      }

      const userData: UserData = JSON.parse(storedData);
      
      const response = await fetch('/api/create-pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 64.80,
          customer_name: userData.nome,
          customer_email: userData.email,
          customer_phone: userData.phone,
          customer_cpf: userData.cpf
        })
      });

      const data = await response.json();

      if (data.success) {
        setPixData(data);
        // Generate QR code from PIX code
        if (data.pix_code) {
          try {
            const qrDataUrl = await QRCode.toDataURL(data.pix_code, {
              width: 256,
              margin: 2,
              color: {
                dark: '#000000',
                light: '#FFFFFF'
              }
            });
            setQrCodeDataUrl(qrDataUrl);
          } catch (qrError) {
            console.error("Erro ao gerar QR code:", qrError);
          }
        }
      } else {
        setError(data.error || "Erro ao gerar PIX");
      }
    } catch (error) {
      console.error("Erro ao criar transação PIX:", error);
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  const copyPixCode = async () => {
    if (!pixData?.pix_code) return;

    try {
      await navigator.clipboard.writeText(pixData.pix_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Gerando PIX...</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-xl mx-auto">
            <CardHeader className="text-center space-y-2 pb-6 border-b">
              <CardTitle className="text-2xl font-bold text-red-600">
                Erro no Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-semibold text-blue-900 mb-2">O que fazer:</h4>
                  <ul className="text-sm text-blue-800 text-left space-y-1">
                    <li>• Verifique seus dados e tente novamente</li>
                    <li>• Entre em contato com o suporte se o problema persistir</li>
                    <li>• Alternativamente, use outro método de pagamento</li>
                  </ul>
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="flex-1 bg-[#1351B4] hover:bg-[#1351B4]/90 text-white"
                  >
                    Tentar Novamente
                  </Button>
                  <Button 
                    onClick={() => setLocation('/pagamento')} 
                    variant="outline"
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto shadow-lg border-0">
          <CardHeader className="text-center space-y-2 pb-6 border-b">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Pagamento PIX
            </CardTitle>
            <p className="text-gray-600">
              Taxa de Adesão ANAC - Programa Voa Brasil
            </p>
          </CardHeader>

          <CardContent className="pt-6">
            {/* Timer */}
            <div className="mb-6">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="flex justify-center mb-3">
                  <div className="bg-yellow-500 text-white px-4 py-2 rounded-full font-bold text-xl flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </div>
                </div>
                <p className="text-yellow-800 text-center font-medium">
                  Tempo limite para pagamento
                </p>
              </div>
            </div>

            {/* Amount */}
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-green-600">
                R$ {pixData?.amount?.toFixed(2).replace('.', ',') || '64,80'}
              </p>
              <p className="text-gray-600">Valor a ser pago</p>
            </div>

            {/* QR Code */}
            <div className="text-center mb-6">
              {qrCodeDataUrl ? (
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                  <img 
                    src={qrCodeDataUrl}
                    alt="QR Code PIX"
                    className="w-48 h-48"
                  />
                </div>
              ) : pixData?.pix_code ? (
                <div className="bg-white p-8 rounded-lg border-2 border-gray-200 inline-block">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Gerando QR Code...</p>
                </div>
              ) : (
                <div className="bg-white p-8 rounded-lg border-2 border-gray-200 inline-block">
                  <QrCode className="w-32 h-32 text-gray-400 mx-auto" />
                </div>
              )}
              <p className="text-sm text-gray-600 mt-2">
                {qrCodeDataUrl || pixData?.pix_code
                  ? "Escaneie o QR Code com o app do seu banco"
                  : "Use o código PIX abaixo no seu aplicativo bancário"
                }
              </p>
            </div>

            {/* PIX Code */}
            {pixData?.pix_code && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Código PIX Copia e Cola:
                </p>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg border font-mono text-sm break-all max-h-24 overflow-y-auto">
                    {pixData.pix_code}
                  </div>
                  <Button
                    onClick={copyPixCode}
                    className="w-full flex items-center justify-center gap-2 bg-[#1351B4] hover:bg-[#1351B4]/90 text-white"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copiado!" : "Copiar Código PIX"}
                  </Button>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">Como pagar:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Abra o aplicativo do seu banco</li>
                <li>2. Acesse a opção PIX</li>
                <li>3. Escaneie o QR Code ou cole o código PIX</li>
                <li>4. Confirme o pagamento de R$ 64,80</li>
              </ol>
            </div>

            {/* Transaction Info */}
            {pixData && (
              <div className="border-t pt-4">
                <p className="text-xs text-gray-500">
                  ID da Transação: {pixData.transaction_id}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}