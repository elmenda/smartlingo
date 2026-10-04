# SmartLingo · Inglés 4.º Primaria

Aplicación Angular 20, standalone y zoneless, diseñada para móvil, tablet y escritorio.

## Enfoque pedagógico

Cada unidad sigue el ciclo **Aprende → Practica mucho → Examínate**.
La práctica es el núcleo: banco amplio de ejercicios, intentos ilimitados, feedback explicado y repaso de errores.
El examen es independiente y no muestra la solución hasta terminar.

## Ejecutar

```bash
npm install
npm start
```

## Contenido

Starter, Units 1–6, Review 1–3 y Festivals, alineados con el temario del Pupil's Book 4 aportado como referencia.

## Calidad y despliegue

Antes de subir cambios ejecuta `npm run check`. El proyecto incluye CI y despliegue a GitHub Pages desde `main`.
La aplicación arranca en modo zoneless mediante `provideZonelessChangeDetection()` en `app.config.ts`.

## Criterio pedagógico de la práctica

La práctica no muestra la respuesta dentro del enunciado. Los ejercicios avanzan desde reconocimiento y recuperación de vocabulario hasta comprensión contextual, aplicación gramatical y comunicación. Se mezclan elección, completar, ordenar y verdadero/falso. El examen usa preguntas mezcladas y sin pistas directas.
