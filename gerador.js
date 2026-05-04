const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'dados', 'base_erros.csv');
const templatePath = path.join(__dirname, 'template', 'modelo.html');
const docsPath = path.join(__dirname, 'docs');

const templateHTML = fs.readFileSync(templatePath, 'utf8');
const csvData = fs.readFileSync(csvPath, 'utf8');

const linhas = csvData.trim().split('\n');
const cabecalhos = linhas[0].split(',');

// Configuração para o Index e Sitemap
const urlBase = 'https://josephmedeiros.github.io/Erros/'; // Sua URL do GitHub
let linksIndex = '';
let urlsSitemap = '';

for (let i = 1; i < linhas.length; i++) {
    const valores = linhas[i].split(',');
    if (valores.length < cabecalhos.length) continue; // Evita quebrar se houver linha vazia no CSV

    let paginaHTML = templateHTML;
    const dados = {};
    
    cabecalhos.forEach((cabecalho, index) => {
        dados[cabecalho.trim()] = valores[index].trim();
    });

    paginaHTML = paginaHTML.replace(/{{marca}}/g, dados.marca);
    paginaHTML = paginaHTML.replace(/{{modelo}}/g, dados.modelo);
    paginaHTML = paginaHTML.replace(/{{codigo}}/g, dados.codigo);
    paginaHTML = paginaHTML.replace(/{{sintoma}}/g, dados.sintoma);
    paginaHTML = paginaHTML.replace(/{{solucao}}/g, dados.solucao);

    // Formata o nome do arquivo removendo espaços extras
    const nomeArquivo = `erro-${dados.codigo.toLowerCase()}-${dados.marca.toLowerCase()}.html`.replace(/\s+/g, '-');
    const caminhoSaida = path.join(docsPath, nomeArquivo);

    // Salva a página individual
    fs.writeFileSync(caminhoSaida, paginaHTML);
    console.log(`Página gerada: ${nomeArquivo}`);

    // Prepara a linha de link para a página inicial (index.html)
    linksIndex += `<li><a href="${nomeArquivo}">Erro <strong>${dados.codigo}</strong> - ${dados.marca} ${dados.modelo}</a></li>\n`;

    // Prepara a linha do sitemap para o Google (sitemap.xml)
    urlsSitemap += `  <url>\n    <loc>${urlBase}${nomeArquivo}</loc>\n  </url>\n`;
}

// ---------------------------------------------------------
// 1. GERAÇÃO AUTOMÁTICA DA PÁGINA INICIAL (INDEX.HTML)
// ---------------------------------------------------------
const htmlIndex = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diretório de Códigos de Erro</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        ul { list-style-type: none; padding: 0; }
        li { background: #f4f4f4; margin: 8px 0; padding: 12px; border-radius: 5px; }
        a { color: #d32f2f; text-decoration: none; font-size: 18px; display: block;}
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>Diretório de Códigos de Erro</h1>
    <p>Selecione o código abaixo para ver o diagnóstico passo a passo:</p>
    <ul>
        ${linksIndex}
    </ul>
</body>
</html>`;

fs.writeFileSync(path.join(docsPath, 'index.html'), htmlIndex);
console.log('? Página inicial (index.html) gerada com sucesso!');

// ---------------------------------------------------------
// 2. GERAÇÃO AUTOMÁTICA DO MAPA DO GOOGLE (SITEMAP.XML)
// ---------------------------------------------------------
const xmlSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsSitemap}
</urlset>`;

fs.writeFileSync(path.join(docsPath, 'sitemap.xml'), xmlSitemap);
console.log('? Mapa do site (sitemap.xml) gerado com sucesso!');
console.log('?? Tudo pronto! Pode enviar para o GitHub.');