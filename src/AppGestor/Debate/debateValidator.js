import { z } from 'zod';
import {
  idSchema,
  textoSchema,
  descricoesSchema,
  linkSchema,
  temaSchema,
} from '../../utils/commonValidator.js';

export const SchemaDebateId = z.object({
  idDebate: idSchema,
});

export const SchemaPesquisarDebate = z.object({
  titulo: textoSchema.nullable().optional(),
});

export const SchemaEditarDebate = z.object({
  idDebate: idSchema,
  titulo: textoSchema,
  subtitulo: textoSchema,
  descricoes: descricoesSchema,
  imagem: linkSchema,
  tema: temaSchema,
});
