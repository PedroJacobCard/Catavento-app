function PrivacyPolicy() {
  return (
    <div className="flex items-center justify-center w-full h-[100vh] dark:bg-darkModeBgColor bg-primaryBlue">
      <div className="flex-col p-5 gap-3 w-[50vw] h-[80vh] dark:bg-darkMode bg-secondaryBlue shadow-md rounded-md">
        <h1>Política de Privacidade</h1>

        <p>Última atualização: 23 de junho de 2025</p>

        <h2>1. Quem somos</h2>
        <p>O Catavento é um projeto da MPC Goiânia com foco em apoio educacional baseado em valores fundamentais. Esta política descreve como tratamos suas informações no nosso aplicativo web.</p>

        <h2>2. Informações que coletamos</h2>
        <p>Coletamos seu nome e endereço de e-mail fornecidos pela conta Google usada no login via OAuth. Nenhuma outra informação é coletada sem o seu consentimento.</p>

        <h2>3. Como usamos suas informações</h2>
        <ul>
          <li>Para autenticar seu acesso ao aplicativo</li>
          <li>Para exibir conteúdo personalizado</li>
          <li>Para permitir o gerenciamento interno do seu perfil</li>
        </ul>

        <h2>4. Compartilhamento de informações</h2>
        <p>Não compartilhamos suas informações pessoais com terceiros. Seus dados são usados apenas internamente no projeto Catavento.</p>

        <h2>5. Segurança</h2>
        <p>Tomamos medidas razoáveis para proteger seus dados contra acesso não autorizado. Utilizamos HTTPS e práticas de segurança padrão do setor.</p>

        <h2>6. Seus direitos</h2>
        <p>Você pode solicitar a exclusão dos seus dados entrando em contato conosco. Também pode revogar o acesso do app à sua conta Google a qualquer momento.</p>

        <h2>7. Contato</h2>
        <p>Para dúvidas sobre esta política, entre em contato conosco via e-mail: <a href="mailto:pedrojacob05cardoso@gmail.com">pedrojacob05cardoso@gmail.com</a>.</p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
