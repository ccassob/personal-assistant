import { Type } from '@angular/core'
import { AddressInfo } from './components/address-info/address-info'
import { CourseInfo } from './components/course-info/course-info'
import { Documents } from './components/documents/documents'
import { ParentInfo } from './components/parent-info/parent-info'
import { StudentInfo } from './components/student-info/student-info'

export type formStepType = {
  icon: string
  title: string
  subtitle: string
  content: Type<any>
}

export const formStepData: formStepType[] = [
  {
    icon: 'user-circle',
    title: 'Student Info',
    subtitle: 'Personal details',
    content: StudentInfo,
  },
  {
    icon: 'map-pin',
    title: 'Address Info',
    subtitle: 'Where you live',
    content: AddressInfo,
  },
  {
    icon: 'book',
    title: 'Course Info',
    subtitle: 'Select your course',
    content: CourseInfo,
  },
  {
    icon: 'users',
    title: 'Parent Info',
    subtitle: 'Guardian details',
    content: ParentInfo,
  },
  {
    icon: 'folder-open',
    title: 'Documents',
    subtitle: 'Upload certificates',
    content: Documents,
  },
]
