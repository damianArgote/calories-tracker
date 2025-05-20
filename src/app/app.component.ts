import { Component, effect, inject } from '@angular/core';
import { FormComponent } from "./components/form/form.component";
import { ActivityListComponent } from "./components/activity-list/activity-list.component";
import { ActivityStore } from './store/activity.store';
import { CalorieTrackerComponent } from './components/calorie-tracker/calorie-tracker.component';


@Component({
  selector: 'app-root',
  imports: [FormComponent, ActivityListComponent, CalorieTrackerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'calories_tracker';

  public store = inject(ActivityStore)

  constructor(){

    effect(() => {
      localStorage.setItem('activities', JSON.stringify(this.store.activities()))
    })
  }
}
