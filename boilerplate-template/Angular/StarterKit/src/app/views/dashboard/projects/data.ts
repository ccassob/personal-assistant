import { getColor } from '@/app/utils/string'
import { EChartsOption, TooltipComponentFormatterCallbackParams } from 'echarts'

const user1 = 'assets/images/users/user-1.jpg'
const user4 = 'assets/images/users/user-4.jpg'
const user6 = 'assets/images/users/user-6.jpg'
const user7 = 'assets/images/users/user-7.jpg'
const user8 = 'assets/images/users/user-8.jpg'
const user9 = 'assets/images/users/user-9.jpg'
const user10 = 'assets/images/users/user-10.jpg'

export type MessageType = {
  title: string
  time: string
  variant: string
}

export const messageData: MessageType[] = [
  {
    title: 'Reviewed project proposal',
    time: '09:30 AM',
    variant: 'primary',
  },
  {
    title: 'Team stand-up meeting',
    time: '11:00 AM',
    variant: 'info',
  },
  {
    title: 'Sent client invoice',
    time: '01:15 PM',
    variant: 'secondary',
  },
  {
    title: 'Responded to support tickets',
    time: '03:40 PM',
    variant: 'light',
  },
  {
    title: 'Finalized design mockups',
    time: '05:10 PM',
    variant: 'warning',
  },
]

export const revenueChartOptions = (): EChartsOption => ({
  textStyle: {
    fontFamily: getComputedStyle(document.body).fontFamily,
  },
  tooltip: {
    trigger: 'axis',
    padding: [5, 0],
    backgroundColor: getColor('secondary-bg'),
    borderColor: getColor('border-color'),
    textStyle: { color: getColor('light-text-emphasis') },
    borderWidth: 1,
    transitionDuration: 0.125,
    axisPointer: { type: 'none' },
    shadowBlur: 2,
    shadowColor: 'rgba(76, 76, 92, 0.15)',
    shadowOffsetX: 0,
    shadowOffsetY: 1,
    formatter: (params: TooltipComponentFormatterCallbackParams) => {
      const items = Array.isArray(params) ? params : [params]
      const title = items[0].name
      let content = `<div style="font-size: 14px; font-weight: 600; text-transform: uppercase; border-bottom: 1px solid ${getColor('border-color')}; margin-bottom: 8px; padding: 3px 10px 8px;">${title}</div>`
      items.forEach((item) => {
        const valueLabel = item.seriesName === 'Total Revenue' ? `$${item.value}` : `${item.value} sales`
        content += `<div style="margin-top: 4px; padding: 3px 15px;">
                          <span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${item.color};"></span>
                          ${item.seriesName} : <strong>${valueLabel}</strong>
                        </div>`
      })
      return content
    },
  },
  xAxis: {
    type: 'category',
    data: Array.from({ length: 15 }, (_, i) => `Day ${i + 1}`),
    boundaryGap: false,
    axisLine: {
      show: false,
    },
    axisTick: { show: false },
    axisLabel: {
      color: getColor('secondary-color'),
      margin: 15,
    },
    splitLine: { show: false },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        color: '#676b891f',
        type: 'dashed',
      },
    },
    //  boundaryGap: false,
    axisLabel: {
      show: true,
      color: getColor('secondary-color'),
      margin: 15,
      formatter: function (value) {
        return '$' + value // Format x-axis labels with a dollar sign
      },
    },
    axisTick: { show: false },
    axisLine: { show: false },
  },
  series: [
    {
      name: 'Total Revenue',
      type: 'line',
      smooth: true,
      symbolSize: 2,
      itemStyle: {
        color: getColor('primary'),
        borderColor: getColor('primary'),
        borderWidth: 2,
      },
      areaStyle: {
        opacity: 0.2,
        color: getColor('primary'),
      },
      lineStyle: {
        color: getColor('primary'),
      },
      symbol: 'circle',
      stack: 'data',
      data: [45, 88, 120, 160, 210, 240, 350, 420, 380, 500, 640, 710, 890, 1150, 1200],
    },
    {
      name: 'Orders',
      type: 'line',
      smooth: true,
      symbolSize: 2,
      itemStyle: {
        color: getColor('secondary'),
        borderColor: getColor('secondary'),
        borderWidth: 2,
      },
      areaStyle: {
        opacity: 0.2,
        color: getColor('secondary'),
      },
      lineStyle: {
        color: getColor('secondary'),
      },
      symbol: 'circle',
      stack: 'data',
      data: [15, 30, 35, 50, 55, 75, 95, 120, 135, 160, 180, 210, 250, 390, 450],
    },
  ],
  grid: {
    right: 0,
    left: 0,
    bottom: 5,
    top: 0,
    containLabel: true,
  },
})

