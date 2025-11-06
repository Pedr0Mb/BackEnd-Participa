export function formatarData(timestamp) {
   return timestamp ? timestamp.toDate().toLocaleString('pt-BR') : null
} 