import { Component, input } from '@angular/core';

@Component({
  selector: 'app-calorie-display',
  imports: [],
  templateUrl: './calorie-display.component.html',
  styleUrl: './calorie-display.component.css'
})
export class CalorieDisplayComponent {
  public calories = input<number>(0)
  public text = input<string>('')
}
