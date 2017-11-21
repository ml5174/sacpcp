import { QueryFilters } from './query-filters';

export class CityQueryProvider {
   public static queryCitiesFn(): Function {
       return (filter: string): string[] => {
           return CityQueryProvider.queryCities(filter);
       };
   }

   public static queryCities(filter: string): string[] {
       return QueryFilters.stringFilter(filter, CityQueryProvider.cities);
   }

   private static get cities(): string[] {
       return [
           'Amsterdam',
           'Auckland',
           'Bogota',
           'Buenos Aires',
           'Cairo',
           'Canberra',
           'Dhaka',
           'Edinburgh',
           'Geneva',
           'Genoa',
           'Glasglow',
           'Hanoi',
           'Hong Kong',
           'Islamabad',
           'Istanbul',
           'Jakarta',
           'Kiel',
           'Kyoto',
           'Le Havre',
           'Lebanon',
           'Lhasa',
           'Lima',
           'London',
           'Los Angeles',
           'Madrid',
           'Manila',
           'New York',
           'Olympia',
           'Oslo',
           'Panama City',
           'Peking',
           'Philadelphia',
           'San Francisco',
           'Seoul',
           'Sydney',
           'Taipeh',
           'Tel Aviv',
           'Tokio',
           'Uelzen',
           'Washington',
           'Wellington'
       ];
   }
}
