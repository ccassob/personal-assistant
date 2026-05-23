import { Component, TemplateRef, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Icon } from '@app/components/icon/icon'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular'
import { CalendarOptions, EventApi, EventClickArg } from '@fullcalendar/core/index.js'
import dayGridPlugin from '@fullcalendar/daygrid/index.js'
import interactionPlugin, { DateClickArg, Draggable } from '@fullcalendar/interaction/index.js'
import listPlugin from '@fullcalendar/list/index.js'
import timeGridPlugin from '@fullcalendar/timegrid/index.js'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { SimplebarAngularModule } from 'simplebar-angular'
import { externalEventData, initialEventData } from './data'

@Component({
  selector: 'app-calendar',
  imports: [PageBreadcrumb, FullCalendarModule, Icon, SimplebarAngularModule, FormsModule],
  templateUrl: './calendar.html',
  styles: ``,
})
export class Calendar {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent
  @ViewChild('eventModal') eventModal!: TemplateRef<any>

  currentEventTitle: string = ''
  currentEventVariant: string = ''
  currentEditingEvent: EventApi | null = null
  modalRef!: NgbModalRef
  selectedDate: Date | null = null

  initialEventData = initialEventData

  externalEventData = externalEventData

  calendarOptions!: CalendarOptions

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin],
      initialView: 'dayGridMonth',
      themeSystem: 'bootstrap',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
      },
      buttonText: {
        today: 'Today',
        month: 'Month',
        week: 'Week',
        day: 'Day',
        list: 'List',
        prev: 'Prev',
        next: 'Next',
      },
      slotDuration: '00:30:00',
      slotMinTime: '07:00:00',
      slotMaxTime: '19:00:00',

      height: window.innerHeight - 240,
      editable: true,
      droppable: true,
      selectable: true,
      events: this.initialEventData,
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventDidMount: (info) => {
        const className = info.event.extendedProps['className']
        if (className) {
          const classes = className.split(' ')
          for (const c of classes) {
            info.el.classList.add(c)
          }
        }
      },
    }
  }

  ngAfterViewInit(): void {
    const containerEl = document.getElementById('external-events')
    if (containerEl) {
      new Draggable(containerEl, {
        itemSelector: '.external-event',
        eventData: function (eventEl) {
          const title = eventEl.innerText.trim()
          const className = eventEl.getAttribute('data-class') || ''
          return {
            title,
            extendedProps: { className },
          }
        },
      })
    }
  }

  offsetDate(days: number): Date {
    return new Date(new Date().setDate(new Date().getDate() + days))
  }

  handleDateClick(arg: DateClickArg): void {
    this.selectedDate = arg.date
    this.openModal()
  }

  handleEventClick(arg: EventClickArg): void {
    this.openModal(arg.event)
  }

  openModal(event?: EventApi): void {
    this.currentEditingEvent = event || null
    this.currentEventTitle = event?.title || ''
    this.currentEventVariant = event?.extendedProps['className'] || ''
    this.modalRef = this.modalService.open(this.eventModal, { centered: true })
  }

  saveEvent(): void {
    if (!this.currentEventTitle || !this.currentEventVariant) return
    const calendarApi = this.calendarComponent.getApi()

    if (this.currentEditingEvent) {
      const oldEvent = this.currentEditingEvent.toPlainObject()
      this.currentEditingEvent.remove()
      calendarApi.addEvent({
        ...oldEvent,
        title: this.currentEventTitle,
        extendedProps: {
          className: this.currentEventVariant,
        },
      })
    } else {
      calendarApi.addEvent({
        id: String(Date.now()),
        title: this.currentEventTitle,
        start: this.selectedDate ?? new Date(),
        allDay: true,
        extendedProps: {
          className: this.currentEventVariant,
        },
      })
    }

    this.modalRef.close()
    this.selectedDate = null
    this.currentEventVariant = ''
  }

  deleteEvent(): void {
    this.currentEditingEvent?.remove()
    this.modalRef.close()
    this.selectedDate = null
    this.currentEventVariant = ''
  }
}
