import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'dragonfish-tag-form',
    templateUrl: './tag-form.component.html',
    styleUrls: ['./tag-form.component.scss'],
})
export class TagFormComponent {
    formTitle = `Create a Tag`;

    tagForm = new FormGroup({
        name: new FormControl('', [Validators.required]),
        desc: new FormControl('', [Validators.required]),
    });
}
