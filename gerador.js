const fs = require('fs');
const path = require('path');

// Caminhos dos arquivos
const csvPath = path.join(__dirname, 'dados', 'base_erros.csv');
const templatePath = path.join(__dirname, 'template', 'modelo.html');
const docsPath = path.join(__dirname, 'docs');

// Lê o template e o CSV
const templateHTML = fs.readFileSync(templatePath, 'utf8');
const csvData = fs.readFileSync(csvPath, 'utf8');

// Quebra o CSV em linhas e extrai o cabeçalho
const linhas = csvData.trim().split('\n');
const cabecalhos = linhas[0].split(',');

// Loop para gerar cada página
for (let i = 1; i < linhas.length; i++) {
    const valores = linhas[i].split(',');
    let paginaHTML = templateHTML;

    // Objeto para mapear os dados da linha atual
    const dados = {};
    cabecalhos.forEach((cabecalho, index) => {
        dados[cabecalho.trim()] = valores[index].trim();
    });

    // Substitui as tags {{variavel}} pelo dado real
    paginaHTML = paginaHTML.replace(/{{marca}}/g, dados.marca);
    paginaHTML = paginaHTML.replace(/{{modelo}}/g, dados.modelo);
    paginaHTML = paginaHTML.replace(/{{codigo}}/g, dados.codigo);
    paginaHTML = paginaHTML.replace(/{{sintoma}}/g, dados.sintoma);
    paginaHTML = paginaHTML.replace(/{{solucao}}/g, dados.solucao);

    // Cria um nome de arquivo amigável para SEO (ex: erro-e4-elgin.html)
    const nomeArquivo = `erro-${dados.codigo.toLowerCase()}-${dados.marca.toLowerCase()}.html`;
    const caminhoSaida = path.join(docsPath, nomeArquivo);

    // Salva o arquivo final na pasta /docs
    fs.writeFileSync(caminhoSaida, paginaHTML);
    console.log(`? Página gerada: ${nomeArquivo}`);
}

console.log('?? Todas as páginas foram geradas com sucesso!');