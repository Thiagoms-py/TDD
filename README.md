# Sistema de reservas de propriedades

Projeto de estudo em TypeScript para criar e cancelar reservas de propriedades. Nesta atividade, adicionamos testes para verificar as conversões de dados, a criação de usuários e propriedades e as regras de cancelamento.

## O que foi testado

- **Mappers de Property e Booking:** conversão das entidades do banco para os objetos de domínio (`toDomain`) e o caminho de volta (`toPersistence`). Também verificamos os erros quando faltam campos obrigatórios.
- **Criação de usuários (`POST /users`):** criação com sucesso e retorno de erro 400 com a mensagem `O campo nome é obrigatório.` quando o nome está vazio.
- **Criação de propriedades (`POST /properties`):** criação com sucesso e validação de nome vazio, capacidade zero ou negativa e preço por noite ausente, zero ou negativo.
- **Políticas de reembolso:** reembolso total para mais de 7 dias de antecedência, parcial de 50% entre 1 e 7 dias e nenhum reembolso para menos de 1 dia. Os limites de 1 e 7 dias também foram verificados.
- **Cancelamento de reserva inexistente:** retorno do erro `Reserva não encontrada.` no serviço de reservas.

## Como executar

Com Node.js e npm instalados, abra o terminal na pasta do projeto e instale as dependências:

```bash
npm ci
```

Os testes usam SQLite em memória por meio do `sql.js`, junto com o TypeORM. O `sql.js` executa por WebAssembly, então não é preciso instalar SQLite, Python ou ferramentas de C++ no computador. Ao atualizar uma cópia antiga do projeto, execute `npm ci` novamente para substituir as dependências anteriores.

Para executar todos os testes:

```bash
npm test -- --runInBand
```

A opção `--runInBand` executa os arquivos de teste em sequência.

Para executar apenas um arquivo, informe o caminho dele. Por exemplo, para testar a criação de propriedades:

```bash
npm test -- --runInBand src/infrastructure/web/property_controller_e2e.test.ts
```

Para executar somente os testes dos mappers:

```bash
npm test -- --runInBand src/infrastructure/persistence/mappers
```

No PowerShell, se o comando `npm` for bloqueado pela política de scripts, use `npm.cmd` no lugar de `npm`.

## TDD na atividade

Primeiro escrevemos os testes e executamos para identificar o que ainda faltava implementar. Depois adicionamos os métodos de criação, os controllers e a validação do preço por noite, executando novamente os testes para conferir o resultado.

As regras que já existiam, como a fábrica de reembolso e o erro de reserva inexistente, foram verificadas pelos testes sem precisar alterar sua implementação.

Na última execução, os 69 testes das 16 suítes passaram, incluindo os testes que já existiam no projeto.
