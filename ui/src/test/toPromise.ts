import { Observable } from 'rxjs/Observable'

export function toPromise(observable: Observable<any>) {
  return new Promise((resolve, reject) => {
    const result = []
    const subscription = observable.subscribe(response => result.push(response), reject, () => {
      resolve(result)
      subscription.unsubscribe()
    })
  })
}