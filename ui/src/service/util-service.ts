
export class UtilService {
  generateId() {
    return btoa(Math.random().toString().substr(-6))
  }
}

export const utilService = new UtilService()