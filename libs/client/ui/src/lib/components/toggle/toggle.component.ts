import { Component } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'dragonfish-toggle',
    templateUrl: './toggle.component.html',
    styleUrls: ['./toggle.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: ToggleComponent,
            multi: true,
        },
    ],
})
export class ToggleComponent implements ControlValueAccessor {
    value = false;
    onChange: (value: boolean) => void;

    toggleValue() {
        this.value = !this.value;
        this.onChange(this.value);
    }

    writeValue(value: boolean): void {
        this.value = value;
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        // does nothing
    }
}
