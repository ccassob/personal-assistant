export type MessageContentType = {
  title: string
  timestamp: string
  content: string
}

export type MessageType = {
  id: string
  name: string
  date: string
  location: string
  summary: string
  badge?: {
    label: string
    className: string
  }
  body: MessageContentType
}

export const messageData: MessageType[] = [
  {
    id: 'tab-1',
    name: 'Emily Carter',
    date: '12.04.2025',
    location: 'New Haven, CT',
    summary: 'Completed your project milestone and uploaded the final report to the shared folder.',
    body: {
      title: 'Potential Partnership Opportunity',
      timestamp: 'Tuesday, 16 April 2025, 11:48 AM',
      content: `
       <p>Hello Maria,</p>
                                        <p>I hope you're well. I'm reaching out to explore a potential partnership between our teams. We've been following your recent product launches and believe there's strong synergy between our platforms.</p>
                                        <p>We'd love to schedule a quick 30-minute call next week to discuss how we might collaborate on upcoming campaigns. Please let me know what your availability looks like.</p>
                                        <p>Looking forward to your thoughts.</p>

                                        <p class="fst-italic">
                                            <strong>
                                                Best,
                                                <br />
                                                David Lee
                                            </strong>
                                            <br />
                                            Business Development Lead
                                        </p>
      `,
    },
  },
  {
    id: 'tab-2',
    name: 'Marcus Lee',
    date: '10.04.2025',
    location: 'San Francisco, CA',
    summary: 'Scheduled a team sync for next Monday to review current backlog and sprint goals.',
    badge: { label: 'Special', className: 'text-bg-primary' },
    body: {
      title: 'Project Feedback & Next Steps',
      timestamp: 'Thursday, 18 April 2025, 2:15 PM',
      content: ` <p>Hi Jason,</p>
            <p>
              Thank you for sharing the latest draft of the landing page. The new layout looks clean
              and intuitive, especially the improvements made to the hero section and the pricing
              table. I also appreciated how responsive the mobile version feels.
            </p>
            <p>Here are a few suggestions to consider before we proceed with deployment:</p>
            <ul>
              <li>Update the CTA button color to match our brand palette (#3A86FF).</li>
              <li>
                Replace the placeholder text in the testimonial section with actual client feedback.
              </li>
              <li>Add a subtle animation to the "Features" icons on hover.</li>
            </ul>
            <p>
              Once these changes are in place, we can finalize the QA pass and move on to staging.
              Let me know if you need any additional assets or approvals on my end.
            </p>

            <p class="fst-italic">
              <strong>
                Best regards,
                <br />
                Stephanie Harris
              </strong>
              <br />
              Senior Product Manager
            </p>`,
    },
  },
  {
    id: 'tab-3',
    name: 'Natalie Brooks',
    date: '08.04.2025',
    location: 'Austin, TX',
    summary: 'Sent over the feedback for your design proposal. Waiting on final tweaks.',
    body: {
      title: 'Invoice #INV-1043 Due Soon',
      timestamp: 'Friday, 19 April 2025, 9:22 AM',
      content: `<p>Dear Ms. Patel,</p>
                                        <p>
                                            This is a gentle reminder that invoice
                                            <strong>#INV-1043</strong>
                                            for your March 2025 subscription will be due on
                                            <strong>April 22, 2025</strong>
                                            .
                                        </p>
                                        <p>Kindly ensure the payment is processed before the due date to avoid any disruption of services. You can view and pay the invoice via your account dashboard.</p>
                                        <p>If you've already made the payment, please disregard this email.</p>

                                        <p class="fst-italic">
                                            <strong>
                                                Kind regards,
                                                <br />
                                                Emily Zhang
                                            </strong>
                                            <br />
                                            Finance Team – CloudCore Solutions
                                        </p>`,
    },
  },
  {
    id: 'tab-4',
    name: 'Daniel Kim',
    date: '07.04.2025',
    location: 'Seattle, WA',
    summary: "Submitted the final invoice for Q1 deliverables. Let me know if anything's missing.",
    body: {
      title: "We'd love your feedback!",
      timestamp: 'Wednesday, 17 April 2025, 3:15 PM',
      content: ` <p>Hi Jordan,</p>
                                        <p>We hope you're enjoying your experience with TaskFlow Pro. We'd really appreciate it if you could take 2 minutes to share your thoughts with us.</p>
                                        <p>Your feedback helps us make TaskFlow better for everyone. Let us know what features you love and what we could improve.</p>
                                        <p>Thanks for being part of our community!</p>

                                        <p class="fst-italic">
                                            <strong>
                                                Cheers,
                                                <br />
                                                Nicole Ray
                                            </strong>
                                            <br />
                                            Customer Experience – TaskFlow Pro
                                        </p>`,
    },
  },
  {
    id: 'tab-5',
    name: 'Amelia Ross',
    date: '06.04.2025',
    location: 'Denver, CO',
    summary: 'Your access to the internal beta environment has been approved. Welcome aboard!',
    body: {
      title: 'Your support ticket #45782 has been resolved',
      timestamp: 'Saturday, 20 April 2025, 5:42 PM',
      content: `           <p>Hello Elias,</p>
                                        <p>We're pleased to inform you that your support ticket (#45782) regarding API rate limits has been resolved.</p>
                                        <p>The issue was caused by a misconfigured webhook, which we've now fixed on our end. Please feel free to test your integration again.</p>
                                        <p>If you experience any further issues, don't hesitate to reach out.</p>

                                        <p class="fst-italic">
                                            <strong>
                                                Best regards,
                                                <br />
                                                Technical Support Team
                                            </strong>
                                            <br />
                                            Apex Cloud Systems
                                        </p>`,
    },
  },
  {
    id: 'tab-6',
    name: 'Jason Park',
    date: '05.04.2025',
    location: 'Boston, MA',
    summary: "Please review the attached contract and let me know if you'd like to make edits.",
    body: {
      title: 'Please review the attached contract',
      timestamp: 'Friday, 19 April 2025, 9:15 AM',
      content: ` <p>Hi Elias,</p>
                                        <p>I’ve attached the revised version of the partnership agreement we discussed during last week’s call. Please take a moment to review and let me know if you'd like to propose any changes.</p>
                                        <p>Once approved, we can move forward with signatures and onboarding.</p>
                                        <p>Looking forward to your feedback.</p>

                                        <p class="fst-italic">
                                            <strong>
                                                Best,
                                                <br />
                                                Jason Park
                                            </strong>
                                            <br />
                                            Contracts & Legal Affairs
                                        </p>`,
    },
  },
  {
    id: 'tab-7',
    name: 'Sophia White',
    date: '03.04.2025',
    location: 'Miami, FL',
    summary: 'Reminder: Your subscription will renew in 3 days. Update billing details if needed.',
    badge: { label: 'Reminder', className: 'text-bg-warning' },
    body: {
      title: 'Upcoming Subscription Renewal Notice',
      timestamp: 'Wednesday, 17 April 2025, 2:10 PM',
      content: `              <p>Dear Elias,</p>
                                        <p>This is a reminder that your premium subscription to InsightPro will automatically renew on 20 April 2025.</p>
                                        <p>If you wish to make changes to your billing or cancel your subscription, please visit your account settings before the renewal date.</p>
                                        <p>We appreciate your continued support.</p>

                                        <p class="fst-italic">
                                            <strong>
                                                Warm regards,
                                                <br />
                                                Sophia White
                                            </strong>
                                            <br />
                                            Billing Department
                                            <br />
                                            InsightPro Services
                                        </p>`,
    },
  },
]
