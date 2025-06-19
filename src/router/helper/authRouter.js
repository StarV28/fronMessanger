import { routes } from '../index'

export function isAuthenticated() {
  const user = localStorage.getItem('user')
  return !!user
}

export function isRouteAvailable(to) {
  // здесь можно проверить права доступа к маршрутам, если нужно
  // пока сделаем просто, что любой доступный маршрут разрешён
  return routes.some((route) => route.name === to.name)
}
