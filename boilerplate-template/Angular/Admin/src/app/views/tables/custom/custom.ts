import { Component } from '@angular/core'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { CompleteTable } from './components/complete-table/complete-table'
import { TableWithCheckbox } from './components/table-with-checkbox/table-with-checkbox'
import { TableWithDeleteButton } from './components/table-with-delete-button/table-with-delete-button'
import { TableWithFilters } from './components/table-with-filters/table-with-filters'
import { TableWithPaginationInfo } from './components/table-with-pagination-info/table-with-pagination-info'
import { TableWithPagination } from './components/table-with-pagination/table-with-pagination'
import { TableWithSearch } from './components/table-with-search/table-with-search'
import { TableWithSort } from './components/table-with-sort/table-with-sort'

@Component({
  selector: 'app-custom',
  imports: [PageBreadcrumb, TableWithSearch, TableWithCheckbox, TableWithDeleteButton, TableWithPagination, TableWithPaginationInfo, TableWithFilters, TableWithSort, CompleteTable],
  templateUrl: './custom.html',
  styles: ``,
})
export class Custom {}
