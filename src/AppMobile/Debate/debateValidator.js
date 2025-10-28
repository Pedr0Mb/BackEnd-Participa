import { z } from 'zod';
import {
  idSchema,
  textoSchema,
  descricoesSchema,
  linkSchema,
  temaSchema,
} from '../../utils/commonValidator.js';

// ======================== ID ========================
export const SchemaPautaId = z.object({
  idDebate: idSchema,
});

// ======================== PESQUISAR ========================
export const SchemaPesquisarPauta = z.object({
  titulo: textoSchema.nullable().optional(),
  debateProprio: z.boolean(),
});

// ======================== CRIAR ========================
export const SchemaCriarPauta = z.object({
  titulo: textoSchema,
  subtitulo: textoSchema.nullable().optional(),
  descricoes: descricoesSchema,
  imagem: linkSchema.nullable().optional(),
  tema: temaSchema.nullable().optional(),
});

// ======================== EDITAR ========================
export const SchemaEditarPauta = z.object({
  idDebate: idSchema,
   titulo: textoSchema.nullable().optional(),
  subtitulo: textoSchema.nullable().optional(),
  descricoes: descricoesSchema.nullable().optional(),
  imagem: linkSchema.nullable().optional(),
  tema: temaSchema.nullable().optional(),
});
