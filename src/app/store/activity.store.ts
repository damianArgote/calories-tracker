import { signalStore, withMethods, withState, patchState, withComputed } from '@ngrx/signals';
import { Activity } from "../types"
import { v4 as uuid } from 'uuid'
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { ActivityService } from '../services/activity.service';
import { tapResponse } from '@ngrx/operators';

export type ActivityState = {
  activities: Activity[],
  activeId: string;
  isLoading: boolean;
}

const localStorageActivities = () => {
  const activities = localStorage.getItem('activities')

  return activities ? JSON.parse(activities) : []
}

const initialState: ActivityState = {
  activities: localStorageActivities(),
  activeId: '',
  isLoading: false
}

export const ActivityStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    caloriesCosumed: computed(() => {
      const activities = state.activities();
      return activities.reduce((total, activity) => activity.category === 1 ?
        total + activity.calories : total, 0)
    }),
    caloriesBurned: computed(() => {
      const activities = state.activities();
      return activities.reduce((total, activity) => activity.category === 2 ?
        total + activity.calories : total, 0)
    }),

    netCalories: computed(() => {
      const activities = state.activities();
      return activities.reduce((total, activity) => {
        if (activity.category === 1) {
          return total + activity.calories;
        } else if (activity.category === 2) {
          return total - activity.calories;
        }
        return total;
      }, 0);
    })
  })),
  withMethods((store, activityService = inject(ActivityService)) => ({

    loadActivities: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(() => {
          return activityService.getActivities()
            .pipe(
              tapResponse({
                next: (activities) => patchState(store, { activities, isLoading: false }),
                error: (err) => {
                  patchState(store, { isLoading: false }),
                    console.log(err);

                }
              })
            )
        })
      )
    ),

    saveActivity: rxMethod<Activity>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((activity) => {
          return activityService.addActivity(activity)
            .pipe(
              tapResponse({
                next: (newActivity) => {
                  patchState(store, {
                    activities: [...store.activities(), newActivity],
                    isLoading: false
                  });
                },
                error: (err) => {
                  patchState(store, { isLoading: false }),
                    console.log(err);

                }
              })
            )
        })
      )
    ),

    updateActivity: rxMethod<[string, Partial<Activity>]>(
      pipe(
         tap(() => patchState(store, { isLoading: true })),
         switchMap(([id, activity]) => {
          return activityService.updateActivity(id,activity).pipe(
            tapResponse({
              next:() => patchState(store,{isLoading:false, activeId:''}),
              error:(err) => {
                patchState(store,{isLoading:false})
                console.log(err);
              }
            })
          )
         })
      )
    ),

    setActiveId: (activeId: string) => {
      patchState(store, {
        activeId
      })
    },

    deleteActivity: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap(id => {
          return activityService.deleteActivity(id).pipe(
            tapResponse({
              next:() => patchState(store, { isLoading: false }),
              error:(err) => {
                patchState( store, {isLoading:false})
                console.log(err);

              }
            })
          )
        })
      )
    ),

    reset: rxMethod<void>(
      pipe(
         tap(() => patchState(store, { isLoading: true })),
         switchMap(() => {
          return activityService.deleteAllActivities().pipe(
            tapResponse({
              next: () => patchState(store,{isLoading:false}),
              error:(err) => {
                patchState(store,{isLoading:false})
                console.log(err);

              }
            })
          )
         })
      )
    )
  }))
)
