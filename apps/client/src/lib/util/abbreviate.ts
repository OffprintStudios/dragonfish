import numbro from 'numbro';

/**
 * Abbreviates long numbers.
 * @param toAbbreviate
 */
export function abbreviate(toAbbreviate: number): string {
    if (toAbbreviate < 1000) {
        return `${toAbbreviate}`;
    } else {
        return numbro(toAbbreviate).format({ average: true, totalLength: 2 });
    }
}
