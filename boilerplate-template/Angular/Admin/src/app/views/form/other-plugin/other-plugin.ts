import { Component, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { CounterDirective } from '@core/directive/counter.directive'
import { NgbTypeahead, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap'
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask'
import { debounceTime, distinctUntilChanged, filter, map, merge, Observable, OperatorFunction, Subject } from 'rxjs'
import { states, statesWithFlags } from './data'

@Component({
  selector: 'app-other-plugin',
  imports: [PageBreadcrumb, NgxMaskDirective, CounterDirective, FormsModule, NgbTypeaheadModule, Icon],
  templateUrl: './other-plugin.html',
  providers: [provideNgxMask()],
  styles: ``,
})
export class OtherPlugin {
  colors = ['primary', 'secondary', 'info', 'success', 'warning', 'danger', 'dark', 'purple', 'soft-primary']
  count: number = 0
  sizeCount: number = 0
  sizeCount2: number = 0
  colorCount: number = 100
  count5: number = 100
  count6: number = 100
  count7: number = 1

  basicTypeahead: string = ''
  focusTypeahead: string = ''
  formattedTypeahead: string = ''
  exactSearchTypeahead: string = ''
  customTypeahead: string = ''

  search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) => (term.length < 2 ? [] : states.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)))
    )

  @ViewChild('instance', { static: true }) instance!: NgbTypeahead

  focus$ = new Subject<string>()
  click$ = new Subject<string>()

  searchFocusTypeahead: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged())
    const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance.isPopupOpen()))
    const inputFocus$ = this.focus$

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(map((term) => (term === '' ? states : states.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10)))
  }

  formatter = (result: string) => result.toUpperCase()

  formatterSearch: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) => (term === '' ? [] : states.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)))
    )

  searchExact: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) => (term === '' ? [] : states.filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)))
    )

  exactFormatter = (x: string) => x

  searchWithFlags: OperatorFunction<
    string,
    readonly {
      name: string
      flag: string
    }[]
  > = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map((term) => (term === '' ? [] : statesWithFlags.filter((v) => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)))
    )

  nameFormatter = (x: { name: string }) => x.name
}
