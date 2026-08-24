# AI Guidance - Light Mode

Este archivo esta reducido a proposito para bajar consumo de tokens.

Reglas por defecto:

- Trabajar directo en este chat, sin subagentes ni workflows salvo pedido explicito del usuario.
- No iniciar auditores, refutadores, SDD, memoria persistente, codegraph, graph tools ni MCPs pesados salvo pedido explicito.
- Buscar con `rg` y abrir solo los archivos necesarios para la tarea actual.
- No leer arboles completos de documentacion ni archivos historicos grandes por defecto.
- No correr `pwsh scripts/orbi-verificar.ps1`, build completo o test suite completa salvo que el usuario pida verificacion completa o el cambio lo requiera.
- Para cambios chicos, usar una verificacion chica y explicar cualquier prueba que no se corrio.
- Antes de crear un agente nuevo, proponer uno corto, de una sola responsabilidad, read-only por defecto, modelo barato/normal, sin loops y con limite de archivos/salida.
- Antes de cualquier workflow con mas de un agente, pedir confirmacion y estimar el riesgo de tokens.
