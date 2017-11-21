export class QueryFilters {
    static stringFilter(filter: string, items: string[]) {
        return QueryFilters.genericFilter((filter: string, item: any, exact: boolean): boolean => {
            if (item == null) return false;
            return exact ? item.toLowerCase() == filter : item.toLowerCase().indexOf(filter) > -1;
        }, filter, items);
    }
 
    static genericFilter(filterFunction: Function, filter: string, items: any[]) {
        if (filter == null || filter.length == 0) return items;
        filter = filter.toLowerCase();
 
        let result = items;
 
        // if the value is an empty string don't filter the items
        if (filter && filter.trim() != '') {
            result = [];
            for (let item of items) {
                if (filterFunction(filter, item, false))
                    result.push(item);
            }
        }
 
        return result;
    }
}