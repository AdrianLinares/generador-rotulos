# Generador de Rótulos Geológicos

Aplicación web completa para generar rótulos geológicos en formato PDF a partir de datos tabulares. Desarrollada con React, TypeScript, Vite, Tailwind CSS, shadcn/ui y jsPDF.

## 🚀 Características

- **Tabla Editable**: Interfaz intuitiva para ingresar datos de muestras geológicas
- **Importación desde Excel**: Pegue datos directamente desde hojas de cálculo
- **Validación en Tiempo Real**: Verifica que todos los campos requeridos estén completos
- **Vista Previa Interactiva**: Visualice cómo se verán los rótulos antes de generar el PDF
- **Generación de PDF Optimizada**: Crea archivos PDF en formato carta con 6 rótulos por página (2 columnas × 3 filas)
- **Navegación entre Rótulos**: Revise múltiples rótulos con controles de navegación
- **Diseño Responsivo**: Funciona en dispositivos de escritorio y móviles
- **Formato Profesional**: Logo LITOTECA, campos con espaciado uniforme y tipografía optimizada

## 📋 Campos de Datos

Cada rótulo geológico incluye los siguientes campos:

### Campos Requeridos (*)
- **ID MUESTRA*** - Identificador único de la muestra
- **PLANCHA*** - Código de la plancha geológica
- **GEÓLOGO O COLECTOR*** - Nombre del profesional responsable
- **DATUM*** - Sistema de referencia geodésico
- **X*** - Coordenada Este
- **Y*** - Coordenada Norte
- **CONTRATO, PROYECTO O CONVENIO*** - Nombre del proyecto

### Campos Opcionales
- **IGM** - Código IGM (Instituto Geográfico Militar)
- **LOCALIZACIÓN** - Descripción del lugar de recolección
- **OBSERVACIONES** - Notas adicionales sobre la muestra
- **UNIDAD O FORMACIÓN** - Unidad geológica o formación

## 🛠️ Stack Tecnológico

- **Vite** - Build tool y dev server
- **TypeScript** - Tipado estático
- **React 18** - Framework de UI
- **shadcn/ui** - Componentes de UI
- **Tailwind CSS** - Estilos
- **jsPDF** - Generación de PDFs
- **Lucide React** - Iconos
- **Sonner** - Notificaciones toast

## 📦 Instalación

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm run dev

# Construir para producción
pnpm run build

