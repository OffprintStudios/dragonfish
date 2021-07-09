import { Component, ViewEncapsulation, OnInit, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';

@Component({
    selector: 'dragonfish-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
    encapsulation: ViewEncapsulation.None, // Disable CSS encapsulation so the .less file can affect the child editor component
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class EditorComponent implements OnInit {
    @Input() minHeight: string;
    @Input() maxHeight: string;

    ngOnInit() {
        if (this.minHeight) {
            document.documentElement.style.setProperty('--editor-min-height', this.minHeight);
        } else {
            document.documentElement.style.setProperty('--editor-min-height', '300px');
        }

        if (this.maxHeight) {
            document.documentElement.style.setProperty('--editor-max-height', this.maxHeight);
        } else {
            document.documentElement.style.setProperty('--editor-max-height', '500px');
        }
    }
}
