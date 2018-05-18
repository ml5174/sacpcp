
export class Organization {
    name: string;
    group: string;
    description?: string;
    organization_id: string;
    org_type?: any;
    status: number;
}

/**
 *   sort first by pending-active-inactive, then org, then group name.
 *   Pass this to sort()
 * @param a - organization but not specifying
 * @param b - same
 */
export function sortOrganization(a: any, b: any) {
    if (a.approval_status == 1 && b.approval_status != 1) {
        return -1;
    }
    else if (a.approval_status != 1 && b.approval_status == 1) {
        return 1;
    }
    else if(a.status == 0 && b.status == 1) {
        return -1;
    }
    else if(a.status == 1 && b.status == 0) {
        return 1;
    }
    let nameCompare = a.name.localeCompare(b.name);
    if (nameCompare != 0) {
        return nameCompare;
    }
    else {
        return a.group.localeCompare(b.group);
    }
}

