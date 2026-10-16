# Dani Neia Estética

Site completo, estático e sem dependências de execução. HTML, CSS e JavaScript separados; fotos reais com versões aprimoradas por edição assistida, otimizadas em WebP. A prévia está hospedada de forma privada no ChatGPT.

## Abrir e executar

1. Extraia o ZIP.
2. Abra `index.html` no navegador. O site e as interações principais funcionam sem instalação.
3. Para trabalhar em um endereço local, execute `python3 -m http.server 8080` dentro da pasta e abra `http://localhost:8080`. No Windows, também pode usar `py -m http.server 8080` ou a extensão Live Server.

O formulário, quando ativado, deve ser testado em um endereço HTTP/HTTPS; serviços externos podem recusar páginas abertas como `file://`.

## Configurar

Os contatos e opções estão em `js/config.js`.

- `instagram`: perfil público da Dani.
- `whatsapp`: número confirmado (44) 99938-2535, com país e DDD. Todos os botões de contato abrem diretamente o WhatsApp.
- `whatsappMessages`: mensagens prontas por contexto: contato geral, agendamento, cuidados faciais, corporais, massagens/drenagens e laser. A mensagem só é enviada se a pessoa confirmar no WhatsApp.
- `address` e `mapQuery`: endereço e busca do mapa. Se o endereço mudar, ajuste também os textos de localização no HTML e o endereço estruturado em `scripts/build.mjs`.
- `formEmail`: formulário opcional. Vazio mantém o formulário oculto e prioriza o contato direto, conforme o briefing. Um e-mail válido ativa a seção sem outra mudança no código.
- `canonicalUrl`: endereço HTTPS definitivo, com barra final. Necessário para preparar compartilhamento social e retorno do formulário para `obrigado.html`.

Os textos de apresentação e serviços estão no HTML. A aparência está em `css/styles.css`; as interações, em `js/app.js`.

## Formulário opcional por e-mail

1. Defina o e-mail real em `formEmail` e a URL pública em `canonicalUrl`.
2. Publique a pasta preparada e faça um envio de teste autorizado.
3. O responsável pelo e-mail precisa concluir a ativação solicitada pelo FormSubmit. Não declare a integração operacional antes dessa confirmação e de um teste de recebimento.

O formulário usa POST nativo para FormSubmit, valida campos, aplica máscara de telefone brasileiro, oferece seletor nativo acessível e informa o encaminhamento para a confirmação do serviço. CAPTCHA permanece ativo. O serviço externo controla sucesso e erros de entrega; o código não simula uma resposta de sucesso. Com a URL configurada, o retorno aponta para `obrigado.html`. Essa página não comprova recebimento por si só. Nenhuma mensagem foi enviada durante a implementação.

## Preparar e publicar por conta própria

Node 18 ou superior é necessário apenas para a preparação automatizada; não é necessário `npm install`.

```bash
npm run check
npm run build
```

Para preparar os metadados com a URL definitiva:

```bash
node scripts/build.mjs --url=https://SEU-ENDERECO/
```

Use seu endereço real no lugar do exemplo. O comando gera a pasta `dist/` com os arquivos públicos, metadados estáticos para compartilhamento e, quando há URL, sitemap. Não publique README, documentos internos ou as imagens de análise. A pasta `dist/` já está incluída para facilitar o primeiro uso, mas deve ser regenerada após qualquer alteração nos arquivos-fonte.

- Cloudflare Pages: diretório de saída `dist`, comando de build `npm run build`; ou envio manual dos arquivos de `dist` no fluxo de upload da plataforma.
- Vercel: preset de site estático/Other, comando `npm run build`, diretório de saída `dist`.
- Outra hospedagem estática: envie o conteúdo de `dist` para a raiz pública.

Essas são configurações de um projeto estático, não promessa de gratuidade ou verificação das condições comerciais atuais dos provedores. Não houve contratação nem publicação.

## Recursos externos

- O mapa real do Google já é exibido ao abrir a página, sem botão intermediário, com tonalidade suave por CSS alinhada à paleta rosé. Os controles continuam interativos. A tonalidade não altera os dados geográficos. A pesquisa é feita pelo endereço; o link para rota funciona independentemente da incorporação. Não há print, chave privada ou API de cobrança configurada. Confirme o marcador e a entrada do estabelecimento antes de publicar.
- Instagram e WhatsApp abrem os respectivos serviços externos.
- FormSubmit só é utilizado se houver destinatário configurado. Ativação, disponibilidade e condições são externas ao projeto.
- Fontes do sistema: nenhuma requisição a serviços de fontes. Sem analytics, rastreadores próprios ou cookies criados pelo site.

## Conteúdo e decisões

A marca no cabeçalho é uma apresentação tipográfica; o favicon é uma inicial provisória, e não uma logo aprovada. Apenas dois materiais enviados foram usados: retrato da Dani com blazer rosa e fotografia do consultório, sem marca d'água. As versões aprimoradas foram geradas a partir dos arquivos recebidos. Isso melhora a apresentação, mas não equivale a recuperar informação fotográfica original. Os arquivos originais continuam preferíveis quando disponíveis. Veja `docs/IMAGENS.md`.

Não foram incluídos certificados ilegíveis, tempo de experiência, prêmios, depoimentos, preços, horários não confirmados ou fachada com a marca Espaço Vitta. “Hidrolipo” foi omitida até esclarecer o procedimento exato. Os demais serviços foram extraídos da lista publicada e devem ter sua disponibilidade atual validada pela cliente.

Veja `docs/PENDENCIAS.md` e `docs/VERIFICACAO.md`.
