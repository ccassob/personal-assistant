import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import * as JsDiff from 'diff'

@Component({
  selector: 'app-text-diff',
  imports: [PageBreadcrumb, FormsModule],
  templateUrl: './text-diff.html',
  styles: ``,
})
export class TextDiff {
  originalText: string = `On a rainy Monday morning in a small town, Emma walked into her favorite café, her umbrella dripping and her hair slightly frizzy from the storm. She always ordered the same thing: black coffee, two sugars, and a blueberry muffin. But today, someone was already sitting at her usual table by the window. It was Jack — a quiet man with a book in hand and headphones around his neck. Their eyes met for a second. He smiled and motioned for her to join him. Hesitant but intrigued, Emma accepted.`

  changedText: string = `On a rainy Monday morning in a small town, Emma stepped into her favorite café, her umbrella dripping and her hair slightly frizzy from the damp weather. She always ordered the same thing: black coffee with two sugars and a blueberry muffin. But today, someone was already seated at her usual window table. It was Jack — a quiet man with a book in one hand and headphones resting around his neck. Their eyes met briefly. He smiled and gestured for her to join him. Hesitant but curious, Emma agreed.`

  diffResult: string = ''

  constructor() {
    this.computeDiff()
  }

  computeDiff() {
    const diff = JsDiff.diffWords(this.originalText, this.changedText)
    this.diffResult = diff
      .map((part: JsDiff.Change) => {
        if (part.added) return `<span class="bg-success-subtle text-success">${part.value}</span>`
        if (part.removed) return `<span class="bg-danger-subtle text-danger text-decoration-line-through">${part.value}</span>`
        return part.value
      })
      .join('')
  }
}
