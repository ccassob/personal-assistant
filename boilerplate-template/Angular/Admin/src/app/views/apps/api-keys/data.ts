import { getColor } from '@/app/utils/string'
import { ApexOptions } from 'ng-apexcharts'

const user2 = 'assets/images/users/user-2.jpg'
const user3 = 'assets/images/users/user-3.jpg'
const user4 = 'assets/images/users/user-4.jpg'
const user5 = 'assets/images/users/user-5.jpg'
const user6 = 'assets/images/users/user-6.jpg'
const user7 = 'assets/images/users/user-7.jpg'
const user8 = 'assets/images/users/user-8.jpg'
const user9 = 'assets/images/users/user-9.jpg'
const auFlag = 'assets/images/flags/au.svg'
const caFlag = 'assets/images/flags/ca.svg'
const deFlag = 'assets/images/flags/de.svg'
const frFlag = 'assets/images/flags/fr.svg'
const gbFlag = 'assets/images/flags/gb.svg'
const inFlag = 'assets/images/flags/in.svg'
const usFlag = 'assets/images/flags/us.svg'

const sparklineConfig: (data: number[], color: string) => ApexOptions = (data, color) => ({
  chart: {
    type: 'area',
    height: 60,
    sparkline: { enabled: true },
  },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  series: [{ data }],
  colors: [color],
  tooltip: {
    enabled: false,
  },
})

const dummyNewUsers = [Math.sin(0) * 50 + 500, Math.sin(1) * 60 + 500, Math.sin(2) * 70 + 500, Math.sin(3) * 80 + 500, Math.sin(4) * 90 + 500, Math.sin(5) * 100 + 500, Math.sin(6) * 110 + 500]

const dummyActiveUsers = [89000 + Math.sin(0) * 500, 89200 + Math.sin(1) * 600, 89700 + Math.sin(2) * 700, 90500 + Math.sin(3) * 800, 91000 + Math.sin(4) * 900, 91300 + Math.sin(5) * 1000, 92000 + Math.sin(6) * 1100]

const dummyBlockedUsers = [2600 + Math.sin(0) * 10, 2605 + Math.sin(1) * 12, 2610 + Math.sin(2) * 15, 2608 + Math.sin(3) * 18, 2612 + Math.sin(4) * 20]

const dummyTables = [7000 + Math.sin(0) * 150, 7100 + Math.sin(1) * 160, 7200 + Math.sin(2) * 170, 7400 + Math.sin(3) * 180, 7850 + Math.sin(4) * 200]

export type ApiStatisticsType = {
  icon: string
  title: string
  value: string
  chartOptions?: () => ApexOptions
}

export const apiStatisticsData: ApiStatisticsType[] = [
  {
    title: 'Total API Calls',
    value: '1,254,300',
    icon: 'server-bolt',
    chartOptions: () => sparklineConfig(dummyNewUsers, getColor('chart-secondary')),
  },
  {
    title: 'Successful Conversions',
    value: '1,192,450',
    icon: 'checks',
    chartOptions: () => sparklineConfig(dummyActiveUsers, getColor('chart-beta')),
  },
  {
    title: 'Failed Requests',
    value: '61,850',
    icon: 'alert-triangle',
    chartOptions: () => sparklineConfig(dummyBlockedUsers, getColor('chart-delta')),
  },
  {
    title: 'Active Endpoints',
    value: '143',
    icon: 'activity',
    chartOptions: () => sparklineConfig(dummyTables, getColor('chart-alpha')),
  },
]

export type ApiClientType = {
  name: string
  user: {
    name: string
    image: string
  }
  apiKey: string
  status: 'pending' | 'revoked' | 'active' | 'suspended' | 'trial' | 'expired'
  createdAtDate: string
  expireAtDate: string
  country: {
    code: string
    flag: string
  }
}

