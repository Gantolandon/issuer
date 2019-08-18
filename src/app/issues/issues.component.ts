import {Component, OnDestroy, OnInit} from '@angular/core';
import { Issue } from '../api/issue.class';
import { IssuesService } from '../issues.service';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, tap, switchMap, startWith, defaultIfEmpty} from 'rxjs/operators';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.less']
})
export class IssuesComponent implements OnInit {

  constructor(private issuesService: IssuesService) { }

  public issues$: Observable<Issue[]>;
  public searchString$ = new Subject<string>();
  private issuesLoading = false;

  ngOnInit() {
    this.issues$ = this.searchString$.pipe(
      distinctUntilChanged(),
      debounceTime(2000),
      filter((searchString) => searchString.length > 1),
      switchMap((searchString) => {
        setTimeout(() => {
          this.issuesLoading = true;
        });
        return this.issuesService.getIssues(searchString);
      }),
      defaultIfEmpty([]),
      tap(() => {
        this.issuesLoading = false;
      })
    );
  }

}