export const projectProgressChartOptions = (): EChartsOption => ({
  tooltip: {
    trigger: 'item',
    padding: [8, 15],
    backgroundColor: getColor('secondary-bg'),
    borderColor: getColor('border-color'),
    textStyle: { color: getColor('light-text-emphasis') },
    borderWidth: 1,
    transitionDuration: 0.125,
    axisPointer: { type: 'none' },
    shadowBlur: 2,
    shadowColor: 'rgba(76, 76, 92, 0.15)',
    shadowOffsetX: 0,
    shadowOffsetY: 1,
  },
  textStyle: {
    fontFamily: getComputedStyle(document.body).fontFamily,
  },
  series: [
    {
      name: 'Project Progress',
      type: 'pie',
      radius: [60, 100],
      center: ['50%', '50%'],
      roseType: 'area',
      itemStyle: {
        borderRadius: 8,
      },
      label: {
        color: getColor('secondary-color'),
      },
      data: [
        { value: 85, name: 'Website Redesign', itemStyle: { color: getColor('primary') } },
        {
          value: 70,
          name: 'Mobile App',
          itemStyle: { color: getColor('secondary') },
        },
        { value: 55, name: 'CRM Integration', itemStyle: { color: getColor('info') } },
        {
          value: 60,
          name: 'Product Launch',
          itemStyle: { color: getColor('success') },
        },
        { value: 75, name: 'Backend Refactor', itemStyle: { color: getColor('light') } },
        {
          value: 50,
          name: 'Client Dashboard',
          itemStyle: { color: getColor('warning') },
        },
      ],
    },
  ],
})

export type StatisticType = {
  title: string
  description: string
  badge: string
  icon: string
  count: { value: number; prefix?: string; suffix?: string }
  badgeVariant: string
  variant: string
  totalCount: { value: number; prefix?: string; suffix?: string }
}

export const statisticData: StatisticType[] = [
  {
    title: 'My Tasks',
    description: 'Total Tasks',
    badge: '+3 New',
    icon: 'tabler:checklist',
    count: { value: 124 },
    badgeVariant: 'primary',
    variant: 'primary',
    totalCount: { value: 12450 },
  },
  {
    title: 'Messages',
    description: 'Total Messages',
    badge: '+5 New',
    icon: 'tabler:message-circle',
    count: { value: 69.5, suffix: 'k' },
    badgeVariant: 'secondary',
    variant: 'secondary',
    totalCount: { value: 32.1, suffix: 'M' },
  },
  {
    title: 'Approvals',
    description: 'Total Approvals',
    badge: '+2 New',
    icon: 'tabler:file-check',
    count: { value: 32 },
    badgeVariant: 'light',
    variant: 'dark',
    totalCount: { value: 1024 },
  },
  {
    title: 'Clients',
    description: 'Total Clients',
    badge: '+4 New',
    icon: 'tabler:users',
    count: { value: 184 },
    badgeVariant: 'secondary',
    variant: 'secondary',
    totalCount: { value: 9835 },
  },
  {
    title: 'Revenue',
    description: 'Total Revenue',
    badge: '+1.5 New',
    icon: 'tabler:credit-card',
    count: { prefix: '$', value: 125.5, suffix: 'k' },
    badgeVariant: 'primary',
    variant: 'primary',
    totalCount: { prefix: '$', value: 12.5, suffix: 'M' },
  },
]

function generateRandomData() {
  const dataName = ['A', 'B', 'C']
  const randomData = dataName.map((name) => ({
    name: name,
    value: Math.floor(Math.random() * 100) + 1,
  }))
  const total = randomData.reduce((sum, item) => sum + item.value, 0)
  randomData.forEach((item) => {
    item.value = (item.value / total) * 100
  })
  return randomData
}

export type QuarterlyReportType = {
  quarter: string
  period: string
  revenue: string
  expense: string
  margin: string
  chartOptions?: () => EChartsOption
}

export const quarterlyReportData: QuarterlyReportType[] = [
  {
    quarter: 'Quarter 1',
    period: 'January - March 2024',
    revenue: '$210k',
    expense: '$165k',
    margin: '$45k',
    chartOptions: () => ({
      tooltip: { show: false },
      series: [
        {
          type: 'pie',
          radius: ['65%', '100%'],
          hoverAnimation: false,
          label: { show: false },
          labelLine: { show: false },
          data: generateRandomData().map((item, index) => ({
            value: item.value,
            itemStyle: {
              color: index === 0 ? getColor('chart-primary') : index === 1 ? getColor('chart-secondary') : '#bbcae14d',
            },
          })),
        },
      ],
    }),
  },
  {
    quarter: 'Quarter 2',
    period: 'April - June 2024',
    revenue: '$225k',
    expense: '$175k',
    margin: '$50k',
    chartOptions: () => ({
      tooltip: { show: false },
      series: [
        {
          type: 'pie',
          radius: ['65%', '100%'],
          hoverAnimation: false,
          label: { show: false },
          labelLine: { show: false },
          data: generateRandomData().map((item, index) => ({
            value: item.value,
            itemStyle: {
              color: index === 0 ? getColor('chart-primary') : index === 1 ? getColor('chart-secondary') : '#bbcae14d',
            },
          })),
        },
      ],
    }),
  },
  {
    quarter: 'Quarter 3',
    period: 'July - September 2024',
    revenue: '$240k',
    expense: '$190k',
    margin: '$50k',
    chartOptions: () => ({
      tooltip: { show: false },
      series: [
        {
          type: 'pie',
          radius: ['65%', '100%'],
          hoverAnimation: false,
          label: { show: false },
          labelLine: { show: false },
          data: generateRandomData().map((item, index) => ({
            value: item.value,
            itemStyle: {
              color: index === 0 ? getColor('chart-primary') : index === 1 ? getColor('chart-secondary') : '#bbcae14d',
            },
          })),
        },
      ],
    }),
  },
  {
    quarter: 'Quarter 4',
    period: 'October - December 2024',
    revenue: '$260k',
    expense: '$200k',
    margin: '$60k',
    chartOptions: () => ({
      tooltip: { show: false },
      series: [
        {
          type: 'pie',
          radius: ['65%', '100%'],
          hoverAnimation: false,
          label: { show: false },
          labelLine: { show: false },
          data: generateRandomData().map((item, index) => ({
            value: item.value,
            itemStyle: {
              color: index === 0 ? getColor('chart-primary') : index === 1 ? getColor('chart-secondary') : '#bbcae14d',
            },
          })),
        },
      ],
    }),
  },
]

