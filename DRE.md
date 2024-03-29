#Diagrama de relacionamento de entidades

![Diagrama de relacionamento de entidades](./public/images/diagram.png)

#Descrição

Este app existe para facilitar a organização dos grupos que participam do projeto Catavento da MPC Brasil. O app possibilita uma melhor visualização dos temas desenvolvidos nas diferentes escolas que foram adotadas por algum grupo, assim como a visualização de eventos que são integrados com o Google Agenda API e relacionamento entre os integrantes de um grupo por meio de lembretes.

O app funciona basicamente tendo a escola e turno como base para o relacionamento entre os usuários. Dessa forma, o Coordenador de cada grupo interage com dados de seus liderados de acordo com a escola e turno que eles participam.



#Entidade Usuário (User):

No app é possível terquatro tipos de usuários, dependendo da escolha na hora do registro que, além de ser um registro personalisado, a autenticação é feita com o Google para melhor performance no fluxo de dados através da aplicação e segurança. 

###Os três tipos de usuários são:

- Coordenador(a) Geral;
- Coordenador(a);
- Secretário(a)
- Voluntário(a)


O usuário tem relacionamento com a enumeração "Papel" como de um para um, pois o usuário pode ter somente um papel.

O usuário tem um atributo escola que é um array de strings. Quando o usuário entra em seu dashboard, ele terá os dados das escolas das quais os nomes estão em seu atributo "escola".

O usuário tem relcionamento com a enumeração "Turno" de um para muitos, pois um usuário pode trabalhar em diferentes turnos na mesma ou diferente escola.

O usuário tem relacionamento com a entidade "lembretes" como de um para muitos, pois um usário pode criar vários lembretes.

O usuário tem relacionamento com a entidade "Conta" como de um para muitas, pois um usário pode criar várias se é que ele tenha diferentes emails, pois o campo email é único, fora isso, pode criar somente uma conta.

O usuário tem relacionamento com a entidade "Seções" como de um para muitas, pois um usário pode criar várias seções ao logar no app.

Se o usuário for Coordenador, Secretário ou Coordenador geral, ele tem o relacionamento com a entidade "Eventos" de um para muitos, pois ele pode criar vários eventos.

Se o usuário for Coordenador, Secretário ou Coordenador geral, ele tem o relacionamento com a entidade "Relatórios" de um para muitos, pois ele pode criar vários relatórios.

O usuário tem o relacionamento com a entidade "Atenticador" e "Verificador De Token" como de um para um.


##Coordenador(a) Geral:

O coordenador geral, no conceito de CRUD, pode ler todos os dados gerados pelos grupos dos quais ele (ou ela), coordena. 

O coordenador geral visualiza o mesmo dashboard que os outros usuários, mas com a adição de todas as ecolas e grupos dessas escolas dos quais ele (ou ela) coordena. Ele as visualiza de forma como de uma cascata, em que estará separado os dados de escola por escola. O coordenador geral pode também atualizar seu perfil, como também criar, atualizar ou deletar lembretes próprios nos campos dos grupos que trabalham em escolas diferentes e, criar, atualizar ou deletar eventos.

O coordenadro geral visualiza duas tabelas diferentes. Uma tabela com os dados referentes as escolas como quais temas foram trabalhados, quais faltam ser trabalhados,  quantos alunos completaram os temas e quantos precisam completar. A segunda tabela contém o nome dos usuários que fazem parte das escols que o coodenador geral coordena, seus papeis e email de contato. Ambas as tabelas podem ser baixadas como arquivo XLSX (Exel).

Quando o coordenador geral se registra, ele vê uma interface exclusiva em que são renderizadas todas as escolas que foram registradas pelos coordenadores dos diversos grupos existentes.


##Coordenador(a):

O coordenador, no conceito de CRUD, poder ler todos dados gerados pelo grupo específico que ele (ou ela) lidera. 

O coordenador visualiza o mesmo dashboard que os outros usuários, mas ele pode criar, atualizar ou deletar eventos, pode criar, atualizar ou deletar uma classe específica, pode criar atualizar ou deletar lembretes, pode criar, atualizar ou deletar seu perfil.

Quando o coordenador se registra, ele tem a responsibilidade de registrar também a escola e o turno em que ele coordena, podendo registrar mais de uma escola. Com isso os outros usuáios poderam escolher de quais escolas e turnos participar.


##Secretário:

O secretário tem as mesmas funionalidades no app que o coordenador. Sua existência serve como apoio ao coordenador para ajudá-lo nos registros e relatórios.


##Voluntário:

O voluntário, no conceito de CRUD, pode ler todos os dados gerdos pelo grupo específico que ele (ou ela) participa. 

