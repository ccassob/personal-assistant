import { ApexOptions } from 'ng-apexcharts'
const seller1 = 'assets/images/sellers/1.png'
const seller10 = 'assets/images/sellers/10.png'
const seller2 = 'assets/images/sellers/2.png'
const seller3 = 'assets/images/sellers/3.png'
const seller4 = 'assets/images/sellers/4.png'
const seller5 = 'assets/images/sellers/5.png'
const seller6 = 'assets/images/sellers/6.png'
const seller7 = 'assets/images/sellers/7.png'
const seller8 = 'assets/images/sellers/8.png'
const seller9 = 'assets/images/sellers/9.png'
const auFlag = 'assets/images/flags/au.svg'
const brFlag = 'assets/images/flags/br.svg'
const caFlag = 'assets/images/flags/ca.svg'
const deFlag = 'assets/images/flags/de.svg'
const frFlag = 'assets/images/flags/fr.svg'
const gbFlag = 'assets/images/flags/gb.svg'
const inFlag = 'assets/images/flags/in.svg'
const itFlag = 'assets/images/flags/it.svg'
const jpFlag = 'assets/images/flags/jp.svg'
const usFlag = 'assets/images/flags/us.svg'

function generateRandomData(count = 15, min = 5, max = 20) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

export const getSellerReportChartOptions = (type: 'line' | 'bar'): (() => ApexOptions) => {
  return () => ({
    chart: {
      type: type,
      width: 100,
      height: 30,
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      width: type === 'line' ? 2 : 0,
      curve: (type === 'line' ? 'smooth' : 'straight') as 'smooth' | 'straight',
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        borderRadius: 2,
      },
    },
    series: [
      {
        data: generateRandomData(),
      },
    ],
    colors: ['#3b82f6'],
    tooltip: {
      enabled: false,
    },
  })
}

export type SellerType = {
  seller: { name: string; image: string; since: number }
  products: number
  orders: number
  rating: number
  country: { flag: string; code: string }
  balance: string
  rank: string
  reportChartOptions: () => ApexOptions
}

export const sellerData: SellerType[] = [
  {
    seller: {
      name: 'GreenTech Solutions',
      image: seller3,
      since: 2005,
    },
    products: 1456,
    orders: 18120,
    rating: 4.5,
    country: {
      code: 'CA',
      flag: caFlag,
    },
    balance: '$92.5k',
    rank: '1st',
    reportChartOptions: getSellerReportChartOptions('bar'),
  },
  {
    seller: {
      name: 'TechTonic Store',
      image: seller4,
      since: 2010,
    },
    products: 2378,
    orders: 25892,
    rating: 3,
    country: {
      code: 'UK',
      flag: gbFlag,
    },
    balance: '$145.7k',
    rank: '2nd',
    reportChartOptions: getSellerReportChartOptions('line'),
  },
  {
    seller: {
      name: 'UrbanTech Gadgets',
      image: seller5,
      since: 2012,
    },
    products: 3120,
    orders: 35210,
    rating: 3.5,
    country: {
      code: 'IN',
      flag: inFlag,
    },
    balance: '$300.4k',
    rank: '3rd',
    reportChartOptions: getSellerReportChartOptions('line'),
  },
  {
    seller: {
      name: 'NextGen Electronics',
      image: seller6,
      since: 2018,
    },
    products: 1748,
    orders: 12563,
    rating: 2,
    country: {
      code: 'FR',
      flag: frFlag,
    },
    balance: '$78.9k',
    rank: '4th',
    reportChartOptions: getSellerReportChartOptions('bar'),
  },
  {
    seller: {
      name: 'SmartHome Goods',
      image: seller7,
      since: 2015,
    },
    products: 520,
    orders: 3321,
    rating: 2,
    country: {
      code: 'DE',
      flag: deFlag,
    },
    balance: '$56.2k',
    rank: '5th',
    reportChartOptions: getSellerReportChartOptions('line'),
  },
  {
    seller: {
      name: 'TechMasters',
      image: seller8,
      since: 2013,
    },
    products: 2160,
    orders: 40500,
    rating: 5,
    country: {
      code: 'US',
      flag: usFlag,
    },
    balance: '$600k',
    rank: '6th',
    reportChartOptions: getSellerReportChartOptions('line'),
  },
  {
    seller: {
      name: 'FutureGizmos',
      image: seller9,
      since: 2020,
    },
    products: 1400,
    orders: 30000,
    rating: 2,
    country: {
      code: 'IT',
      flag: itFlag,
    },
    balance: '$170.2k',
    rank: '7th',
    reportChartOptions: getSellerReportChartOptions('line'),
  },
  {
    seller: {
      name: 'GizmoX',
      image: seller10,
      since: 2016,
    },
    products: 2100,
    orders: 28950,
    rating: 2,
    country: {
      code: 'AU',
      flag: auFlag,
    },
    balance: '$210.3k',
    rank: '8th',
    reportChartOptions: getSellerReportChartOptions('bar'),
  },
  {
    seller: {
      name: 'NextWave Electronics',
      image: seller1,
      since: 2017,
    },
    products: 1900,
    orders: 22510,
    rating: 3.5,
    country: {
      code: 'BR',
      flag: brFlag,
    },
    balance: '$125.4k',
    rank: '9th',
    reportChartOptions: getSellerReportChartOptions('bar'),
  },
  {
    seller: {
      name: 'FutureTech Innovations',
      image: seller2,
      since: 2019,
    },
    products: 3250,
    orders: 40300,
    rating: 4,
    country: {
      code: 'JP',
      flag: jpFlag,
    },
    balance: '$340.7k',
    rank: '10th',
    reportChartOptions: getSellerReportChartOptions('line'),
  },
]
