declare module "tailwindcss/lib/util/flattenColorPalette" {
    const flattenColorPalette: (colors: Record<string, null>) => Record<string, string>;
    export default flattenColorPalette;
  }
  