O voluntário visualiza o mesmo dashboard que os outros usuários, mas ele só pode criar, atualizar ou deletar os lembretes que o pertencem.

O voluntário pode participar de várias escolas e turnos, por isso ele terá no seu dashboard a possibilidade de ler os dados dessas escolas e turnos como uma cascata em que estaram organizadas escola por escola.

Ao se registrar, o voluntário verá todos os nomes das escolas e respectivos turnos registrados pelos coordenadores para que escolha aqueles dos quais ele participa.


#Entidade Escola (School):

Como mencionado previamente, a entidade "Escola" tem existência fudamental para a aplicação. Por meio da entidade "Escola" os usuários do app interagem entre si, podendo ler, criar, atualizar e deletar dados de acordo com a escola e turno em que trabalham.

A entidade "Escola" tem relacionamento com a enumeração "Turno" como de um para muitos, pois cada escola pode ter mais de um turno de programação do catavento.

Obs.: A entidade escola não pode ser tomada como generalizada em suas esferas de programações. Toda referência à entidade escola está limitada ao momento do trabalho catavento.


#Entidade Lembrete (Remember):

A entidade "Lembrete" existe para uma comunicação entre os integrantes de determinado grupo como um chat, mas serve apenas para algumas observações e não com uma dependência de fluxo de dados tão excessiva como de um chat. 

A entidade "Lembrete" tem relacionamento com a entidade "Usuário" de muitos para um, pois vários lembretes podem ser criados por um único autor.

A entidade "Lembrete" tem relacionamento com a enumeração "Turno" de um para um, pois um único usuário pode trabalhar em divérsos turnos, então seus lemretes serão apresentados de acordo com a escola e turno que ele participa.

A entidade "Lembrete" tem relacionamento com a entidade "Escola" de um para um, pois cada lembrete precisa ser identificado com uma escola e turno específico para ser apresentado aos usuários separadamente.


#Entidade Classe (Class):

A entidade classe foi pensada para exirtir como várias cópias do que no mundo real só existe uma. 

No catavento existem vários temas que são trabalhados. Esses temas não são criados aleatoriamente pois já foram previamente planejados e criados. Com isso, sabendo que esses temas são estaticos na mundo real, eles também serão tratados como estaticos na aplicação uma vez que o coordenador não precisa lidar com esses temas como um objeto.

Portanto, é por bem que as classes sejam criadas dinamicamente como um objeto pelos coordenadores. A entidade "Classe" tem relacionamento com a enumeração "Tema" como de um para um, pois podem existir várias cópias de uma classe, como por exemplo "6°A", mas cada cópia contém um único tema, assim o dashboard de temas poderá ser osganizado por temas e, em cada campo de tema, terá uma cópia de uma classe para ser computada ao decorrer de que os temas são desenvolvidos.

A entidade "Classe" tem relacionamento com a entidade "Escola" como de um para um, pois pelo atributo "escola", as divérsas cópias de uma classe serão apresentadas aos usuários que participam da mesma escola.

A entidade "Classe" tem relacionamento com a enumeração "Turno" como de um para um, para ser distinguida entre as outras cópas da mesma escola.


#Entidade Relatório (Report):

A entidade "Relatório" existe para que os coordenadores gerais possam ter um parecer sobre o andamento dos temas realizados e como foi o acompanhamento capelão.

A entidade "Relatório" pode ser criada somente pelo coordenador ou secretário. 

A entidade "Relatório" será visualizada somente pelo Coordenador geral, o qual terá a listagem de todos os relatórios das escolas que ele acompanha.

A entidade "Relatório" tem relacionamento com a entidade "Usuário" como de muitos para um pois vários relatórios podem ser criados com o nome de um usuário específico e o nome da escola que esse usuário participa.

A entidade "Relatório" tem relacionamento com a enumeração "Atividades" como de um para muitos pois é necessário listar as atividades cumpridas.

A entidade "Relatório" tem relacionamento com a enumeração "Temas" como de um para um, pois por meio do tema específico o coordenador geral terá melhor organização.

A entidade "Relatório" tem relacionamento com a enumeração "Recursos" como de um para muitos, pois pode haver vários recursos utilizados na realização dos temas.

A entidade "Relatório" tem relacionamento com a enumeração "Turnos" como de um para um, pois por meio do turno específico, o coordenador geral terá melhor organização.

A entidade "Relatório" tem relacionamento com a entidade "Escola" como de um para um, pois por meio de uma escola específica, o coordenador geral conseguirá saber de qual escola vem o relatório.


#Observações

Cada instância da entidade "Evento" terá um tempo de vida de até um dia depois da data de encerramento.

Cada instância da entidade "Lembrete" terá um tempo de vida de uma semana.

Cada instância da entidade "Relatório" terá um tempo de vida de três meses.