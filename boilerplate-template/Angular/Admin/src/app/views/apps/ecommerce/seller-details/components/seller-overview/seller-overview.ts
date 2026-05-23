import { Component } from '@angular/core'
import { Apexchart } from '@app/components/apexchart/apexchart'
import { getSellerChartOptions, sellerStatData } from '../../data'
import { SellerWidget } from '../seller-widget/seller-widget'

@Component({
  selector: 'app-seller-overview',
  imports: [Apexchart, SellerWidget],
  templateUrl: './seller-overview.html',
  styles: ``,
})
export class SellerOverview {
  getSellerChartOptions = getSellerChartOptions
  sellerStatData = sellerStatData
}
