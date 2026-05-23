import { getColor } from '@/app/utils/string'
import { ApexOptions } from 'ng-apexcharts'

const inFlag = 'assets/images/flags/in.svg'
const deFlag = 'assets/images/flags/de.svg'
const frFlag = 'assets/images/flags/fr.svg'
const usFlag = 'assets/images/flags/us.svg'
const gbFlag = 'assets/images/flags/gb.svg'
const caFlag = 'assets/images/flags/ca.svg'
const jpFlag = 'assets/images/flags/jp.svg'
const auFlag = 'assets/images/flags/au.svg'
const brFlag = 'assets/images/flags/br.svg'
const itFlag = 'assets/images/flags/it.svg'

const user3 = 'assets/images/users/user-3.jpg'
const user4 = 'assets/images/users/user-4.jpg'
const user5 = 'assets/images/users/user-5.jpg'
const user6 = 'assets/images/users/user-6.jpg'
const user7 = 'assets/images/users/user-7.jpg'
const user8 = 'assets/images/users/user-8.jpg'
const user9 = 'assets/images/users/user-9.jpg'

export type OverviewType = {
  value: number
  suffix: string
  change: number
  changeIcon: string
  title: string
  icon: string
  isPositive: boolean
}

export const overviewData: OverviewType[] = [
  {
    value: 14.59,
    suffix: 'M',
    change: 5.2,
    changeIcon: 'tabler:trending-up',
    title: 'Total Views',
    icon: 'tabler:eye',
    isPositive: true,
  },
  {
    value: 815.58,
    suffix: 'k',
    change: 3.9,
    changeIcon: 'tabler:activity',
    title: 'Sessions',
    icon: 'tabler:clock',
    isPositive: true,
  },
  {
    value: 41.3,
    suffix: '%',
    change: 1.1,
    changeIcon: 'tabler:arrow-down-left',
    title: 'Bounce Rate',
    icon: 'tabler:repeat-once',
    isPositive: false,
  },
  {
    value: 56.39,
    suffix: 'k',
    change: 2.3,
    changeIcon: 'tabler:users',
    title: 'Active Users',
    icon: 'tabler:user',
    isPositive: true,
  },
]

function generateRandomData(count: number, min: number, max: number) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

function generateSessionAndPageViewData(count: number) {
  const sessions = generateRandomData(count, 250, 450)
  const pageViews = sessions.map(
    (session) => Math.floor(session * (2 + Math.random() * 0.1)) // Page Views are 2x to 2.5x of Sessions
  )
  return { sessions, pageViews }
}

const { sessions, pageViews } = generateSessionAndPageViewData(19)

export const analyticChartOptions: () => ApexOptions = () => ({
  chart: {
    height: 326,
    type: 'area',
    toolbar: { show: false },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 2,
    curve: 'smooth',
  },
  colors: [getColor('chart-primary'), getColor('chart-secondary')],
  series: [
    {
      name: 'Sessions',
      data: sessions,
    },
    {
      name: 'Page Views',
      data: pageViews,
    },
  ],
  legend: {
    offsetY: 5,
  },
  xaxis: {
    categories: ['', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM', ''],
    axisBorder: { show: false },
    axisTicks: { show: false },
    tickAmount: 6,
    labels: {
      style: {
        fontSize: '12px',
      },
    },
  },
  tooltip: {
    shared: true,
    y: {
      formatter: (val: number, opts?: any): string => {
        if (opts?.seriesIndex === 0) {
          return `${val} Sessions`
        } else if (opts?.seriesIndex === 1) {
          return `${val} Page Views`
        }

        return `${val}`
      },
    },
  },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.2,
      stops: [15, 120, 100],
    },
  },
  grid: {
    borderColor: getColor('border-color'),
    padding: {
      bottom: 5,
    },
  },
})

function generateRandomDeviceData(name: string, minY: number, maxY: number, count: number = 10) {
  const data = []
  for (let i = 1; i <= count; i++) {
    const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY
    const z = Math.floor(Math.random() * (35 - 15 + 1)) + 15
    data.push({ x: i, y: y, z: z })
  }
  return { name, data }
}

export const deviceSessionsChartOptions: () => ApexOptions = () => ({
  chart: {
    height: 222,
    type: 'bubble',
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  series: [generateRandomDeviceData('Desktop', 20, 150), generateRandomDeviceData('Mobile', 20, 120), generateRandomDeviceData('Tablet', 20, 60)],
  fill: {
    opacity: 0.8,
  },
  colors: [getColor('chart-primary'), getColor('chart-secondary'), getColor('chart-beta')],
  xaxis: {
    min: 0,
    max: 11,
    show: false,
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    min: 0,
    max: 170,
    show: false,
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },

  grid: {
    padding: {
      top: -20,
      right: 20,
      bottom: 0,
      left: 20,
    },
    borderColor: getColor('border-color'),
  },

  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'center',
  },
})

