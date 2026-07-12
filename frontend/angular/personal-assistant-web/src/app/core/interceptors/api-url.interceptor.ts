import { HttpInterceptorFn } from '@angular/common/http'
import { API_BASE, getApiBase } from '../../constants'

export const apiUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const customBase = getApiBase()
  if (customBase !== API_BASE && req.url.startsWith(API_BASE)) {
    const newUrl = req.url.replace(API_BASE, customBase)
    return next(req.clone({ url: newUrl }))
  }
  return next(req)
}
