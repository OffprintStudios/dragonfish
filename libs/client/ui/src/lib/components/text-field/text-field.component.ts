import { Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'dragonfish-text-field',
    templateUrl: './text-field.component.html',
    styleUrls: ['./text-field.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: TextFieldComponent,
            multi: true,
        },
    ],
})
export class TextFieldComponent implements ControlValueAccessor {
    @Input() name: string;
    @Input() type: string;
    @Input() label: string;
    @Input() placeholder: string;
    @Input() disabled: boolean;
    @Input() searchBox: boolean;

    value: string;
    onChange: (value: string) => void;
    onTouch: (value: boolean) => void;

    writeValue(obj: string): void {
        this.value = obj;
    }
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