export type ProjectStatusType = {
  title: string
  value: number
  progress: number
  variant: string
}

export const projectStatusData: ProjectStatusType[] = [
  {
    title: 'Completed Projects',
    value: 180,
    progress: 54.2,
    variant: 'secondary',
  },
  {
    title: 'Ongoing Projects',
    value: 120,
    progress: 36.15,
    variant: 'info',
  },
  {
    title: 'Pending Approvals',
    value: 32,
    progress: 9.65,
    variant: 'secondary',
  },
]

export type TimelineItemType = {
  icon: string
  variant: string
  title: string
  badge: {
    text: string
    variant: string
  }
  time: string
  description: string
  image: string
  name: string
}

export const timelineData: TimelineItemType[] = [
  {
    icon: 'tabler:rocket',
    variant: 'primary',
    title: 'New Feature Released',
    badge: {
      text: 'Deploy',
      variant: 'info',
    },
    time: 'Today at 3:45 PM',
    description: 'Launched the real-time chat feature across all user accounts.',
    image: user6,
    name: 'Natalie Brooks',
  },
  {
    icon: 'tabler:calendar-event',
    variant: 'warning',
    title: 'Team Sync-Up',
    badge: {
      text: 'Meeting',
      variant: 'secondary',
    },
    time: 'Today at 2:00 PM',
    description: 'Reviewed sprint progress and discussed remaining tasks with the dev team.',
    image: user4,
    name: 'Oliver Grant',
  },
  {
    icon: 'tabler:palette',
    variant: 'success',
    title: 'UI Design Review',
    badge: {
      text: 'Design',
      variant: 'success',
    },
    time: 'Today at 1:15 PM',
    description: 'Updated component spacing and colors for improved accessibility.',
    image: user9,
    name: 'Clara Jensen',
  },
  {
    icon: 'tabler:database',
    variant: 'danger',
    title: 'Database Optimization',
    badge: {
      text: 'Backend',
      variant: 'danger',
    },
    time: 'Today at 12:30 PM',
    description: 'Improved DB query performance, reducing load time by 35%.',
    image: user10,
    name: 'Leo Armstrong',
  },
  {
    icon: 'tabler:shield-check',
    variant: 'info',
    title: 'Security Audit Completed',
    badge: {
      text: 'Audit',
      variant: 'warning',
    },
    time: 'Today at 11:00 AM',
    description: 'Completed internal security audit with no critical issues found.',
    image: user8,
    name: 'Liam Carter',
  },
  {
    icon: 'tabler:user-plus',
    variant: 'success',
    title: 'New Team Member Joined',
    badge: {
      text: 'Onboarding',
      variant: 'primary',
    },
    time: 'Today at 10:15 AM',
    description: 'Michael Lee has joined the development team as a Frontend Engineer.',
    image: user7,
    name: 'Emma Davis',
  },
]

export type UserMessageType = {
  name: string
  time: string
  message: string
  image?: string
}

export const userMessageData: UserMessageType[] = [
  {
    name: 'Alex Johnson',
    time: '10m ago',
    message: 'Excited to share our latest project update with everyone!',
    image: user8,
  },
  {
    name: 'Den Nowdya',
    time: '1h ago',
    message: 'Looking forward to the upcoming team meeting.',
  },
  {
    name: 'Michael Brown',
    time: '16h ago',
    message: "Great insights shared in today's brainstorming session!",
    image: user10,
  },
  {
    name: 'Emily Watson',
    time: '20h ago',
    message: 'Wrapping up an amazing design concept for the client.',
    image: user1,
  },
  {
    name: 'Monica Smith',
    time: '2 days ago',
    message: 'Testing some new UI enhancements—excited for feedback!',
    image: user6,
  },
]
