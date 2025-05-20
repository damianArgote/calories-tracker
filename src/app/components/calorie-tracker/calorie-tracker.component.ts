import { Component, inject } from '@angular/core';
import { CalorieDisplayComponent } from "../calorie-display/calorie-display.component";
import { ActivityStore } from '../../store/activity.store';

@Component({
  selector: 'app-calorie-tracker',
  imports: [CalorieDisplayComponent],
  templateUrl: './calorie-tracker.component.html',
  styleUrl: './calorie-tracker.component.css'
})
export class CalorieTrackerComponent {

  public store = inject(ActivityStore)
}