export const apiClientData: ApiClientType[] = [
  {
    name: 'APINexus',
    user: {
      name: 'Mark Reynolds',
      image: user2,
    },
    apiKey: 'e4A7Fc98z120XYz776abc90MNZ',
    status: 'pending',
    createdAtDate: 'Jan 10, 2025',
    expireAtDate: 'Nov 15, 2025',
    country: {
      code: 'DE',
      flag: deFlag,
    },
  },
  {
    name: 'DataPulse',
    user: {
      name: 'Sophia Turner',
      image: user4,
    },
    apiKey: '9BcD456Xy78LmN0zPQR12sA3Z',
    status: 'revoked',
    createdAtDate: 'Mar 5, 2025',
    expireAtDate: 'Aug 20, 2025',
    country: {
      code: 'UK',
      flag: gbFlag,
    },
  },
  {
    name: 'AuthKit',
    user: {
      name: 'Liam Watson',
      image: user5,
    },
    apiKey: 'ZZ99xC8K23Fm10TyPLqZa17d',
    status: 'active',
    createdAtDate: 'Apr 22, 2025',
    expireAtDate: 'Dec 31, 2025',
    country: {
      code: 'IN',
      flag: inFlag,
    },
  },
  {
    name: 'APIxEdge',
    user: {
      name: 'Ava Turner',
      image: user2,
    },
    apiKey: 'XY91kLpB42Ga98WxRTzEe55n',
    status: 'pending',
    createdAtDate: 'Apr 10, 2025',
    expireAtDate: 'Oct 10, 2025',
    country: {
      code: 'US',
      flag: usFlag,
    },
  },
  {
    name: 'DataLinker',
    user: {
      name: 'Noah Reed',
      image: user7,
    },
    apiKey: 'BB22zWqT65Op90VxMLaRt18c',
    status: 'suspended',
    createdAtDate: 'Mar 15, 2025',
    expireAtDate: 'Sep 15, 2025',
    country: {
      code: 'DE',
      flag: deFlag,
    },
  },
  {
    name: 'WebhookMate',
    user: {
      name: 'Sophia Lee',
      image: user3,
    },
    apiKey: 'RM19yUlP75Kl44YvNJdHg09s',
    status: 'active',
    createdAtDate: 'Jan 01, 2025',
    expireAtDate: 'Dec 31, 2025',
    country: {
      code: 'UK',
      flag: gbFlag,
    },
  },
  {
    name: 'DevPortal',
    user: {
      name: 'Mason Clark',
      image: user4,
    },
    apiKey: 'AA47qBcJ61Tr77WpKKzTy39k',
    status: 'trial',
    createdAtDate: 'Feb 01, 2025',
    expireAtDate: 'May 01, 2025',
    country: {
      code: 'AU',
      flag: auFlag,
    },
  },
  {
    name: 'NotifyX',
    user: {
      name: 'Ella James',
      image: user6,
    },
    apiKey: 'ZP83mXcD28Uv11MtYYoXx03b',
    status: 'active',
    createdAtDate: 'Apr 01, 2025',
    expireAtDate: 'Jan 01, 2026',
    country: {
      code: 'CA',
      flag: caFlag,
    },
  },
  {
    name: 'TokenVault',
    user: {
      name: 'Lucas Hill',
      image: user8,
    },
    apiKey: 'LK35yTrF82Lo99UiSSpPr47x',
    status: 'expired',
    createdAtDate: 'Jul 15, 2024',
    expireAtDate: 'Jan 15, 2025',
    country: {
      code: 'FR',
      flag: frFlag,
    },
  },
  {
    name: 'StreamAPI',
    user: {
      name: 'Mia Bennett',
      image: user9,
    },
    apiKey: 'DW64aUvQ11Gh32PpDDjWw72t',
    status: 'active',
    createdAtDate: 'Mar 05, 2025',
    expireAtDate: 'Dec 05, 2025',
    country: {
      code: 'IN',
      flag: inFlag,
    },
  },
]
