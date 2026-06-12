const PDFDocument = require("pdfkit");
const { SaidaAdministrativa, SaidaItem, ProdutoAdministrativo } = require("../models");

async function gerarPdfSaida(id, res) {
  const saida = await SaidaAdministrativa.findByPk(id, {
    include: [
      {
        model: SaidaItem,
        as: "itens",
        include: [
          {
            model: ProdutoAdministrativo,
            as: "produto",
            attributes: ["id", "nome"]
          }
        ]
      }
    ]
  });

  if (!saida) {
    throw new Error("Saída não encontrada.");
  }

  const doc = new PDFDocument({
    size: "A4",
    margin: 50
  });

  const nomeArquivo = `saida-${saida.codigo_saida}.pdf`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${nomeArquivo}"`);

  doc.pipe(res);

  doc
    .fontSize(18)
    .text("Praiastur Inventário", { align: "center" });

  doc
    .moveDown(0.5)
    .fontSize(14)
    .text("Comprovante de Saída de Materiais", { align: "center" });

  doc.moveDown(2);

  doc.fontSize(11);

  doc.text(`Código da saída: ${saida.codigo_saida}`);
  doc.text(`Data: ${new Date(saida.created_at).toLocaleString("pt-BR")}`);
  doc.text(`Destinatário: ${saida.destinatario}`);
  doc.text(`Status: ${saida.status}`);

  if (saida.observacao) {
    doc.text(`Observação: ${saida.observacao}`);
  }

  doc.moveDown(1.5);

  doc
    .fontSize(13)
    .text("Produtos retirados", { underline: true });

  doc.moveDown(0.8);

  saida.itens.forEach((item, index) => {
    doc
      .fontSize(11)
      .text(`${index + 1}. ${item.produto.nome} — Quantidade: ${item.quantidade}`);
  });

  doc.moveDown(4);

  doc.text("________________________________________", {
    align: "center"
  });

  doc.text("Assinatura de quem retirou", {
    align: "center"
  });

  doc.moveDown(3);

  doc.text("________________________________________", {
    align: "center"
  });

  doc.text("Assinatura do responsável", {
    align: "center"
  });

  doc.moveDown(2);

  doc
    .fontSize(9)
    .text("Documento gerado automaticamente pelo sistema Praiastur Inventário.", {
      align: "center"
    });

  doc.end();
}

module.exports = {
  gerarPdfSaida
};