import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'localedate'})
export class LocaleDatePipe implements PipeTransform  {
    transform(value: Date | string, format: string): string {
        const date = new Date(value);
        var options: Intl.DateTimeFormatOptions;
        var output: string;

        switch (format) {
            case 'short':
            case 'shortDate':
                options = { year: '2-digit', month: 'numeric', day: 'numeric' };
                break;
            case 'longDate':
                options = { year: 'numeric', month: 'long', day: 'numeric' };
                break;
            case 'fullDate':
                options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                break;
            case 'medium':
            case 'mediumDate':
            default:
                options = { year: 'numeric', month: 'short', day: 'numeric' };
        }

        output = date.toLocaleDateString(undefined, options);

        // Add time
        if (format === 'short') {
            options = { hour12: true, hour: 'numeric', minute: '2-digit' };
            output += " " + date.toLocaleTimeString(undefined, options);
        }
        else if (format === 'medium') {
            options = { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' };
            output += " " + date.toLocaleTimeString(undefined, options);
        }

        return output;
    }
}
