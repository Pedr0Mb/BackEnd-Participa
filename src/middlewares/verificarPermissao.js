export function verificarPermissao(...rolesPermitidos) {
  return (req, res, next) => {
    const cargo = req.usuario.cargo;
    const permissoes = req.usuario.permissoes || [];

    const temCargo = rolesPermitidos.includes(cargo);
    const temPermissao = permissoes.some(p => rolesPermitidos.includes(p));

    if (cargo === 'Administrador') {
      return next();
    }
    if (!temCargo && !temPermissao) {
      return res.status(403).json({ mensagem: 'Acesso negado: permissão insuficiente' });
    }

    next();
  };
}