const PDFDocument = require("pdfkit");
const {
  SaidaAdministrativa,
  SaidaItem,
  ProdutoAdministrativo,
  Usuario
} = require("../models");

function formatarData(data) {
  if (!data) return "-";

  return new Date(data).toLocaleString("pt-BR");
}

function desenharLinha(doc, y) {
  doc
    .moveTo(50, y)
    .lineTo(545, y)
    .strokeColor("#e5e7eb")
    .stroke();
}

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
      },
      {
        model: Usuario,
        as: "usuario",
        attributes: ["id", "nome", "email"]
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

  // Cabeçalho
  doc
    .fontSize(20)
    .fillColor("#111827")
    .text("Praiastur Inventário", { align: "center" });

  doc
    .moveDown(0.3)
    .fontSize(14)
    .fillColor("#374151")
    .text("Comprovante de Saída de Materiais", { align: "center" });

  doc.moveDown(1.5);

  desenharLinha(doc, doc.y);

  doc.moveDown(1);

  // Dados principais
  doc
    .fontSize(12)
    .fillColor("#111827")
    .text("Dados da saída", { underline: true });

  doc.moveDown(0.7);

  doc
    .fontSize(10)
    .fillColor("#111827")
    .text(`Código da saída: ${saida.codigo_saida}`);

  doc.text(`Data e hora: ${formatarData(saida.created_at)}`);
  doc.text(`Status: ${saida.status}`);
  doc.text(`Destinatário: ${saida.destinatario}`);
  doc.text(`Responsável pelo registro: ${saida.usuario?.nome || "Não informado"}`);

  if (saida.observacao) {
    doc.text(`Observação: ${saida.observacao}`);
  }

  doc.moveDown(1.5);

  // Produtos
  doc
    .fontSize(12)
    .fillColor("#111827")
    .text("Produtos retirados", { underline: true });

  doc.moveDown(0.8);

  const inicioTabelaY = doc.y;

  doc
    .fontSize(10)
    .fillColor("#ffffff")
    .rect(50, inicioTabelaY, 495, 24)
    .fill("#1f2937");

  doc
    .fillColor("#ffffff")
    .text("Produto", 60, inicioTabelaY + 7, { width: 330 })
    .text("Quantidade", 420, inicioTabelaY + 7, { width: 100, align: "right" });

  let y = inicioTabelaY + 30;

  saida.itens.forEach((item, index) => {
    const corFundo = index % 2 === 0 ? "#f9fafb" : "#ffffff";

    doc
      .rect(50, y - 5, 495, 24)
      .fill(corFundo);

    doc
      .fillColor("#111827")
      .fontSize(10)
      .text(item.produto?.nome || "Produto não encontrado", 60, y, {
        width: 330
      })
      .text(String(item.quantidade), 420, y, {
        width: 100,
        align: "right"
      });

    y += 26;
  });

  doc.y = y + 20;

  // Aviso se cancelada
  if (saida.status === "CANCELADA") {
    doc
      .fillColor("#991b1b")
      .fontSize(11)
      .text("Atenção: esta saída está CANCELADA. Os produtos foram devolvidos ao estoque.", {
        align: "center"
      });

    doc.moveDown(1.5);
  }

  // Assinaturas
  doc
    .fillColor("#111827")
    .fontSize(12)
    .text("Assinaturas", { underline: true });

  doc.moveDown(3);

  const assinaturaY = doc.y;

  doc
    .strokeColor("#111827")
    .moveTo(70, assinaturaY)
    .lineTo(260, assinaturaY)
    .stroke();

  doc
    .moveTo(335, assinaturaY)
    .lineTo(525, assinaturaY)
    .stroke();

  doc
    .fontSize(9)
    .fillColor("#374151")
    .text("Assinatura de quem retirou", 70, assinaturaY + 8, {
      width: 190,
      align: "center"
    });

  doc.text("Assinatura do responsável", 335, assinaturaY + 8, {
    width: 190,
    align: "center"
  });

  // Rodapé
  doc
    .fontSize(8)
    .fillColor("#6b7280")
    .text(
      "Documento gerado automaticamente pelo sistema Praiastur Inventário.",
      50,
      760,
      {
        align: "center",
        width: 495
      }
    );

  doc.end();
}

module.exports = {
  gerarPdfSaida
};