export type DeviceSessionType = {
  name: string
  platforms: string
  users: number
  change: number
  percentage: number
  isPositive: boolean
}

export const deviceSessionData: DeviceSessionType[] = [
  {
    name: 'Mobile',
    platforms: 'Android / iOS',
    users: 4620,
    change: 3.4,
    percentage: 58,
    isPositive: true,
  },
  {
    name: 'Desktop',
    platforms: 'Windows / Mac',
    users: 2510,
    change: 1.9,
    percentage: 32,
    isPositive: true,
  },
  {
    name: 'Tablet',
    platforms: 'iPad / Android Tabs',
    users: 820,
    change: 0.8,
    percentage: 10,
    isPositive: false,
  },
]

export type TrafficType = {
  pageLink: string
  views: number
  unique: number
}

export const trafficData: TrafficType[] = [
  { pageLink: '/dashboard', views: 9.8, unique: 8.5 },
  { pageLink: '/ecommerce-index', views: 8.2, unique: 7.1 },
  { pageLink: '/apps/projects-overview', views: 7.6, unique: 6.2 },
  { pageLink: '/pages/contact', views: 5.9, unique: 4.8 },
  { pageLink: '/support/faq', views: 5.2, unique: 4.3 },
  { pageLink: '/login', views: 4.7, unique: 3.9 },
]

export type TopCountryType = {
  name: string
  image: string
  value: string
  change: number
}

export const topCountryData: TopCountryType[] = [
  { name: 'Germany', image: deFlag, value: '10,412', change: 1.5 },
  { name: 'France', image: frFlag, value: '8,934', change: -0.8 },
  { name: 'India', image: inFlag, value: '14,217', change: 3.2 },
  { name: 'United States', image: usFlag, value: '18,522', change: 2.1 },
  { name: 'United Kingdom', image: gbFlag, value: '7,614', change: -1.2 },
  { name: 'Canada', image: caFlag, value: '6,221', change: 0.9 },
  { name: 'Japan', image: jpFlag, value: '5,785', change: 0.0 },
  { name: 'Australia', image: auFlag, value: '4,918', change: 1.1 },
  { name: 'Brazil', image: brFlag, value: '3,874', change: -0.5 },
  { name: 'Italy', image: itFlag, value: '4,105', change: 0.7 },
]

export type CampaignType = {
  name: string
  icon: string
  variant: string
  visitors: number
  newUsers: number
  sessions: number
  bounceRate: number
  pageVisits: number
  avgDuration: string
  leads: number
  revenue: number
  conversion: number
  isPositive: boolean
}

export const campaignData: CampaignType[] = [
  {
    name: 'Spring Launch',
    icon: 'tabler:rocket',
    variant: 'primary',
    visitors: 502,
    newUsers: 260,
    sessions: 6845,
    bounceRate: 18.22,
    pageVisits: 3.15,
    avgDuration: '01:40',
    leads: 432,
    revenue: 3.64,
    conversion: 6.15,
    isPositive: true,
  },
  {
    name: 'Facebook Push',
    icon: 'tabler:brand-facebook',
    variant: 'info',
    visitors: 478,
    newUsers: 245,
    sessions: 6120,
    bounceRate: 21.03,
    pageVisits: 2.87,
    avgDuration: '01:28',
    leads: 398,
    revenue: 3.1,
    conversion: 5.65,
    isPositive: false,
  },
  {
    name: 'Holiday Buzz',
    icon: 'tabler:speakerphone',
    variant: 'success',
    visitors: 445,
    newUsers: 230,
    sessions: 5710,
    bounceRate: 23.12,
    pageVisits: 2.45,
    avgDuration: '01:22',
    leads: 372,
    revenue: 2.86,
    conversion: 5.12,
    isPositive: false,
  },
  {
    name: 'Email Reconnect',
    icon: 'tabler:mail-fast',
    variant: 'warning',
    visitors: 392,
    newUsers: 190,
    sessions: 5210,
    bounceRate: 25.74,
    pageVisits: 2.18,
    avgDuration: '01:50',
    leads: 340,
    revenue: 2.45,
    conversion: 4.88,
    isPositive: false,
  },
  {
    name: 'Display Retarget',
    icon: 'tabler:broadcast',
    variant: 'muted',
    visitors: 338,
    newUsers: 160,
    sessions: 4670,
    bounceRate: 19.88,
    pageVisits: 1.92,
    avgDuration: '02:05',
    leads: 298,
    revenue: 1.95,
    conversion: 4.62,
    isPositive: false,
  },
]

