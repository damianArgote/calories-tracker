import { Component, inject } from '@angular/core';
import { ActivityStore } from '../../store/activity.store';
import { CommonModule } from '@angular/common';
import { NgIconsModule } from '@ng-icons/core';


@Component({
  selector: 'app-activity-list',
  imports: [
    CommonModule,
    NgIconsModule
  ],
  templateUrl: './activity-list.component.html',
  styleUrl: './activity-list.component.css',
})
export class ActivityListComponent {

  public store = inject(ActivityStore);


  getCategoryName(categoryId:number): string{

    return categoryId === 1 ? 'comida' : 'ejercicio'
  }
}
