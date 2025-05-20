import { Component, effect, inject, signal } from '@angular/core';
import { categories } from '../../data/categories';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivityStore } from '../../store/activity.store';
import { Activity } from '../../types';
import { ActivityService } from '../../services/activity.service';
@Component({
  selector: 'app-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  private fb = inject(FormBuilder);
  private store = inject(ActivityStore);
  public categoriOptions = categories;
  public activities = signal<Activity[]>([]);
  public form: FormGroup = this.fb.group({
    category: [1, [Validators.required]],
    name: ['', [Validators.required]],
    calories: [null, [Validators.required, Validators.min(1)]]
  });

  constructor() {

    effect(() => {
      if (this.store.activeId()) {
        const act = this.store.activities().find(a => a.id === this.store.activeId());
        if (act) {
          this.form.setValue({
            category: act.category,
            name: act.name,
            calories: act.calories
          });
        }
      } else {
        this.form.reset({
          category: 1,
          name: '',
          calories: null
        });
      }
    });
  }

  handleSubmit() {
    if (this.form.invalid) return;

    if (this.store.activeId()) {
      const id = this.store.activeId();
      const updatedActivity: Partial<Activity> = {
        ...this.form.value,
        category: Number(this.form.value.category)
      };

      this.store.updateActivity([id, updatedActivity]);

    } else {

      const newActivity: Activity = {
        ...this.form.value,
        category: Number(this.form.value.category)
      };

      this.store.saveActivity(newActivity);
    }
    this.form.reset({
      category: 1,
      name: '',
      calories: null
    });
  }

}
