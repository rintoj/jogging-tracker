import { AppState } from '../state/index'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'

let requestCount = 0

export function task(callback: Function): Observable<AppState> {
  return Observable.create((observer: Observer<AppState>) => {
    const timeout = setTimeout(() => observer.next({ requestInProgress: true }), 500)
    requestCount++
    callback(observer, () => {
      clearTimeout(timeout)
      if (--requestCount < 1) {
        observer.next({ requestInProgress: false })
      }
      observer.complete()
    })
  })
}