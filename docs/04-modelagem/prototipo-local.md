# Protótipo local do TechFix

Endereço da demonstração: [http://localhost:5173](http://localhost:5173). Confirmado pela equipe em 18/11/2026: a apresentação é local, sem URL pública de hospedagem.

Na raiz do repositório, com Node e npm instalados:

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Abrir o endereço no mesmo computador. A opção `--strictPort` impede troca silenciosa de porta caso 5173 esteja ocupada. Acesso de demonstração: `admin` / `admin`.

## Fluxo para a AS

1. Entrar no sistema.
2. Cadastrar um cliente fictício com os campos solicitados pela interface.
3. Cadastrar um notebook ou desktop vinculado a esse cliente.
4. Abrir uma ordem de serviço selecionando esse cliente e equipamento.
5. Localizar a OS e consultar seus detalhes.
6. Explicar a RN1 e as limitações registradas na A13; apresentar o modelo planejado de garantia, sem afirmar que a RN2 já está implementada.

Os dados ficam no navegador. O login é demonstrativo; não atende ao RNF2 no servidor. O Java de POO usa seu próprio arquivo TSV e não se comunica com a interface. O identificador da OS no site não comprova a numeração sequencial exigida em CA04. Um navegador diferente pode não ter os mesmos dados.

[Código do protótipo na release AS](https://github.com/ArthurScharfenberger/TechFix-Assistencia-Tecnica/tree/v2.0.0/src). O link do código permite obter o projeto, mas a execução exige os comandos acima.
