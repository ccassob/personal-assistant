import { toTitleCase } from '@/app/utils/string'
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { RouterLink } from '@angular/router'
import { CardWithAction } from '@app/components/card-with-action/card-with-action'
import { VectorMap } from '@app/components/vector-map/vector-map'
import 'jsvectormap/dist/maps/world.js'
import { transactionData, worldTransactionMapOptions } from '../../data'

@Component({
  selector: 'app-transactions',
  imports: [RouterLink, VectorMap, CardWithAction],
  templateUrl: './transactions.html',
  styles: ``,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Transactions {
  protected readonly toTitleCase = toTitleCase
  transactionData = transactionData
  worldTransactionMapOptions = worldTransactionMapOptions
}