export type QuickMessageType = {
  image?: string
  name: string
  message: string
  time?: string
  totalMessages?: {
    value: number
    variant: string
  }
  isOnline?: boolean
}

export const quickMessageData: QuickMessageType[] = [
  {
    image: user3,
    name: 'Lucas Miller',
    message: 'active now',
    totalMessages: { value: 5, variant: 'danger' },
    isOnline: true,
  },
  {
    image: user4,
    name: 'Amelia Green',
    message: 'See you soon!',
    time: '25min ago',
  },
  {
    name: 'Sophia Turner',
    message: 'Good Morning! 👋',
    totalMessages: { value: 1, variant: 'success' },
  },
  {
    image: user6,
    name: 'Noah Smith',
    message: "Let's catch up later.",
    time: '1h ago',
  },
  {
    image: user7,
    name: 'Emma Johnson',
    message: 'Sent you the files.',
    time: '3h ago',
  },
]

export const postChartOptions: () => ApexOptions = () => ({
  chart: {
    type: 'area',
    height: 60,
    sparkline: {
      enabled: true,
    },
  },
  stroke: {
    curve: 'smooth',
    width: 1.5,
  },
  fill: {
    opacity: 1,
    gradient: {
      shade: '#1ab394',
      type: 'horizontal',
      shadeIntensity: 0.5,
      inverseColors: true,
      opacityFrom: 0.1,
      opacityTo: 0.2,
      stops: [0, 80, 100],
      colorStops: [],
    },
  },
  series: [
    {
      data: [4, 8, 5, 10, 4, 16, 5, 11, 6, 11, 30, 10, 13, 4, 6, 3, 6],
    },
  ],
  yaxis: {
    min: 0,
  },
  colors: [getColor('chart-primary')],
  tooltip: {
    enabled: false,
  },
})

export const orderChartOptions: () => ApexOptions = () => ({
  series: [
    {
      type: 'column',
      data: [
        [0, 2],
        [1, 3],
        [2, 4],
        [3, 8],
        [4, 5],
        [5, 12],
        [6, 17],
        [7, 19],
        [8, 6],
        [9, 9],
        [10, 14],
        [11, 17],
        [12, 12],
        [13, 6],
        [14, 4],
      ],
    },
    {
      type: 'column',
      data: [
        [0, 9],
        [1, 7],
        [2, 4],
        [3, 8],
        [4, 4],
        [5, 12],
        [6, 4],
        [7, 6],
        [8, 5],
        [9, 10],
        [10, 4],
        [11, 5],
        [12, 10],
        [13, 2],
        [14, 6],
      ],
    },
  ],
  chart: {
    type: 'bar',
    height: 60,
    width: 205,
    parentHeightOffset: 0,
    stacked: true,
    sparkline: {
      enabled: true,
    },
  },
  states: {
    hover: {
      filter: {
        type: 'none',
      },
    },
    active: {
      filter: {
        type: 'none',
      },
    },
  },
  colors: [getColor('chart-primary'), getColor('chart-gray')],
  plotOptions: {
    bar: {
      columnWidth: '60%',
    },
  },
  stroke: {
    curve: 'straight',
    lineCap: 'square',
  },
  tooltip: {
    enabled: false,
    onDatasetHover: {
      highlightDataSeries: false,
    },
    x: {
      show: false,
    },
  },
})

export type MeetingType = {
  title: string
  subtitle: string
  variant: string
  user: {
    name: string
    image?: string
  }[]
  icon: string
}

export const meetingData: MeetingType[] = [
  {
    title: 'Design Review Meeting',
    subtitle: '30 minute session with UI/UX team',
    variant: 'warning',
    user: [{ name: 'Liam Carter', image: user5 }, { name: 'Zoe Miles', image: user6 }, { name: 'D' }],
    icon: 'tabler:brand-figma',
  },
  {
    title: 'Sprint Planning Session',
    subtitle: '1 hour agile team meeting',
    variant: 'success',
    user: [
      { name: 'Ava Lee', image: user7 },
      { name: 'Ethan King', image: user8 },
      { name: 'Lucas White', image: user9 },
    ],
    icon: 'tabler:calendar-event',
  },
]
