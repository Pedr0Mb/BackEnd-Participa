import { z } from 'zod';
import {
  idSchema,
  textoSchema,
  descricoesSchema,
  linkSchema,
  temaSchema,
  statusSchema,
} from '../../utils/commonValidator.js';

export const SchemaPautaId = z.object({
  idDebate: idSchema,
});

export const SchemaPesquisarPauta = z.object({
  titulo: textoSchema.nullable().optional(),
  status: statusSchema.nullable().optional(),
});

export const SchemaEditarPauta = z.object({
  idDebate: idSchema,
  titulo: textoSchema,
  subTitulo: textoSchema,
  descricoes: descricoesSchema,
  imagem: linkSchema,
  tema: temaSchema,
});
