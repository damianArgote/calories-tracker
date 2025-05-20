import { Component, effect, inject, signal } from '@angular/core';
import { categories } from '../../data/categories';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivityStore } from '../../store/activity.store';
import { Activity } from '../../types';
@Component({
  selector: 'app-form',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  private fb = inject(FormBuilder);
  private store = inject(ActivityStore);

  public categoriOptions = categories;
  public activity = signal<Activity | undefined>(undefined)

  public form!: FormGroup;

  constructor(){

    effect(() =>{
      if(this.store.activeId()){
        const activity = this.store.activities().find(act => act.id === this.store.activeId());
        this.activity.set(activity)
      }else{
        this.activity.set(undefined)
      }

      this.form = this.fb.group({
        category:[this.activity()?.category ?? '1', [Validators.required]],
        name:[this.activity()?.name ?? '',[Validators.required]],
        calories:[Number(this.activity()?.calories) ?? 0,[Validators.required, Validators.min(1)]]
      })
    })
  }

  handleSubmit(){
    if(this.form.invalid) return;
      this.store.saveActivity({
        ...this.form.value,
        category: Number(this.form.value.category)
      });
      this.form.reset({
        category:1,
        name:'',
        calories:null
      });
  }

}
