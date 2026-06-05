import { ChangeDetectorRef, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { DropzoneConfigInterface, DropzoneModule } from 'ngx-dropzone-wrapper'
import { Icon } from '../icon/icon'

type UploadedFile = {
  name: string
  size: number
  type: string
  dataURL?: string
  loading?: boolean
}

@Component({
  selector: 'app-file-uploader',
  imports: [DropzoneModule, RouterLink, Icon],
  templateUrl: './file-uploader.html',
})
export class FileUploader {
  constructor(private cdr: ChangeDetectorRef) {}
  formatFileSize = (bytes: number) => {
    const kb = bytes / 1024
    const mb = kb / 1024
    const gb = mb / 1024

    if (gb >= 1) {
      return `${gb.toFixed(2)} GB`
    } else if (mb >= 1) {
      return `${mb.toFixed(2)} MB`
    } else {
      return `${kb.toFixed(2)} KB`
    }
  }

  uploadedFiles: UploadedFile[] = []

  public config: DropzoneConfigInterface = {
    url: 'https://httpbin.org/post',
    clickable: true,
    previewsContainer: false,
    maxFiles: 50,
    acceptedFiles: 'image/*',
  }

  imageURL: string = ''

  onFileAdded(file: File): void {
    console.log('file', file)
    const reader = new FileReader()
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const dataUrl = e.target?.result as string
      this.uploadedFiles.push({
        name: file.name,
        size: file.size,
        type: file.type,
        dataURL: dataUrl,
      })
      this.cdr.detectChanges()
    }
    reader.readAsDataURL(file)
  }

  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1)
  }
}
