import { QueryFilters } from './query-filters';

export class Colour {
   private _name: string;
   private _rgb: string;

   constructor(name: string, rgb: string) {
       this._name = name;
       this._rgb = rgb;
   }

   get name(): string {
       return this._name;
   }

   get rgb(): string {
       return this._rgb;
   }

   toString() {
       return this._name;
   }
}

export class ColourQueryProvider {
   public static queryColoursFn(): Function {
       return (filter: string): Colour[] => {
           return ColourQueryProvider.queryColours(filter);
       };
   }

   public static queryColours(filter: string, colours?: Colour[]): Colour[] {
       if (colours == null)
           colours = ColourQueryProvider.colours;

       return QueryFilters.genericFilter((filter: string, item: Colour, exact: boolean): boolean => {
           if (item == null) return false;
           if (exact)
               return item.name == filter || item.name.toLowerCase() == filter;
           return item.name.toLowerCase().indexOf(filter) > -1 || item.name.toLowerCase().indexOf(filter) > -1;
       }, filter, colours);
   }

   private static get colours(): Colour[] {
       return [
           new Colour('Black', "#000000"),
           new Colour('Blue', "#0000FF"),
           new Colour('Green', "#008000"),
           new Colour('Grey', "#808080"),
           new Colour('Orange', "#FFA500"),
           new Colour('Pink', "#FFC0CB"),
           new Colour('Purple', "#800080"),
           new Colour('Red', "#FF0000"),
           new Colour('White', "#FFFFFF"),
           new Colour('Yellow', "#FFFF00")
       ];
   }
}
