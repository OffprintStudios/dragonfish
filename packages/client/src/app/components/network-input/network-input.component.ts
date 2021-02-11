import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-network-input',
    templateUrl: './network-input.component.html',
    styleUrls: ['./network-input.component.less'],
})
export class NetworkInputComponent implements OnInit {
    _InputState = InputState; // make this type a property, so the template can see it

    // Could add more here, but this seems like a decent starting selection
    @Input() inputType: 'email' | 'number' | 'password' | 'tel' | 'text' | 'url';
    @Input() inputPlaceholder: string;
    @Input() inputClasses: string | string[] | Set<string> | { [klass: string]: any };
    @Input() passwordBoxClasses: string | string[] | Set<string> | { [klass: string]: any };
    @Input() inputValue: string;
    @Input() uploadFunction: (newValue: string, password: string) => Observable<string>;

    passwordValue = '';
    currentState: InputState = InputState.Default;
    initialValue: string;

    constructor() {}

    ngOnInit(): void {
        this.initialValue = this.inputValue;
    }

    beginEditing() {
        this.currentState = InputState.Editing;
    }

    accept() {
        this.currentState = InputState.Uploading;
        this.uploadFunction(this.inputValue, this.passwordValue).subscribe(
            (newValue) => {
                if (newValue) {
                    // Success!
                    this.inputValue = newValue;
                    this.passwordValue = '';
                    this.initialValue = newValue;
                    this.currentState = InputState.Default;
                } else {
                    // Failure
                    this.currentState = InputState.Editing;
                }
            },
            (err: any) => {
                // Failure
                this.currentState = InputState.Editing;
            },
        );
    }

    cancel() {
        this.inputValue = this.initialValue;
        this.currentState = InputState.Default;
    }
}

enum InputState {
    Default,
    Editing,
    Uploading,
}
