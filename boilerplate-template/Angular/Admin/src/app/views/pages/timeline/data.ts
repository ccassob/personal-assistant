const user1 = 'assets/images/users/user-1.jpg'
const user2 = 'assets/images/users/user-2.jpg'
const user3 = 'assets/images/users/user-3.jpg'
const user4 = 'assets/images/users/user-4.jpg'
const user5 = 'assets/images/users/user-5.jpg'

export type TimelineType = {
  time?: string
  title: string
  description: string
  name: string
  className?: string
  image?: string
  icon?: string
}

export const basicTimeline: TimelineType[] = [
  {
    time: 'Just Now',
    title: 'Weekly Stand-Up Meeting',
    description: 'Team members shared updates, discussed blockers, and aligned on weekly goals.',
    name: 'Olivia Rodriguez',
    className: 'bg-primary',
  },
  {
    time: '10:00 AM, Tuesday',
    title: 'Project Kickoff',
    description: 'Introduced project scope, goals, and assigned initial roles to team members.',
    name: 'Isabella Cooper',
    className: 'bg-danger',
  },
  {
    time: 'Yesterday, 3:15 PM',
    title: 'Design Review',
    description: 'Reviewed initial UI mockups and gathered feedback for the next design iteration.',
    name: 'Ethan Murphy',
    className: 'bg-warning',
  },
  {
    time: 'Monday, 1:00 PM',
    title: 'Client Feedback Session',
    description: 'Discussed client feedback and agreed on key changes for the next sprint.',
    name: 'Liam Chen',
    className: 'bg-info',
  },
  {
    time: 'Last Friday, 4:30 PM',
    title: 'Code Deployment',
    description: 'Successfully deployed the latest build to the staging environment.',
    name: 'Ava Thompson',
    className: 'bg-secondary',
  },
]

export const iconTimelineData: TimelineType[] = [
  {
    time: '5 mins ago',
    title: 'Bug Fix Deployed',
    description: 'Resolved a critical login issue affecting mobile users.',
    name: 'Marcus Bell',
    className: 'text-bg-primary',
    icon: 'bug',
  },
  {
    time: 'Today, 9:00 AM',
    title: 'Marketing Strategy Call',
    description: 'Outlined Q2 goals and content plan for the product launch campaign.',
    name: 'Emily Davis',
    className: 'bg-danger-subtle',
    icon: 'phone-call',
  },
  {
    time: 'Yesterday, 4:45 PM',
    title: 'Feature Planning Session',
    description: 'Prioritized new features for the upcoming release based on user feedback.',
    name: 'Daniel Kim',
    className: 'text-bg-warning',
    icon: 'copy',
  },
  {
    time: 'Tuesday, 11:30 AM',
    title: 'UI Enhancements Pushed',
    description: 'Improved dashboard responsiveness and added dark mode support.',
    name: 'Sofia Martinez',
    className: 'bg-info-subtle',
    icon: 'dashboard',
  },
  {
    time: 'Last Thursday, 2:20 PM',
    title: 'Security Audit Completed',
    description: 'Reviewed backend API endpoints and applied new encryption standards.',
    name: 'Jonathan Lee',
    className: 'text-bg-secondary',
    icon: 'shield-lock',
  },
]

export const userTimeline: TimelineType[] = [
  {
    title: 'Dashboard Revamp Completed',
    description: 'The new layout and theme for the analytics dashboard have been deployed.',
    name: 'Emma Carter',
    image: user1,
  },
  {
    title: 'Onboarding Guide Published',
    description: 'Uploaded the latest documentation to help new users get started quickly.',
    name: 'Noah Mitchell',
    image: user2,
  },
  {
    title: 'Performance Improvements',
    description: 'Reduced page load time by optimizing image assets and scripts.',
    name: 'Ava Morgan',
    image: user3,
  },
  {
    title: 'Security Patch Released',
    description: 'Patched a vulnerability related to token expiration in the API.',
    name: 'James Parker',
    image: user4,
  },
  {
    title: 'Client Training Session',
    description: 'Hosted a live training session with 30+ clients on the new reporting tools.',
    name: 'Sophia Bennett',
    image: user5,
  },
]

export const borderTimeline: TimelineType[] = [
  {
    time: '10 mins ago',
    title: 'New Feature Released',
    description: 'Launched the real-time chat feature across all user accounts.',
    name: 'Natalie Brooks',
    icon: 'rocket',
  },
  {
    time: 'Today, 11:15 AM',
    title: 'Team Sync-Up',
    description: 'Reviewed sprint progress and discussed remaining tasks.',
    name: 'Oliver Grant',
    icon: 'calendar-event',
  },
  {
    time: 'Yesterday, 2:40 PM',
    title: 'UI Design Review',
    description: 'Refined component spacing and color scheme for better accessibility.',
    name: 'Clara Jensen',
    icon: 'palette',
  },
  {
    time: 'Tuesday, 3:30 PM',
    title: 'Database Optimization',
    description: 'Refactored queries to reduce API response times by 35%.',
    name: 'Leo Armstrong',
    icon: 'database',
  },
  {
    time: 'Last Thursday, 5:00 PM',
    title: 'Compliance Check Passed',
    description: 'Successfully passed GDPR compliance audit with zero violations.',
    name: 'Mia Thompson',
    icon: 'lock',
  },
]
