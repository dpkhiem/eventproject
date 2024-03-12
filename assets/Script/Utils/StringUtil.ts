export function getQueryParam(paramName: string) {
    try {
        return getQueryParams().get(paramName);
    } catch (e) {
        return null;
    }
}

export function getQueryParams() {
    return new window.URLSearchParams(window.location.search);
}

export function getEnumKeyByValue(enumObj: any, value: any): string | undefined {
    try {
        for (let key in enumObj) {
            if (enumObj[key] === value) {
                return key;
            }
        }
        return null;
    } catch (e) {
        return null;
    }
}