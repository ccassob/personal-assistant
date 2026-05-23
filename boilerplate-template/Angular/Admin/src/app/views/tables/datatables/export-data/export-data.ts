import { toPascalCase } from '@/app/utils/string'
import { Component } from '@angular/core'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap'
import { DataTablesModule } from 'angular-datatables'
import { paginationIcons, tableData } from '../data'

@Component({
  selector: 'app-export-data',
  imports: [DataTablesModule, PageBreadcrumb, NgbAlert, Icon],
  templateUrl: './export-data.html',
  styles: ``,
})
export class ExportData {
  showAlert = true
  basicData = tableData
  dtOptions = {
    dom: "<'d-md-flex justify-content-between align-items-center my-2'Bf>" + 'rt' + "<'d-md-flex justify-content-between align-items-center mt-2'ip>",
    responsive: true,
    buttons: [
      { extend: 'copy', className: 'btn btn-sm btn-secondary' },
      { extend: 'csv', className: 'btn btn-sm btn-secondary active' },
      { extend: 'excel', className: 'btn btn-sm btn-secondary' },
      { extend: 'print', className: 'btn btn-sm btn-secondary active' },
      { extend: 'pdf', className: 'btn btn-sm btn-secondary' },
    ],
    language: {
      paginate: paginationIcons,
    },
  }
  dtOptions2 = {
    dom: "<'d-md-flex justify-content-between align-items-center my-2'<'dropdown'B>f>" + 'rt' + "<'d-md-flex justify-content-between align-items-center mt-2'ip>",
    responsive: true,
    buttons: [
      {
        extend: 'collection',
        text: '<svg  xmlns="http://www.w3.org/2000/svg"  width="14"  height="14"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="me-1 align-baseline"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 11l5 5l5 -5" /><path d="M12 4l0 12" /></svg> Export',
        className: 'btn btn-sm btn-secondary dropdown-toggle',
        autoClose: true,
        buttons: [
          {
            extend: 'copy',
            text: 'Copy',
            className: 'dropdown-item',
          },
          {
            extend: 'csv',
            text: 'CSV',
            className: 'dropdown-item',
          },
          {
            extend: 'excel',
            text: 'Excel',
            className: 'dropdown-item',
          },
          {
            extend: 'print',
            text: 'Print',
            className: 'dropdown-item',
          },
          {
            extend: 'pdf',
            text: 'PDF',
            className: 'dropdown-item',
          },
        ],
      },
    ],
    language: {
      paginate: paginationIcons,
    },
  }

  protected readonly toPascalCase = toPascalCase
}
