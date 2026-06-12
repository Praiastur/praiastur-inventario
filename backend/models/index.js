const Usuario = require("./Usuario");
const ProdutoAdministrativo = require("./ProdutoAdministrativo");
const EntradaAdministrativa = require("./EntradaAdministrativa");
const SaidaAdministrativa = require("./SaidaAdministrativa");
const SaidaItem = require("./SaidaItem");
const Residencial = require("./Residencial");
const Apartamento = require("./Apartamento");
const ItemOperacional = require("./ItemOperacional");
const HistoricoMovimentacao = require("./HistoricoMovimentacao");

/*
|--------------------------------------------------------------------------
| RELACIONAMENTOS COM USUÁRIOS
|--------------------------------------------------------------------------
*/

Usuario.hasMany(ProdutoAdministrativo, {
  foreignKey: "created_by",
  as: "produtos_criados"
});

ProdutoAdministrativo.belongsTo(Usuario, {
  foreignKey: "created_by",
  as: "criador"
});

Usuario.hasMany(EntradaAdministrativa, {
  foreignKey: "usuario_id",
  as: "entradas_registradas"
});

EntradaAdministrativa.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario"
});

Usuario.hasMany(SaidaAdministrativa, {
  foreignKey: "usuario_id",
  as: "saidas_registradas"
});

SaidaAdministrativa.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario"
});

Usuario.hasMany(Residencial, {
  foreignKey: "created_by",
  as: "residenciais_criados"
});

Residencial.belongsTo(Usuario, {
  foreignKey: "created_by",
  as: "criador"
});

Usuario.hasMany(Apartamento, {
  foreignKey: "created_by",
  as: "apartamentos_criados"
});

Apartamento.belongsTo(Usuario, {
  foreignKey: "created_by",
  as: "criador"
});

Usuario.hasMany(ItemOperacional, {
  foreignKey: "updated_by",
  as: "itens_atualizados"
});

ItemOperacional.belongsTo(Usuario, {
  foreignKey: "updated_by",
  as: "atualizado_por"
});

Usuario.hasMany(HistoricoMovimentacao, {
  foreignKey: "usuario_id",
  as: "historicos"
});

HistoricoMovimentacao.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario"
});

/*
|--------------------------------------------------------------------------
| RELACIONAMENTOS DO INVENTÁRIO ADMINISTRATIVO
|--------------------------------------------------------------------------
*/

ProdutoAdministrativo.hasMany(EntradaAdministrativa, {
  foreignKey: "produto_id",
  as: "entradas"
});

EntradaAdministrativa.belongsTo(ProdutoAdministrativo, {
  foreignKey: "produto_id",
  as: "produto"
});

SaidaAdministrativa.hasMany(SaidaItem, {
  foreignKey: "saida_id",
  as: "itens"
});

SaidaItem.belongsTo(SaidaAdministrativa, {
  foreignKey: "saida_id",
  as: "saida"
});

ProdutoAdministrativo.hasMany(SaidaItem, {
  foreignKey: "produto_id",
  as: "itens_saida"
});

SaidaItem.belongsTo(ProdutoAdministrativo, {
  foreignKey: "produto_id",
  as: "produto"
});

/*
|--------------------------------------------------------------------------
| RELACIONAMENTOS DO INVENTÁRIO OPERACIONAL
|--------------------------------------------------------------------------
*/

Residencial.hasMany(Apartamento, {
  foreignKey: "residencial_id",
  as: "apartamentos"
});

Apartamento.belongsTo(Residencial, {
  foreignKey: "residencial_id",
  as: "residencial"
});

Apartamento.hasMany(ItemOperacional, {
  foreignKey: "apartamento_id",
  as: "itens"
});

ItemOperacional.belongsTo(Apartamento, {
  foreignKey: "apartamento_id",
  as: "apartamento"
});

module.exports = {
  Usuario,
  ProdutoAdministrativo,
  EntradaAdministrativa,
  SaidaAdministrativa,
  SaidaItem,
  Residencial,
  Apartamento,
  ItemOperacional,
  HistoricoMovimentacao
};