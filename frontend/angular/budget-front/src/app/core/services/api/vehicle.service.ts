import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { API_BASE } from '../../../constants'

export interface Vehicle {
  id: number
  name: string
  make: string
  model: string
  year: number
  currentMileage: number
  licensePlate: string
  color: string
  notes: string
}

export interface VehicleMaintenance {
  id: number
  vehicleId: number
  date: string
  mileage: number
  type: string
  price: number
  notes: string
  nextDate?: string
  nextMileage?: number
}

export interface VehicleFuel {
  id: number
  vehicleId: number
  date: string
  pricePerGallon: number
  totalAmount: number
  gallons: number
}

export interface VehicleMileageHistory {
  id: number
  vehicleId: number
  date: string
  mileage: number
}

export interface VehicleChecklist {
  id: number
  vehicleId: number
  title: string
  isDone: boolean
}

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private url = `${API_BASE}/api/vehicles`

  constructor(private http: HttpClient) {}

  getAll(): Observable<Vehicle[]> { return this.http.get<Vehicle[]>(this.url) }
  create(v: Omit<Vehicle, 'id'>): Observable<Vehicle> { return this.http.post<Vehicle>(this.url, v) }
  update(v: Vehicle): Observable<void> { return this.http.put<void>(`${this.url}/${v.id}`, v) }
  delete(id: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}`) }

  getMaintenance(id: number): Observable<VehicleMaintenance[]> { return this.http.get<VehicleMaintenance[]>(`${this.url}/${id}/maintenance`) }
  createMaintenance(id: number, m: Omit<VehicleMaintenance, 'id' | 'vehicleId'>): Observable<VehicleMaintenance> { return this.http.post<VehicleMaintenance>(`${this.url}/${id}/maintenance`, m) }
  updateMaintenance(id: number, mid: number, m: VehicleMaintenance): Observable<VehicleMaintenance> { return this.http.put<VehicleMaintenance>(`${this.url}/${id}/maintenance/${mid}`, m) }
  deleteMaintenance(id: number, mid: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}/maintenance/${mid}`) }

  getFuel(id: number): Observable<VehicleFuel[]> { return this.http.get<VehicleFuel[]>(`${this.url}/${id}/fuel`) }
  createFuel(id: number, f: Omit<VehicleFuel, 'id' | 'vehicleId' | 'gallons'>): Observable<VehicleFuel> { return this.http.post<VehicleFuel>(`${this.url}/${id}/fuel`, f) }
  updateFuel(id: number, fid: number, f: VehicleFuel): Observable<VehicleFuel> { return this.http.put<VehicleFuel>(`${this.url}/${id}/fuel/${fid}`, f) }
  deleteFuel(id: number, fid: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}/fuel/${fid}`) }

  getMileageHistory(id: number): Observable<VehicleMileageHistory[]> { return this.http.get<VehicleMileageHistory[]>(`${this.url}/${id}/mileage-history`) }

  getTodos(id: number): Observable<VehicleChecklist[]> { return this.http.get<VehicleChecklist[]>(`${this.url}/${id}/todos`) }
  createTodo(id: number, title: string): Observable<VehicleChecklist> { return this.http.post<VehicleChecklist>(`${this.url}/${id}/todos`, { title }) }
  toggleTodo(id: number, tid: number, isDone: boolean): Observable<VehicleChecklist> { return this.http.put<VehicleChecklist>(`${this.url}/${id}/todos/${tid}`, { isDone }) }
  deleteTodo(id: number, tid: number): Observable<void> { return this.http.delete<void>(`${this.url}/${id}/todos/${tid}`) }

  getReminders(id: number): Observable<VehicleChecklist[]> { return this.http.get<VehicleChecklist[]>(`${this.url}/${id}/reminders`) }
  toggleReminder(id: number, rid: number, isDone: boolean): Observable<VehicleChecklist> { return this.http.put<VehicleChecklist>(`${this.url}/${id}/reminders/${rid}`, { isDone }) }
}