# Ejecutar linter
pnpm run lint
```

## 🎯 Uso

### 1. Ingresar Datos

**Opción A: Manualmente**
- Haga clic en "Agregar Fila" para crear nuevas entradas
- Complete los campos directamente en la tabla
- Use el botón de eliminar (🗑️) para quitar filas

**Opción B: Desde Excel**
1. Copie los datos de su hoja de cálculo (Ctrl+C / Cmd+C)
2. Haga clic en "Pegar desde Excel"
3. Los datos se importarán automáticamente

**Opción C: Datos de Ejemplo**
- Haga clic en "Cargar Ejemplo" para ver datos de muestra

### 2. Validar Datos

- Haga clic en "Validar Datos" para verificar que todos los campos requeridos estén completos
- Los errores se mostrarán en la sección de vista previa
- Solo los rótulos válidos se incluirán en el PDF

### 3. Vista Previa

- Use los controles de navegación para revisar cada rótulo
- Verifique que la información sea correcta
- Los rótulos se muestran exactamente como aparecerán en el PDF

### 4. Generar PDF

- Haga clic en "Descargar PDF"
- El archivo se descargará automáticamente con el nombre: `rotulos_geologicos_YYYYMMDD.pdf`
- **Formato eficiente**: 6 rótulos por página en formato carta (2 columnas × 3 filas)
- **Dimensiones de cada rótulo**: 9.182cm × 7.259cm (3.61" × 2.86")
- Los rótulos están perfectamente centrados y distribuidos en la página

## 📊 Formato de Datos para Importación

Al pegar desde Excel, los datos deben estar en el siguiente orden (11 columnas):

```
IGM | ID MUESTRA | PLANCHA | GEÓLOGO O COLECTOR | LOCALIZACIÓN | DATUM | X | Y | OBSERVACIONES | UNIDAD O FORMACIÓN | CONTRATO, PROYECTO O CONVENIO
```

**Ejemplo:**
```
| AMC1216 | 18IVB | Ana Milena Cardozo | Sector la Florida | Magna Colombia Bogotá | 998909 | 1697240 | | | Investigación Maritima, Costera e Insular
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── ui/              # Componentes shadcn/ui
│   ├── DataTable.tsx    # Tabla editable
│   ├── RotuloPreview.tsx # Vista previa del rótulo
│   ├── NavigationControls.tsx # Controles de navegación
│   └── ValidationMessages.tsx # Mensajes de validación
├── hooks/               # Custom hooks
│   └── useRotuloData.ts # Hook para manejo de estado
├── types/               # Definiciones TypeScript
│   └── rotulo.ts        # Tipos de datos
├── utils/               # Utilidades
│   ├── validation.ts    # Lógica de validación
│   ├── pdfGenerator.ts  # Generación de PDFs
│   └── excelParser.ts   # Parseo de datos de Excel
├── pages/               # Páginas
│   └── Index.tsx        # Página principal
└── App.tsx              # Componente raíz
```

## 🎨 Diseño del PDF

El PDF generado replica exactamente el formato del documento de referencia:

- **Formato de Página**: Carta (8.5" × 11" / 21.59cm × 27.94cm), orientación vertical
- **Distribución**: 6 rótulos por página en cuadrícula 2×3 (2 columnas, 3 filas)
- **Dimensiones por Rótulo**: 9.182cm × 7.259cm (3.61" × 2.86")
- **Logo LITOTECA**: 4.4cm × 1.12cm, centrado en cada rótulo
- **Tipografía**: Helvetica con tamaños optimizados (8-9pt para etiquetas, 8pt para valores)
- **Espaciado**: Distancia uniforme de dos espacios entre etiquetas y valores
- **Bordes**: Cada rótulo tiene un borde negro de 0.5mm
- **Márgenes**: Los rótulos están centrados con espacios de 0.5cm entre ellos
- **Campos Subrayados**: ID Muestra, Plancha, Datum, Unidad/Formación, Coordenadas, Localización y Geólogo
- **Multilinea**: Localización y Observaciones pueden ocupar múltiples líneas si es necesario

## 🔧 Personalización

### Modificar Campos Requeridos

Edite el archivo `src/types/rotulo.ts`:

```typescript
export const REQUIRED_FIELDS: (keyof RotuloData)[] = [
  'idMuestra',
  'plancha',
  // Agregue o quite campos según necesite
];
```

### Ajustar Diseño del PDF

Modifique `src/utils/pdfGenerator.ts` para cambiar:
- **Dimensiones del rótulo**: Variables `rotuloWidth` y `rotuloHeight`
- **Distribución por página**: Variables `cols` y `rows` (actualmente 2×3 = 6 rótulos)
- **Espaciado**: Variables `horizontalGap` y `verticalGap` (actualmente 0.5cm)
- **Tamaños de fuente**: Llamadas a `doc.setFontSize()`
- **Logo**: Variables `logoWidth` y `logoHeight`
- **Posicionamiento de campos**: Ajustar valores `yPos` y márgenes internos
- **Formato de página**: Cambiar `format` en configuración de jsPDF

## 📝 Notas Importantes

- **Coordenadas**: Los campos X e Y deben ser valores numéricos
- **Validación**: Solo los rótulos válidos se incluyen en el PDF
- **Navegador**: Se requiere un navegador moderno con soporte para Clipboard API
- **Rendimiento**: La aplicación puede manejar cientos de rótulos simultáneamente

## 🐛 Solución de Problemas

**Problema**: No se puede pegar desde Excel
- **Solución**: Asegúrese de que el navegador tenga permisos de portapapeles. Alternativamente, pegue directamente en una celda de la tabla.

**Problema**: El PDF no se descarga
- **Solución**: Verifique que haya al menos un rótulo válido. Revise la consola del navegador para errores.

**Problema**: Los datos no se importan correctamente
- **Solución**: Asegúrese de que los datos estén separados por tabuladores y tengan exactamente 11 columnas.

## 📄 Licencia

Este proyecto fue desarrollado por Adrian Linares.