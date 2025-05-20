import { signalStore, withMethods, withState, patchState, withComputed } from '@ngrx/signals';
import { Activity } from "../types"
import {v4 as uuid} from 'uuid'
import { computed } from '@angular/core';

export type ActivityState = {
  activities: Activity[],
  activeId: string;
}

const localStorageActivities = () => {
  const activities = localStorage.getItem('activities')

  return activities ? JSON.parse(activities) : []
}

const initialState: ActivityState = {
  activities:localStorageActivities(),
  activeId:'',
}

export const ActivityStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    saveActivity: (activity: any) => {
      const activities = store.activities();
      const activeId = store.activeId();

      if(!activeId) {
        const newActivity: Activity = {
          ...activity,
          id: uuid()
        };
        patchState(store, {
          activities: [...activities, newActivity],
          activeId:''
        });

      }else{

        const updatedActivity = activities.map(act => act.id === activeId ? {...activity,id: act.id} : act)
        patchState(store, {
          activities: [...updatedActivity],
          activeId:''
        });
      }
    },

    setActiveId: (activeId: string) => {
      patchState(store,{
        activeId
      })
    },

    deleteActivity: (id: string) => {
      patchState(store,{
        activities: store.activities().filter(act => act.id !== id)
      })
    },

    reset:() => {
      patchState(store,{
        activities:[],
        activeId:''
      })
    }
  })),
  withComputed((state) => ({
    caloriesCosumed: computed(() =>{
      const activities = state.activities();
      return activities.reduce((total,activity) => activity.category === 1 ?
      total + activity.calories : total, 0)
    }),
    caloriesBurned: computed(() => {
      const activities = state.activities();
      return activities.reduce((total,activity) => activity.category === 2 ?
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
  }))
)
