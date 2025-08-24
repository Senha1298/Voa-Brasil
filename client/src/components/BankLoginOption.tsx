export default function BankLoginOption() {
  return (
    <div className="item-login-signup-ways">
      <button 
        type="button" 
        tabIndex={5} 
        className="button-href-mimic2 bank-login-button"
      >
        <img 
          src="https://sso.acesso.gov.br/assets/govbr/img/icons/InternetBanking-green.png" 
          alt="Ícone de Internet Banking"
        />
        Login com seu banco
        <span className="silver-account-badge">
          SUA CONTA SERÁ PRATA
        </span>
      </button>
    </div>
  );
}