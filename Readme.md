# Generador de Rótulos Geológicos

Aplicación web para capturar datos geológicos y generar rótulos de muestras y de canastillas en PDF. El proyecto está construido con React, TypeScript y Vite. La aplicación procesa los datos en el navegador y está preparada para desplegarse como contenido estático en una VM del servidor del SGC.

## Estado actual

- Aplicación funcional en modo cliente, sin backend ni base de datos.
- Generación de PDF en el navegador.
- Importación mediante pegado desde Excel/CSV.
- Carga de la plantilla oficial `plantilla_rotulos.xlsx`.
- Validación en tiempo real de los campos requeridos.
- Vista previa antes de generar el PDF.
- Pruebas automatizadas, typecheck, lint y build de producción configurados.
- Despliegue oficial proyectado en una VM del SGC mediante Nginx o Apache.

## Funcionalidades

### Rótulos de muestra

Permite ingresar filas manualmente, pegarlas desde Excel o cargar la hoja **Rótulos Muestras** de la plantilla oficial.

Campos requeridos:

- ID MUESTRA
- PLANCHA
- GEÓLOGO O COLECTOR
- DATUM
- X
- Y
- CONTRATO, PROYECTO O CONVENIO

Campos opcionales:

- IGM
- LOCALIZACIÓN
- OBSERVACIONES
- UNIDAD O FORMACIÓN

### Rótulos de canastilla

Permite ingresar filas manualmente, pegarlas desde Excel o cargar la hoja **Rótulos Canastillas** de la misma plantilla descargable.

Campos requeridos:

- CAJA, que debe ser un número entero
- ID MUESTRA
- PROYECTO, CONTRATO O CONVENIO
- AÑO
- PLANCHA

Las filas se agrupan por número de caja para generar un rótulo consolidado por canastilla.

## Flujo de uso

1. Seleccione **Rótulo de Muestra** o **Rótulo Canastilla**.
2. Ingrese datos manualmente, use **Pegar desde Excel** o seleccione **Cargar plantilla**.
3. Para la plantilla oficial, seleccione `plantilla_rotulos.xlsx`. La aplicación leerá automáticamente la hoja correspondiente al tipo de rótulo seleccionado:
   - Muestras: `Rótulos Muestras`.
   - Canastillas: `Rótulos Canastillas`.
4. Revise la vista previa y corrija los campos inválidos.
5. Genere el PDF. Las filas inválidas no se incluyen.

La aplicación no muestra errores de validación para una fila de muestra completamente vacía. La validación comienza cuando el usuario ingresa el primer dato.

## Plantilla y formato de importación

La plantilla descargable se encuentra en `public/plantilla_rotulos.xlsx` y contiene las hojas de muestras y canastillas. No se debe renombrar ninguna de estas hojas.

### Pegado de rótulos de muestra

```text
IGM | ID MUESTRA | PLANCHA | GEÓLOGO O COLECTOR | LOCALIZACIÓN | DATUM | X | Y | OBSERVACIONES | UNIDAD O FORMACIÓN | CONTRATO, PROYECTO O CONVENIO
```

### Pegado de rótulos de canastilla

```text
CAJA | ID MUESTRA | PROYECTO, CONTRATO O CONVENIO | AÑO | PLANCHA
```

El lector de la plantilla identifica los encabezados aunque incluyan tildes, dos puntos u otros signos de formato. Los valores numéricos se convierten a texto para mantenerlos editables en la tabla.

## Generación de PDF

### Muestras

- Página carta vertical.
- 6 rótulos por página, distribuidos en una cuadrícula de 2 × 3.
- Archivo: `rotulos_geologicos_YYYYMMDD.pdf`.

### Canastillas

- Página carta vertical.
- 5 rótulos por página.
- Agrupación por caja.
- Ajuste automático del texto para evitar desbordamientos.
- Archivo: `rotulos_canastilla_YYYYMMDD.pdf`.

## Stack tecnológico

- React 19 y React DOM.
- TypeScript.
- Vite 5 con SWC.
- React Router 6.
- Tailwind CSS y componentes Radix/shadcn.
- SheetJS (`xlsx`) para leer plantillas Excel.
- jsPDF para generar PDFs.
- Vitest, Testing Library y happy-dom para pruebas.
- pnpm 8 como gestor de paquetes.

## Desarrollo local

Requisitos: Node.js LTS y pnpm 8 o superior.

```bash
pnpm install
pnpm run dev
```

Comandos de verificación:

```bash
pnpm test
pnpm run typecheck
pnpm run lint
pnpm run build
```

El build de producción se genera en `dist/`.

## Despliegue oficial en VM del SGC

### Arquitectura prevista

La VM servirá los archivos estáticos generados por Vite. No se requiere ejecutar Node.js permanentemente, ni instalar una base de datos o un backend para el estado actual de la aplicación.

```text
Usuario del SGC
      |
   HTTPS :443
      |
VM del SGC
  Nginx/Apache
      |
  archivos dist/
```

### Requerimientos recomendados de la VM

- Sistema operativo Linux LTS aprobado por el SGC, preferiblemente Ubuntu Server 22.04/24.04 LTS.
- 2 vCPU.
- 4 GB de RAM.
- 20 GB de almacenamiento SSD.
- Arquitectura x86_64.
- IP fija o reserva DHCP.
- Nombre DNS institucional.
- Acceso HTTPS con certificado institucional.
- Acceso SSH administrativo restringido a la red autorizada.
- Firewall institucional permitiendo HTTPS y, si corresponde, HTTP únicamente para redirección.

### Instalación y publicación

El build puede realizarse en CI o en la VM con Node.js LTS y pnpm:

```bash
pnpm install --frozen-lockfile
pnpm run test
pnpm run typecheck
pnpm run lint
pnpm run build
```

Luego se publica el contenido de `dist/` en el directorio raíz del servidor web. Deben conservarse especialmente:

- `plantilla_rotulos.xlsx`.
- El logo institucional.
- Todos los archivos JavaScript y CSS generados.

Como la aplicación utiliza `BrowserRouter`, el servidor debe reenviar las rutas desconocidas a `index.html`. Para Nginx:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Operación y seguridad

Antes de habilitar el acceso oficial se deben definir con el SGC:

- Alcance de red: interno, VPN o público.
- Responsable de administración de la VM.
- Renovación del certificado TLS.
- Monitoreo de disponibilidad y revisión de logs.
- Backup de la configuración del servidor y del artefacto publicado.
- Proceso de actualización y rollback.
- Escaneo de vulnerabilidades y controles institucionales.

La aplicación no almacena en el servidor los archivos Excel seleccionados ni los datos ingresados: el procesamiento ocurre en el navegador. Si en el futuro se requiere persistencia, usuarios, auditoría o almacenamiento centralizado, será necesario diseñar un backend y revisar nuevamente los requisitos de seguridad.

## Estructura principal

```text
src/
├── components/                 # Tablas, vistas previas y componentes UI
├── hooks/                      # Estado de muestras y canastillas
├── pages/Index.tsx             # Página principal
├── types/                      # Modelos y campos requeridos
└── utils/
    ├── excelParser.ts          # Pegado de datos de muestras
    ├── canastillaExcelParser.ts # Pegado de datos de canastillas
    ├── excelFileParser.ts      # Lectura de la plantilla .xlsx
    ├── validation.ts            # Validación de muestras
    ├── canastillaValidation.ts  # Validación de canastillas
    ├── pdfGenerator.ts          # PDF de muestras
    └── canastillaPdfGenerator.ts # PDF de canastillas
```

## Licencia

Este proyecto fue desarrollado por Adrian Linares.
