# Pokémon TCG - Higher or Lower Game

Un juego web interactivo basado en el clásico *"Higher or Lower"*, adaptado al universo del Juego de Cartas Coleccionables de Pokémon (TCG). El objetivo es adivinar si la siguiente carta tiene un precio de mercado mayor o menor en comparación con la carta actual.


## Tecnologías Utilizadas

- **Frontend:** React (Vite / CRA), JavaScript (ES6+)
- **API:** [TCGdex API v2](https://www.tcgdex.net/) (Consumo con `fetch` nativo)
- **State Management:** React Hooks (`useState`, `useEffect`)


## 🧠 Desafíos Técnicos y Decisiones de Arquitectura

Este proyecto pasó por un proceso de **refactorización profunda** para mejorar la arquitectura, la estabilidad y la experiencia de usuario (UX). Es un caso real de resolución de problemas de software:

### 1. Migración de API Legacy a TCGdex
- **Problema:** La API original del proyecto (`pokemontcg.io`) quedó obsoleta/legacy, rompiendo los endpoints y requiriendo API Keys.
- **Solución:** Se reestructuró la capa de datos para migrar a **TCGdex**, una API pública y gratuita. Se creó un extractor de precios personalizado con *optional chaining* (`?.`) para navegar la estructura de precios de TCGPlayer (variantes `normal`, `reverse`, `holofoil`) evitando errores por metadatos no numéricos.

### 2. Optimización de Performance y Filtrado de Peticiones
- **Problema:** Consultar el catálogo completo de miles de cartas generaba tiempos de espera elevados y múltiples reintentos por cartas de energía, ítems o cartas sin precio/imagen.
- **Solución:** Se acotó el rango de búsqueda a la categoría `/categories/pokemon`. Se implementó un algoritmo de reintento automático (*retry loop*) que descarta silenciosamente cartas sin precio o sin imagen antes de renderearlas.

### 3. Latencia Cero mediante Prefetching (Buffer en Memoria)
- **Problema:** La espera de red entre ronda y ronda arruinaba la fluidez del juego.
- **Solución:** Se implementó un patrón de **Prefetching**: mientras el usuario analiza su respuesta, el sistema descarga en segundo plano la siguiente carta y la almacena en un estado buffer (`nextCardBuffer`). Al hacer clic, la transición es instantánea.


### Licencia
Este proyecto es de código abierto bajo la licencia MIT. Pokémon y sus marcas registradas son propiedad de Nintendo, Creatures Inc. y GAME FREAK inc.