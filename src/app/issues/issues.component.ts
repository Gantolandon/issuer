import {Component, OnDestroy, OnInit} from '@angular/core';
import { Issue } from '../api/issue.class';
import { IssuesService } from '../issues.service';
import {Observable, of, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter, tap, switchMap, startWith, defaultIfEmpty, map} from 'rxjs/operators';
import * as _ from 'lodash';

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
      map((issues) => {
        const starredItemsArray = JSON.parse(localStorage.getItem('starred'));
        const changedIssues = issues;
        if (starredItemsArray) {
          changedIssues.forEach((issue) => issue.starred = _.indexOf(starredItemsArray, issue.url) !== -1);
        }
        return changedIssues;
      }),
      tap(() => {
        this.issuesLoading = false;
      })
    );
  }

  onFavorite(issue: Issue) {
    issue.starred = !issue.starred;
    let starredItemsArray = JSON.parse(localStorage.getItem('starred')) || [];
    if (issue.starred) {
      starredItemsArray.push(issue.url);
    } else {
      _.remove(starredItemsArray, (i) => i === issue.url);
    }
    localStorage.setItem('starred', JSON.stringify(starredItemsArray));
  }

}
