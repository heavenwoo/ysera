import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  transform(value: string | null | undefined, keyword: string): string {
    value = value ?? '';
    if (!keyword) return value;
    const regExp = new RegExp(keyword, 'ig');
    return value.replace(regExp, '[$1]');
  }
}
