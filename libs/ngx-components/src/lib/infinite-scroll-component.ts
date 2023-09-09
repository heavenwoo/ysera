import { BehaviorSubject, debounceTime, distinct, filter, fromEvent, map, merge } from "rxjs";

export abstract class InfiniteScrollComponent {
  protected cache: any[] = [];
  protected itemHeight!: number;
  protected numberOfItems!: number;
  private pageByManual$ = new BehaviorSubject("");

  private pageByScroll$ = fromEvent(window, "scroll").pipe(
    map(() => window.scrollY),
    filter((current) => current >= document.body.clientHeight - window.innerHeight),
    debounceTime(200),
    distinct(),
    map((y) => Math.ceil((y + window.innerHeight) / (this.itemHeight * this.numberOfItems)))
  );
  private pageByResize$ = fromEvent(window, "resize").pipe(
    debounceTime(200),
    map(
      () =>
        Math.ceil(
          (window.innerHeight + document.body.scrollTop) / (this.itemHeight * this.numberOfItems)
        ) as number
    )
  );
  protected pageToLoad$ = merge(this.pageByManual$, this.pageByScroll$, this.pageByResize$).pipe(
    distinct()
  );
}
